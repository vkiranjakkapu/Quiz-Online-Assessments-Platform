package com.qoap.reports.models;

import java.time.LocalDateTime;
import java.util.Set;

import com.qoap.reports.enums.QuizDifficulty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Question {

    private Long id;

    private Quiz quiz;

    private String questionText;

    private Integer marks;

    private String explanation;

    private QuizDifficulty difficulty;

    private Set<QuestionOption> options;

    private LocalDateTime createdAt;

}
