package com.qoap.identity.dto;

public record RefreshTokenResponse(
		String accessToken,
		String refreshToken) {
}
