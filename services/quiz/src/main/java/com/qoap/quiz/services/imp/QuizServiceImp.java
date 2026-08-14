package com.qoap.quiz.services.imp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.qoap.quiz.dto.CreateQuizRequestDto;
import com.qoap.quiz.dto.UpdateOptionDto;
import com.qoap.quiz.dto.UpdateQuizRequestDto;
import com.qoap.quiz.exceptions.DuplicateResourceException;
import com.qoap.quiz.exceptions.ResourceNotFoundException;
import com.qoap.quiz.models.Category;
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
    private final CategoryService categoryService;

    @Override
    @Transactional(readOnly = true)
    public Quiz getQuizById(UUID id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with given ID"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Quiz> getAllQuizzesBetween(LocalDateTime start, LocalDateTime end) {
        return quizRepository.findAllByCreatedAtBetween(start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<LocalDate, List<Quiz>> getAllQuizzesPerDayInMonth() {

        List<Quiz> allQuizzesThisMonth = getAllQuizzesBetween(
                LocalDate.now().withDayOfMonth(1).atStartOfDay(),
                YearMonth.now().atEndOfMonth().atTime(LocalTime.MAX));

        return allQuizzesThisMonth.stream()
                .collect(Collectors.groupingBy(quiz -> quiz.getCreatedAt().toLocalDate()));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<LocalDate, List<Quiz>> getAllQuizzesPerDayInMonth(YearMonth month) {

        List<Quiz> allQuizzesInGivenMonth = getAllQuizzesBetween(month.atDay(1).atStartOfDay(),
                month.atEndOfMonth().atTime(LocalTime.MAX));

        return allQuizzesInGivenMonth.stream()
                .collect(Collectors.groupingBy(quiz -> quiz.getCreatedAt().toLocalDate()));
    }

    @Override
    @Transactional
    public Quiz createQuiz(CreateQuizRequestDto request) {

        Quiz quiz = new Quiz();
        quiz.setTitle(request.title());
        quiz.setDescription(request.description());
        quiz.setStatus(request.status());

        Category category = Optional.ofNullable(request.category().id()).map(id -> categoryService.getCategoryById(id))
                .orElseGet(() -> {
                    try {
                        categoryService.getCategoryByName(request.category().name());
                        throw new DuplicateResourceException("Category with given name already exists.");
                    } catch (ResourceNotFoundException e) {
                        // ? Proceed to create new category
                        return Category.builder().name(request.category().name())
                                .description(request.category().description()).build();
                    }
                });
        quiz.setCategory(category);

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
    @Transactional
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
