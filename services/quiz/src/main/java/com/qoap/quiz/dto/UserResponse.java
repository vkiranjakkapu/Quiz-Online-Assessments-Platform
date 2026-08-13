package com.qoap.quiz.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.qoap.quiz.enums.UserGender;
import com.qoap.quiz.models.Address;

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