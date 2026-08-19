package com.qoap.quiz.dto;

import java.util.List;
import java.util.UUID;

import com.qoap.quiz.enums.AttemptStatus;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record SaveAnswersDto(
		Long attemptId,
		@NotNull UUID quizId,
		@NotEmpty List<QuestionAnswersDto> answers,
		@NotNull AttemptStatus status) {

}