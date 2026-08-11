package com.qoap.identity.dto;

import com.qoap.identity.entities.User;
import com.qoap.identity.enums.RelationshipType;

import lombok.Builder;

@Builder
public record NomineeResponseDto(Long id,
        String name,
        String email,
        String phone,
        RelationshipType relationship,
        User customer) {

}
