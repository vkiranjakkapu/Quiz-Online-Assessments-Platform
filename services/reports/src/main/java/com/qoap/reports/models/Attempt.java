package com.qoap.reports.models;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.qoap.reports.enums.CompletionStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attempt {

    private Long id;

    private UUID studentId;

    private Quiz quiz;

    private Double score;

    private Double percentage;

    private Integer correctAnswers;

    private Integer unAnswered;

    private Set<Answer> answers;

    private Duration timeSpent;

    private CompletionStatus status;

    private LocalDateTime attemptTime;

}
