package com.qoap.quiz.dto;

public record UpdateOptionDto(
		Long id,
		String optionText,
		Boolean isCorrect) {

}
