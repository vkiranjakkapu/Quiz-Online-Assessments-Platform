package com.qoap.quiz.services.imp;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.qoap.quiz.dto.QuestionAnswersDto;
import com.qoap.quiz.dto.SaveAnswersDto;
import com.qoap.quiz.enums.AttemptStatus;
import com.qoap.quiz.exceptions.ForbiddenQuizAttemptException;
import com.qoap.quiz.exceptions.MalformedRequestException;
import com.qoap.quiz.exceptions.QuizException;
import com.qoap.quiz.exceptions.ResourceNotFoundException;
import com.qoap.quiz.models.Answer;
import com.qoap.quiz.models.Attempt;
import com.qoap.quiz.models.Question;
import com.qoap.quiz.models.QuestionOption;
import com.qoap.quiz.models.Quiz;
import com.qoap.quiz.repositories.AttemptRepository;
import com.qoap.quiz.services.AttemptsService;
import com.qoap.quiz.services.CurrentUserService;
import com.qoap.quiz.services.QuestionService;
import com.qoap.quiz.services.QuizService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttemptsServiceImp implements AttemptsService {

    private final AttemptRepository attemptRepository;

    private final QuizService quizService;
    private final QuestionService questionService;
    private final CurrentUserService currentUser;

    @Override
    @Transactional(readOnly = true)
    public List<Attempt> getAllAttempts() {
        return attemptRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Attempt> getAllAttemptsByQuizId(UUID quizId) {
        return attemptRepository.findAllByQuiz(Quiz.builder().id(quizId).build());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Attempt> getAllAttemptsByQuizIds(Set<UUID> quizIds) {
        return attemptRepository.findAllByQuizIdIn(quizIds);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Attempt> getAllAttemptsByStatus(AttemptStatus status) {
        return attemptRepository.findAllByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public Attempt getAttemptById(Long attemptId) {
        return attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt with given ID not found."));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Attempt> getAllAttemptsByStudent(UUID studentId) {
        return attemptRepository.findAllByStudentId(studentId);
    }

    @Override
    @Transactional
    public Attempt createAttempt(UUID quizId, UUID studentId) {
        return attemptRepository
                .save(Attempt.builder()
                        .quiz(quizService.getQuizById(quizId))
                        .studentId(studentId)
                        .build());
    }

    @Override
    @Transactional
    public Attempt saveAnswers(SaveAnswersDto request) {
        Attempt attempt = (request.attemptId() == null)
                ? createNewAttempt(request)
                : getAttemptById(request.attemptId());

        if (!attempt.getStudentId().equals(currentUser.userId())) {
            throw new ForbiddenQuizAttemptException("You are not allowed to answer this quiz attempt.");
        }
        if (attempt.getStatus().equals(AttemptStatus.SUBMITTED)
                || attempt.getStatus().equals(AttemptStatus.AUTO_COMPLETED)) {
            throw new QuizException("This quiz has been already submitted.");
        }

        // ? Update answers
        updateAnswers(request, attempt);

        // ? Updating timespent
        Duration timeSpent = Duration.between(attempt.getAttemptTime(), LocalDateTime.now());
        attempt.setTimeSpent(timeSpent);

        Quiz quiz = attempt.getQuiz();
        Duration maxDuration = quiz.getSettings().getMaxDuration();
        if (maxDuration != null && (maxDuration.minus(timeSpent).isNegative() || maxDuration.equals(timeSpent))) {
            attempt.setStatus(AttemptStatus.AUTO_COMPLETED);
        } else {
            attempt.setStatus(request.status());
        }

        return attemptRepository.save(attempt);
    }

    private Attempt createNewAttempt(SaveAnswersDto request) {
        return attemptRepository.save(Attempt.builder()
                .studentId(currentUser.userId())
                .quiz(quizService.getQuizById(request.quizId()))
                .build());
    }

    private void updateAnswers(SaveAnswersDto request, Attempt attempt) {
        List<Question> allQuestions = questionService.getAllQuestionsByIds(request.answers().stream()
                .filter(a -> Optional.ofNullable(a.questionId()).isPresent())
                .map(a -> a.questionId())
                .toList());

        Map<Long, Question> questionsMap = allQuestions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q, (q1, q2) -> q1));

        List<QuestionOption> allOptions = allQuestions.stream().flatMap(q -> q.getOptions().stream()).toList();
        Map<Long, QuestionOption> optionsMap = allOptions.stream()
                .collect(Collectors.toMap(QuestionOption::getId, op -> op, (op1, op2) -> op1));

        Map<Long, Long> answeredMap = new HashMap<>();
        Set<Long> unansweredQuestionIds = new HashSet<>();

        // ? verify student answers
        for (QuestionAnswersDto dto : request.answers()) {
            if (dto.questionId() == null) {
                throw new MalformedRequestException("Malformed Quiz Attempt Save Request Received!");
            }
            if (dto.answerId() != null) {
                if (!optionsMap.containsKey(dto.answerId())) {
                    throw new MalformedRequestException("Given Answer doesn't belong to this Quiz");
                }
                answeredMap.put(dto.questionId(), dto.answerId());
            } else {
                unansweredQuestionIds.add(dto.questionId());
            }
        }

        // ? Remove unAnswered
        attempt.getAnswers().removeIf(a -> unansweredQuestionIds.contains(a.getQuestion().getId()));

        // ? Update existing answers and add new answers
        Map<Long, Answer> existingAnswersMap = attempt.getAnswers().stream()
                .collect(Collectors.toMap(a -> a.getQuestion().getId(), a -> a, (a1, a2) -> a1));

        answeredMap.forEach((questionId, optionId) -> {
            Answer existingAnswer = existingAnswersMap.get(questionId);
            if (existingAnswer != null) {
                existingAnswer.setSelectedOption(optionsMap.get(optionId));
            } else {
                attempt.getAnswers().add(Answer.builder()
                        .attempt(attempt)
                        .question(questionsMap.get(questionId))
                        .selectedOption(optionsMap.get(optionId))
                        .build());
            }
        });
    }

}
