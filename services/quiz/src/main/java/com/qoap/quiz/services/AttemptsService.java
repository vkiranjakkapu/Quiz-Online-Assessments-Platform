package com.qoap.quiz.services;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.qoap.quiz.dto.AttemptResponseDto;
import com.qoap.quiz.dto.SaveAnswersDto;
import com.qoap.quiz.enums.AttemptStatus;
import com.qoap.quiz.models.Attempt;

public interface AttemptsService {

    List<Attempt> getAllAttempts();

    List<Attempt> getAllAttemptsByQuizId(UUID quizId);

    List<Attempt> getAllAttemptsByQuizIds(Set<UUID> quizIds);

    List<Attempt> getAllAttemptsByStatus(AttemptStatus status);

    Attempt getAttemptById(Long attemptId);

    List<Attempt> getAllAttemptsByStudent(UUID studentId);

    Attempt createNewAttempt(SaveAnswersDto request);

    AttemptResponseDto<?> saveAnswers(SaveAnswersDto request);

    AttemptResponseDto<?> evaluateAttempt(Attempt attempt);

    AttemptResponseDto<?> mapAttemptToStudentResponse(Attempt attempt);

}