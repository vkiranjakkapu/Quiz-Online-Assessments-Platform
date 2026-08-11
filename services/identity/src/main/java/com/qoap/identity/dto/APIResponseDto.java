package com.qoap.identity.dto;

import java.time.LocalDateTime;

import com.qoap.identity.enums.ResponseStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class APIResponseDto {

    @Builder.Default()
    private ResponseStatus status = ResponseStatus.SUCCESS;

    private Object body;

    @Builder.Default()
    private LocalDateTime timestamp = LocalDateTime.now();

}
