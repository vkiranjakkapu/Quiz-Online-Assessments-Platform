package com.qoap.identity.dto;

import java.time.LocalDate;

import com.qoap.identity.enums.UserGender;

import jakarta.validation.constraints.NotNull;

public record UpdateUserRequest(
		@NotNull String firstName,
		@NotNull String lastName,
		@NotNull String phone,
		@NotNull UserGender gender,
		@NotNull LocalDate dob,
		@NotNull AddressDto address,
		boolean enabled) {
}
