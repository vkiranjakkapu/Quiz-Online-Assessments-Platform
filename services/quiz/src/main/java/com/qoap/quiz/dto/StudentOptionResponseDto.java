package com.qoap.quiz.dto;

import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record StudentOptionResponseDto(
		Long id,
		String optionText,
		LocalDateTime createdAt) {

}
