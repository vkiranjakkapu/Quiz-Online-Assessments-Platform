package com.qoap.quiz.services;

import java.util.List;
import java.util.UUID;

import com.qoap.quiz.dto.CreateQuizRequestDto;
import com.qoap.quiz.dto.UpdateQuizRequestDto;
import com.qoap.quiz.models.Quiz;

public interface QuizService {

    Quiz getQuizById(UUID id);

    List<Quiz> getAllQuizzes();

    Quiz createQuiz(CreateQuizRequestDto request);

    Quiz updateQuiz(UUID qid, UpdateQuizRequestDto request);

}