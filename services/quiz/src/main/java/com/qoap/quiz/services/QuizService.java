package com.qoap.quiz.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.qoap.quiz.dto.CreateQuizRequestDto;
import com.qoap.quiz.dto.QuizResponseDto;
import com.qoap.quiz.dto.UpdateQuizRequestDto;
import com.qoap.quiz.enums.QuizStatus;
import com.qoap.quiz.models.Quiz;

public interface QuizService {

    Quiz getQuizById(UUID id);

    QuizResponseDto<Object> mapQuizResponse(Quiz quiz);

    List<Quiz> getAllQuizzes();

    List<Quiz> getAllQuizzesByTitle(String title);

    List<Quiz> getAllQuizzesBetween(LocalDateTime start, LocalDateTime end);

    Map<LocalDate, List<Quiz>> getAllQuizzesPerDayInMonth();

    Map<LocalDate, List<Quiz>> getAllQuizzesPerDayInMonth(YearMonth month);

    Quiz createQuiz(CreateQuizRequestDto request);

    Quiz updateQuizStatus(UUID qid, QuizStatus status);

    Quiz updateQuiz(UUID qid, UpdateQuizRequestDto request);

    Quiz deleteQuiz(UUID qid);

}