package com.qoap.quiz.dto;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.qoap.quiz.enums.QuizStatus;
import com.qoap.quiz.models.Category;
import com.qoap.quiz.models.QuizSettings;

import lombok.Builder;

@Builder
public record QuizResponseDto<T>(
		UUID id,
		String title,
		String description,
		Category category,
		QuizSettings settings,
		Set<T> questions,
		QuizStatus status,
		LocalDateTime updatedAt,
		LocalDateTime createdAt) {

}
