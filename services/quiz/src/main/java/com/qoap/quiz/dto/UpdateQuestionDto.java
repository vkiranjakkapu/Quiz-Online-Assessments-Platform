package com.qoap.quiz.dto;

import java.util.Set;

import com.qoap.quiz.enums.QuizDifficulty;

public record UpdateQuestionDto(
        Long id,
        String questionText,
        Integer marks,
        String explanation,
        QuizDifficulty difficulty,
        Set<UpdateOptionDto> options) {

}
