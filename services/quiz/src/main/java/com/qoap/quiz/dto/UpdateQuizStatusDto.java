package com.qoap.quiz.dto;

import com.qoap.quiz.enums.QuizStatus;

import jakarta.validation.Valid;

public record UpdateQuizStatusDto(@Valid QuizStatus status) {

}
