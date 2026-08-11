package com.qoap.quiz.dto;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;

public record AutoSaveRequestDto(
        Long attemptId,
        UUID quizId,
        Map<Long, Long> answers,
        Duration timeSpent) {

}
