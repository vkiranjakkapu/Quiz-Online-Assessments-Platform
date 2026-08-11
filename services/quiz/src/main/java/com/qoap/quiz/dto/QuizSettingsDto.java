package com.qoap.quiz.dto;

import java.time.Duration;

import com.qoap.quiz.enums.QuizDifficulty;

public record QuizSettingsDto(
        QuizDifficulty difficulty,
        String passingScore,
        Duration maxDuration,
        Integer maxAttempts) {

}
