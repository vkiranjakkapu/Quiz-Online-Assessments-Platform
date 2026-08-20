package com.qoap.quiz.dto;

import java.time.LocalDateTime;
import java.util.Set;

import com.qoap.quiz.enums.QuizDifficulty;

import lombok.Builder;

@Builder
public record StudentQuestionResponseDto(
		Long id,
		String questionText,
		Integer marks,
		QuizDifficulty difficulty,
		Set<StudentOptionResponseDto> options,
		LocalDateTime createdAt) {
}