package com.qoap.quiz.dto;

import java.time.LocalDateTime;

import com.qoap.quiz.enums.ResponseStatus;

import lombok.Builder;

@Builder
public record APIResponseDto(ResponseStatus status, Object data, LocalDateTime timestamp) {

    public APIResponseDto {
        if (status == null) {
            status = ResponseStatus.SUCCESS;
        }
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
