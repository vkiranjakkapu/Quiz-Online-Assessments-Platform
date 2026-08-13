package com.qoap.reports.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.qoap.reports.enums.UserGender;
import com.qoap.reports.models.Address;

import lombok.Builder;

@Builder
public record UserResponse(
		UUID id,
		String firstName,
		String lastName,
		String email,
		String phone,
		UserGender gender,
		Address address,
		LocalDate dob,
		boolean enabled
) {
}