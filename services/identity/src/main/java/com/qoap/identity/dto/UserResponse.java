package com.qoap.identity.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.qoap.identity.entities.Address;
import com.qoap.identity.entities.RoleType;
import com.qoap.identity.enums.UserGender;

import lombok.Builder;

@Builder
public record UserResponse(UUID id,
		String firstName,
		String lastName,
		String email,
		String phone,
		UserGender gender,
		Address address,
		LocalDate dob,
		boolean enabled,
		Set<RoleType> roles,
		LocalDateTime createdAt,
		LocalDateTime updatedAt) {
}