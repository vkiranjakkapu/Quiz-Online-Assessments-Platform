package com.qoap.identity.services.imp;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.labmantix.platform.security.constants.SecurityConstants;
import com.labmantix.platform.security.properties.SecurityProperties;
import com.qoap.identity.dto.LoginRequestDto;
import com.qoap.identity.dto.LoginResponseDto;
import com.qoap.identity.dto.LogoutRequestDto;
import com.qoap.identity.dto.RefreshTokenRequest;
import com.qoap.identity.dto.RefreshTokenResponse;
import com.qoap.identity.entities.RefreshToken;
import com.qoap.identity.entities.User;
import com.qoap.identity.exceptions.InvalidRefreshTokenException;
import com.qoap.identity.repository.RefreshTokenRepository;
import com.qoap.identity.services.AuthenticationService;
import com.qoap.identity.services.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImp implements AuthenticationService {

	private final AuthenticationManager authenticationManager;
	private final RefreshTokenRepository refreshTokenRepository;
	private final JwtService jwtService;
	private final SecurityProperties properties;

	@Override
	public LoginResponseDto login(LoginRequestDto request) {

		Authentication authenticate = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.email(),
						request.password()));

		User user = (User) authenticate.getPrincipal();

		String accessToken = jwtService.generateAccessToken(user);
		String refreshTokenValue = jwtService.generateRefreshToken();

		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setToken(refreshTokenValue);
		refreshToken.setUser(user);
		refreshToken.setRevoked(false);
		refreshToken.setExpiresAt(
				LocalDateTime.now()
						.plus(properties.getJwt().getRefreshTokenExpiration()));

		refreshTokenRepository.save(refreshToken);

		return new LoginResponseDto(
				accessToken,
				refreshTokenValue,
				SecurityConstants.BEARER_PREFIX.trim());
	}

	@Override
	public RefreshTokenResponse refresh(RefreshTokenRequest request) {
		RefreshToken refreshToken = refreshTokenRepository
				.findByToken(request.refreshToken())
				.orElseThrow(() -> new InvalidRefreshTokenException("Invalid refresh token"));
		if (refreshToken.isRevoked()) {
			throw new InvalidRefreshTokenException("Refresh token revoked");
		}
		if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
			throw new InvalidRefreshTokenException("Refresh token expired");
		}
		String accessToken = jwtService.generateAccessToken(refreshToken.getUser());
		return new RefreshTokenResponse(
				accessToken,
				request.refreshToken());
	}

	@Override
	@Transactional
	public void logout(LogoutRequestDto request) {

		RefreshToken refreshToken = refreshTokenRepository
				.findByToken(request.refreshToken())
				.orElseThrow(() -> new InvalidRefreshTokenException("Invalid refresh token"));

		refreshToken.setRevoked(true);

		refreshTokenRepository.save(refreshToken);
	}
}
