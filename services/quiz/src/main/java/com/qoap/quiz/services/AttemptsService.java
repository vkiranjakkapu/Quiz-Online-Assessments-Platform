package com.qoap.quiz.services;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.qoap.quiz.dto.AutoSaveRequestDto;
import com.qoap.quiz.dto.SaveAnswerDto;
import com.qoap.quiz.enums.CompletionStatus;
import com.qoap.quiz.models.Attempt;

public interface AttemptsService {

    List<Attempt> getAllAttempts();

    List<Attempt> getAllAttemptsByQuizId(UUID quizId);

    List<Attempt> getAllAttemptsByQuizIds(Set<UUID> quizIds);

    List<Attempt> getAllAttemptsByStatus(CompletionStatus status);

    Attempt getAttemptById(Long attemptId);

    List<Attempt> getAllAttemptsByStudent(UUID studentId);

    Attempt createAttempt(UUID quizId, UUID studentId);

    Attempt saveAnswer(SaveAnswerDto request);

    Attempt autoSaveAnswers(AutoSaveRequestDto request);

}