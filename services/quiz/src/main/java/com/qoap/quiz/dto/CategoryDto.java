package com.qoap.quiz.dto;

import lombok.Builder;

@Builder
public record CategoryDto(
        Long id,
        String name,
        String description) {

}
