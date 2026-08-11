package com.qoap.quiz.dto;

import java.time.Duration;

public record SaveAnswerDto(
        Long attemptId,
        Long questionId,
        Long selectedOptionId,
        Duration timeSpent) {

}
