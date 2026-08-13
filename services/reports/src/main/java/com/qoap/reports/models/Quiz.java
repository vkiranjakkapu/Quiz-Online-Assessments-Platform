package com.qoap.reports.models;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.qoap.reports.enums.QuizStatus;

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
public class Quiz {

    private UUID id;

    private String title;

    private String description;

    private Category category;

    private QuizSettings settings;

    private Set<Question> questions;

    @Builder.Default

    private QuizStatus status = QuizStatus.DRAFT;

    private LocalDateTime updatedAt;

    private LocalDateTime createdAt;

}
