package com.qoap.quiz.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record QuestionAnswersDto(
		@NotNull Long questionId,
		Long answerId) {
}