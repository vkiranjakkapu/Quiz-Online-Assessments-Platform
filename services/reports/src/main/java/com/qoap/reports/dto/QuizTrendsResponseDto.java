package com.qoap.reports.dto;

import java.time.LocalDate;

import lombok.Builder;

@Builder
public record QuizTrendsResponseDto(
        LocalDate date,
        Number quizzes,
        Number attempts) {

}
