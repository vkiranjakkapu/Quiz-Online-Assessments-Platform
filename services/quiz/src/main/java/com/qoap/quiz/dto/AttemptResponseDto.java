package com.qoap.quiz.dto;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.qoap.quiz.enums.AttemptStatus;

import lombok.Builder;

@Builder
public record AttemptResponseDto<T>(
        Long id,
        UUID studentId,
        QuizResponseDto<T> quiz,
        Integer score,
        Double percentage,
        Integer correctAnswers,
        Integer unAnswered,
        Set<AnswerDto> answers,
        Duration timeSpent,
        AttemptStatus status,
        LocalDateTime attemptTime) {

}
