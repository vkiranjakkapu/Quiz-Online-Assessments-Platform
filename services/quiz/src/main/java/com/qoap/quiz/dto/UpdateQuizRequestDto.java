package com.qoap.quiz.dto;

import java.util.Set;

import com.qoap.quiz.enums.QuizStatus;

public record UpdateQuizRequestDto(String title,
        String description,
        CategoryDto category,
        QuizSettingsDto settings,
        QuizStatus status,
        Set<UpdateQuestionDto> questions) {

}
