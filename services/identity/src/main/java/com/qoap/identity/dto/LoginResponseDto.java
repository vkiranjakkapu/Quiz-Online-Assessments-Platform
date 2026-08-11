package com.qoap.identity.dto;

public record LoginResponseDto(
		String accessToken,
		String refreshToken,
		String tokenType) {
}