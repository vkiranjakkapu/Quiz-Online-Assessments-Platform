package com.qoap.reports.models;

import java.time.LocalDateTime;
import java.util.Set;

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
public class Category {

    private Long id;

    private String name;

    private String description;

    private Set<Quiz> quizzes;

    private LocalDateTime updatedAt;

    private LocalDateTime createdAt;

}
