package com.qoap.quiz.dto;

import java.util.Set;

import com.qoap.quiz.models.Category;

public record UpdateQuizRequestDto(String title,
        String description,
        Category category,
        QuizSettingsDto settings,
        Set<UpdateQuestionDto> questions) {

}
