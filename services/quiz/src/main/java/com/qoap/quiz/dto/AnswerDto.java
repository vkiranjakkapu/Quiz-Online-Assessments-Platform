package com.qoap.quiz.dto;

import lombok.Builder;

@Builder
public record AnswerDto(
        Long id,
        Long questionId,
        Long selectedOptionId,
        Boolean isCorrect) {

}
