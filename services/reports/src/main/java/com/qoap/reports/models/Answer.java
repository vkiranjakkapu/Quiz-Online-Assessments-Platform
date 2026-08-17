package com.qoap.reports.models;

import java.time.LocalDateTime;

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
public class Answer {

    private Long id;

    private Attempt attempt;

    private Question question;

    private QuestionOption selectedOption;

    private Boolean isCorrect;

    private LocalDateTime updatedAt;

    private LocalDateTime createdAt;

}
