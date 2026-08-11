package com.qoap.quiz.services.imp;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.qoap.quiz.dto.AutoSaveRequestDto;
import com.qoap.quiz.dto.SaveAnswerDto;
import com.qoap.quiz.enums.CompletionStatus;
import com.qoap.quiz.exceptions.ResourceNotFoundException;
import com.qoap.quiz.models.Answer;
import com.qoap.quiz.models.Attempt;
import com.qoap.quiz.repositories.AttemptRepository;
import com.qoap.quiz.services.AnswersService;
import com.qoap.quiz.services.AttemptsService;
import com.qoap.quiz.services.OptionsService;
import com.qoap.quiz.services.QuestionService;
import com.qoap.quiz.services.QuizService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttemptsServiceImp implements AttemptsService {

    private final AttemptRepository attemptRepository;

    private final QuizService quizService;
    private final AnswersService answersService;
    private final QuestionService questionService;
    private final OptionsService optionsService;

    @Override
    @Transactional(readOnly = true)
    public List<Attempt> getAllAttempts() {
        return attemptRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Attempt> getAllAttemptsByStatus(CompletionStatus status) {
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
    public Attempt saveAnswer(SaveAnswerDto request) {
        Attempt attempt = getAttemptById(request.attemptId());
        attempt.setTimeSpent(request.timeSpent());

        Answer existingAnswer = answersService.getAnswerByAttemptAndQuestion(request.attemptId(), request.questionId());

        if (Optional.ofNullable(existingAnswer).isEmpty()) {
            Answer answer = Answer.builder()
                    .attempt(attempt)
                    .question(questionService.getQuestionById(request.questionId()))
                    .selectedOption(optionsService.getOptionById(request.selectedOptionId()))
                    .build();
            answersService.createAnswer(answer);
        } else {
            existingAnswer.setSelectedOption(optionsService.getOptionById(request.selectedOptionId()));
            answersService.createAnswer(existingAnswer);
        }

        return attemptRepository.save(attempt);
    }

    @Override
    @Transactional
    public Attempt autoSaveAnswers(AutoSaveRequestDto request) {
        Attempt attempt;

        if (Optional.ofNullable(request.attemptId()).isEmpty()) {
            attempt = createAttempt(request.quizId(), null);
        } else {
            attempt = getAttemptById(request.attemptId());
        }
        attempt.setTimeSpent(request.timeSpent());

        Map<Long, Answer> existingAnswersMap = answersService.getAllAnswersByAttempt(attempt).stream()
                .collect(Collectors.toMap(a -> a.getQuestion().getId(), a -> a));

        request.answers().forEach((questionId, optionId) -> {
            if (existingAnswersMap.containsKey(questionId)) {
                // UPDATE existing entity
                Answer existingAnswer = existingAnswersMap.get(questionId);
                existingAnswer.setSelectedOption(optionsService.getOptionById(optionId));
            } else {
                // INSERT new entity
                Answer newAnswer = new Answer();
                newAnswer.setAttempt(attempt);
                newAnswer.setQuestion(questionService.getQuestionById(questionId));
                newAnswer.setSelectedOption(optionsService.getOptionById(optionId));

                attempt.getAnswers().add(newAnswer);
            }
        });

        return attemptRepository.save(attempt);
    }

}
