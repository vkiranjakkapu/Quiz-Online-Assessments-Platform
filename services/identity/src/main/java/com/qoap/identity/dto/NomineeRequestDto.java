package com.qoap.identity.dto;

import java.util.UUID;

import com.qoap.identity.enums.RelationshipType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record NomineeRequestDto(String name,
        @NotNull @Email String email,
        @NotNull String phone,
        @NotNull RelationshipType relationship,
        @NotNull UUID customerId) {

}
