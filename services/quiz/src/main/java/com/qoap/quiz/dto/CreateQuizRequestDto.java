package com.qoap.quiz.dto;

import java.util.Set;

import com.qoap.quiz.enums.QuizStatus;

public record CreateQuizRequestDto(String title,
		String description,
		CategoryDto category,
		QuizSettingsDto settings,
		Set<QuestionDto> questions,
		QuizStatus status) {

}
