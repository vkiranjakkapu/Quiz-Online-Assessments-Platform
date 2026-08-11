package com.qoap.quiz.services.imp;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.qoap.quiz.dto.CreateQuizRequestDto;
import com.qoap.quiz.dto.UpdateOptionDto;
import com.qoap.quiz.dto.UpdateQuizRequestDto;
import com.qoap.quiz.exceptions.ResourceNotFoundException;
import com.qoap.quiz.models.Question;
import com.qoap.quiz.models.QuestionOption;
import com.qoap.quiz.models.Quiz;
import com.qoap.quiz.models.QuizSettings;
import com.qoap.quiz.repositories.QuestionRepository;
import com.qoap.quiz.repositories.QuizRepository;
import com.qoap.quiz.services.QuizService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuizServiceImp implements QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;

    @Override
    public Quiz getQuizById(UUID id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with given ID"));
    }

    @Override
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @Override
    public Quiz createQuiz(CreateQuizRequestDto request) {

        Quiz quiz = new Quiz();
        quiz.setTitle(request.title());
        quiz.setDescription(request.description());
        quiz.setCategory(request.category());

        QuizSettings settings = QuizSettings.builder()
                .difficulty(request.settings().difficulty())
                .passingScore(request.settings().passingScore())
                .maxDuration(request.settings().maxDuration())
                .maxAttempts(request.settings().maxAttempts())
                .quiz(quiz)
                .build();
        quiz.setSettings(settings);

        Set<Question> questions = request.questions().stream().map(reqQue -> {
            Question que = new Question();
            que.setQuiz(quiz);
            que.setQuestionText(reqQue.questionText());
            que.setMarks(reqQue.marks());
            que.setExplanation(reqQue.explanation());
            que.setDifficulty(reqQue.difficulty());

            Set<QuestionOption> options = reqQue.options().stream().map(opt -> QuestionOption.builder().question(que)
                    .optionText(opt.optionText()).isCorrect(opt.isCorrect()).build())
                    .collect(Collectors.toSet());
            que.setOptions(options);

            return que;
        }).collect(Collectors.toSet());
        quiz.setQuestions(questions);

        return quizRepository.save(quiz);
    }

    @Override
    public Quiz updateQuiz(UUID qid, UpdateQuizRequestDto request) {
        Quiz quiz = getQuizById(qid);
        quiz.setTitle(request.title());
        quiz.setDescription(request.description());
        quiz.setCategory(request.category());

        QuizSettings settings = quiz.getSettings();
        settings.setDifficulty(request.settings().difficulty());
        settings.setPassingScore(request.settings().passingScore());
        settings.setMaxDuration(request.settings().maxDuration());
        settings.setMaxAttempts(request.settings().maxAttempts());
        quiz.setSettings(settings);

        Set<Question> updatedQuestions = request.questions().stream().map(reqQuestion -> {
            Question question = questionRepository.findById(reqQuestion.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found with Given ID."));
            question.setQuestionText(reqQuestion.questionText());
            question.setMarks(reqQuestion.marks());
            question.setExplanation(reqQuestion.explanation());
            question.setDifficulty(reqQuestion.difficulty());

            Map<Long, UpdateOptionDto> newOptions = reqQuestion.options().stream()
                    .collect(Collectors.toMap(UpdateOptionDto::id, o -> o, (existing, replacing) -> existing));
            Set<QuestionOption> updatedOptions = question.getOptions().stream().map(opt -> {

                if (newOptions.get(opt.getId()) != null) {
                    opt.setOptionText(newOptions.get(opt.getId()).optionText());
                    opt.setIsCorrect(newOptions.get(opt.getId()).isCorrect());
                }
                return opt;

            }).collect(Collectors.toSet());
            question.setOptions(updatedOptions);

            return question;
        }).collect(Collectors.toSet());
        quiz.setQuestions(updatedQuestions);

        return quizRepository.save(quiz);

    }

}
