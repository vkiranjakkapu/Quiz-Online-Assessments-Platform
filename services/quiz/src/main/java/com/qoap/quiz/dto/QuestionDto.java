package com.qoap.quiz.dto;

import java.util.Set;

import com.qoap.quiz.enums.QuizDifficulty;

public record QuestionDto(
        String questionText,
        Integer marks,
        String explanation,
        QuizDifficulty difficulty,
        Set<QuestionOptionDto> options) {

}
