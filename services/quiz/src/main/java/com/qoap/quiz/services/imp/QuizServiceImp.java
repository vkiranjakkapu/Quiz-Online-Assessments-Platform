package com.qoap.quiz.services.imp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.qoap.quiz.dto.CreateQuizRequestDto;
import com.qoap.quiz.dto.QuizResponseDto;
import com.qoap.quiz.dto.StudentOptionResponseDto;
import com.qoap.quiz.dto.StudentQuestionResponseDto;
import com.qoap.quiz.dto.UpdateOptionDto;
import com.qoap.quiz.dto.UpdateQuestionDto;
import com.qoap.quiz.dto.UpdateQuizRequestDto;
import com.qoap.quiz.enums.QuizStatus;
import com.qoap.quiz.exceptions.DuplicateResourceException;
import com.qoap.quiz.exceptions.ResourceNotFoundException;
import com.qoap.quiz.models.Category;
import com.qoap.quiz.models.Question;
import com.qoap.quiz.models.QuestionOption;
import com.qoap.quiz.models.Quiz;
import com.qoap.quiz.models.QuizSettings;
import com.qoap.quiz.repositories.QuizRepository;
import com.qoap.quiz.services.QuizService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuizServiceImp implements QuizService {

    private final QuizRepository quizRepository;
    private final CategoryService categoryService;
    private final CurrentUserServiceImp currentUser;

    @Override
    @Transactional(readOnly = true)
    public Quiz getQuizById(UUID id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with given ID"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Quiz> getAllQuizzes() {
        if (currentUser.isStudent()) {
            return quizRepository.findAllByStatus(QuizStatus.PUBLISHED);
        }
        return quizRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Quiz> getAllQuizzesByTitle(String title) {
        return quizRepository.searchByTitleFts(title);
    }

    @Override
    public QuizResponseDto<Object> mapQuizResponse(Quiz quiz) {
        Set<Object> questions = currentUser.isStudent()
                ? new HashSet<>(mapToStudentQuestions(quiz.getQuestions()))
                : new HashSet<>(quiz.getQuestions());

        return QuizResponseDto.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .category(quiz.getCategory())
                .settings(quiz.getSettings())
                .questions(questions)
                .status(quiz.getStatus())
                .updatedAt(quiz.getUpdatedAt())
                .createdAt(quiz.getCreatedAt())
                .build();
    }

    private Set<StudentQuestionResponseDto> mapToStudentQuestions(Set<Question> questions) {
        // removing question explanation and correct option indicator
        return Optional.ofNullable(questions)
                .orElseGet(Collections::emptySet)
                .stream()
                .map(q -> StudentQuestionResponseDto.builder()
                        .id(q.getId())
                        .questionText(q.getQuestionText())
                        .marks(q.getMarks())
                        .difficulty(q.getDifficulty())
                        .options(q.getOptions().stream().map(op -> StudentOptionResponseDto.builder()
                                .id(op.getId())
                                .optionText(op.getOptionText())
                                .build())
                                .collect(Collectors.toSet()))
                        .build())
                .collect(Collectors.toSet());
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

        if (quiz.getStatus().equals(QuizStatus.DRAFT)) {

        }

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

        Set<Question> questions = Optional.ofNullable(request.questions()).orElseGet(Collections::emptySet).stream()
                .map(reqQue -> {
                    Question que = new Question();
                    que.setQuiz(quiz);
                    que.setQuestionText(reqQue.questionText());
                    que.setMarks(reqQue.marks());
                    que.setExplanation(reqQue.explanation());
                    que.setDifficulty(reqQue.difficulty());

                    Set<QuestionOption> options = Optional.ofNullable(reqQue.options()).orElseGet(Collections::emptySet)
                            .stream()
                            .map(opt -> QuestionOption.builder().question(que)
                                    .optionText(opt.optionText()).isCorrect(opt.isCorrect()).build())
                            .collect(Collectors.toSet());
                    que.setOptions(options);

                    return que;
                }).collect(Collectors.toSet());
        quiz.setQuestions(questions);

        return quizRepository.save(quiz);
    }

    @Override
    public Quiz updateQuizStatus(UUID qid, QuizStatus status) {
        Quiz quiz = getQuizById(qid);
        quiz.setStatus(status);
        return quizRepository.save(quiz);
    }

    @Override
    @Transactional
    public Quiz updateQuiz(UUID qid, UpdateQuizRequestDto request) {
        Quiz quiz = getQuizById(qid);
        quiz.setTitle(request.title());
        quiz.setDescription(request.description());
        quiz.setStatus(request.status());

        Category category = Optional.ofNullable(request.category().id()).map(id -> categoryService.getCategoryById(id))
                .orElseGet(() -> {
                    try {
                        categoryService.getCategoryByName(request.category().name());
                        throw new DuplicateResourceException("Category with given name already exists.");
                    } catch (ResourceNotFoundException e) {
                        // ? Proceed to create new category since no category found with given name
                        return Category.builder().name(request.category().name())
                                .description(request.category().description()).build();
                    }
                });
        quiz.setCategory(category);

        QuizSettings settings = quiz.getSettings();
        settings.setDifficulty(request.settings().difficulty());
        settings.setPassingScore(request.settings().passingScore());
        settings.setMaxDuration(request.settings().maxDuration());
        settings.setMaxAttempts(request.settings().maxAttempts());

        if (quiz.getQuestions() == null) {
            quiz.setQuestions(new HashSet<>());
        }

        // ? Map incoming questions by ID
        Map<Long, UpdateQuestionDto> incomingQuestionsMap = Optional.ofNullable(request.questions())
                .orElseGet(Collections::emptySet).stream()
                .filter(q -> q.id() != null)
                .collect(Collectors.toMap(UpdateQuestionDto::id, q -> q, (existing, replacing) -> existing));

        // ? Remove questions omitted from request (Orphan Removal for Questions)
        quiz.getQuestions().removeIf(q -> !incomingQuestionsMap.containsKey(q.getId()));

        // ? Update existing questions in-place
        quiz.getQuestions().forEach(question -> {
            UpdateQuestionDto reqQuestion = incomingQuestionsMap.get(question.getId());
            if (reqQuestion != null) {
                question.setQuestionText(reqQuestion.questionText());
                question.setMarks(reqQuestion.marks());
                question.setExplanation(reqQuestion.explanation());
                question.setDifficulty(reqQuestion.difficulty());

                updateOptionsInPlace(question, reqQuestion.options());
            }
        });

        // ? Add brand-new questions (null IDs)
        Optional.ofNullable(request.questions())
                .orElseGet(Collections::emptySet).stream()
                .filter(q -> q.id() == null)
                .forEach(reqQuestion -> {
                    Question newQuestion = Question.builder()
                            .questionText(reqQuestion.questionText())
                            .marks(reqQuestion.marks())
                            .explanation(reqQuestion.explanation())
                            .difficulty(reqQuestion.difficulty())
                            .quiz(quiz)
                            .options(new HashSet<>())
                            .build();

                    updateOptionsInPlace(newQuestion, reqQuestion.options());
                    quiz.getQuestions().add(newQuestion);
                });

        return quizRepository.save(quiz);
    }

    private void updateOptionsInPlace(Question question, Set<UpdateOptionDto> incomingOptions) {
        Map<Long, UpdateOptionDto> incomingUpdatedOptions = Optional.ofNullable(incomingOptions)
                .orElseGet(Collections::emptySet).stream()
                .filter(o -> o.id() != null)
                .collect(Collectors.toMap(UpdateOptionDto::id, o -> o, (existing, replacing) -> existing));

        if (question.getOptions() == null) {
            question.setOptions(new HashSet<>());
        }

        // Remove deleted options
        question.getOptions().removeIf(existingOpt -> !incomingUpdatedOptions.containsKey(existingOpt.getId()));

        // Update modified options
        question.getOptions().forEach(existingOpt -> {
            UpdateOptionDto dto = incomingUpdatedOptions.get(existingOpt.getId());
            if (dto != null) {
                existingOpt.setOptionText(dto.optionText());
                existingOpt.setIsCorrect(dto.isCorrect());
            }
        });

        // Add new options
        Optional.ofNullable(incomingOptions)
                .orElseGet(Collections::emptySet).stream()
                .filter(o -> o.id() == null)
                .forEach(newDto -> {
                    QuestionOption newOption = QuestionOption.builder()
                            .optionText(newDto.optionText())
                            .isCorrect(newDto.isCorrect())
                            .question(question)
                            .build();
                    question.getOptions().add(newOption);
                });
    }

    @Override
    public Quiz deleteQuiz(UUID qid) {
        Quiz quiz = getQuizById(qid);
        quiz.setIsDeleted(true);
        return quizRepository.save(quiz);
    }

}
