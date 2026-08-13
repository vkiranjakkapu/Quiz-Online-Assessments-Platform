package com.qoap.reports.models;

import java.time.Duration;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.qoap.reports.enums.QuizDifficulty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class QuizSettings {

    private Long id;

    @Builder.Default

    private QuizDifficulty difficulty = QuizDifficulty.BEGINNER;

    private String passingScore;

    private Duration maxDuration;

    private Integer maxAttempts;

    @JsonIgnore

    private Quiz quiz;

    private LocalDateTime updatedAt;

    private LocalDateTime createdAt;

}
