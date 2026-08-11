package com.qoap.identity.services.imp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;

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
import com.qoap.identity.repository.UserRepository;
import com.qoap.identity.services.JwtService;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceImpTest {

	@Mock
	private AuthenticationManager authenticationManager;

	@Mock
	private UserRepository userRepository;

	@Mock
	private RefreshTokenRepository refreshTokenRepository;

	@Mock
	private JwtService jwtService;

	private SecurityProperties properties;

	private AuthenticationServiceImp authenticationService;

	private User user;

	@BeforeEach
	void setup() {

		properties = new SecurityProperties();
		authenticationService = new AuthenticationServiceImp(
				authenticationManager,
				refreshTokenRepository,
				jwtService,
				properties);

		user = User.builder()
				.id(UUID.fromString("c0186249-9fc1-4927-97b3-a08a21febfe3"))
				.email("admin@test.com")
				.password("password")
				.build();
	}

	@Test
	void login_ShouldReturnTokens() {

		LoginRequestDto request = new LoginRequestDto(
				"admin@test.com",
				"password");

		Authentication authentication = mock(Authentication.class);

		when(authenticationManager.authenticate(any()))
				.thenReturn(authentication);

		when(authentication.getPrincipal())
				.thenReturn(user);

		when(jwtService.generateAccessToken(user))
				.thenReturn("access-token");

		when(jwtService.generateRefreshToken())
				.thenReturn("refresh-token");

		LoginResponseDto response = authenticationService.login(request);

		assertNotNull(response);
		assertEquals("access-token", response.accessToken());
		assertEquals("refresh-token", response.refreshToken());
		assertEquals("Bearer", response.tokenType());

		verify(authenticationManager).authenticate(any());
		verify(refreshTokenRepository).save(any());
	}

	@Test
	void refresh_ShouldGenerateNewAccessToken() {

		RefreshToken token = new RefreshToken();

		token.setToken("refresh-token");
		token.setRevoked(false);
		token.setExpiresAt(LocalDateTime.now().plusDays(1));
		token.setUser(user);

		when(refreshTokenRepository.findByToken("refresh-token"))
				.thenReturn(Optional.of(token));

		when(jwtService.generateAccessToken(user))
				.thenReturn("new-access-token");

		RefreshTokenResponse response = authenticationService.refresh(
				new RefreshTokenRequest("refresh-token"));

		assertEquals(
				"new-access-token",
				response.accessToken());

		assertEquals(
				"refresh-token",
				response.refreshToken());

		verify(jwtService).generateAccessToken(user);
	}

	@Test
	void refresh_ShouldThrow_WhenTokenRevoked() {

		RefreshToken token = new RefreshToken();

		token.setRevoked(true);
		token.setExpiresAt(LocalDateTime.now().plusDays(1));

		when(refreshTokenRepository.findByToken(any()))
				.thenReturn(Optional.of(token));

		assertThrows(
				InvalidRefreshTokenException.class,
				() -> authenticationService.refresh(
						new RefreshTokenRequest("token")));
	}

	@Test
	void refresh_ShouldThrow_WhenExpired() {

		RefreshToken token = new RefreshToken();

		token.setRevoked(false);
		token.setExpiresAt(LocalDateTime.now().minusMinutes(1));

		when(refreshTokenRepository.findByToken(any()))
				.thenReturn(Optional.of(token));

		assertThrows(
				InvalidRefreshTokenException.class,
				() -> authenticationService.refresh(
						new RefreshTokenRequest("token")));
	}

	@Test
	void refresh_ShouldThrow_WhenTokenNotFound() {

		when(refreshTokenRepository.findByToken(any()))
				.thenReturn(Optional.empty());

		assertThrows(
				InvalidRefreshTokenException.class,
				() -> authenticationService.refresh(
						new RefreshTokenRequest("token")));
	}

	@Test
	void logout_ShouldRevokeToken() {

		RefreshToken token = new RefreshToken();

		token.setRevoked(false);

		when(refreshTokenRepository.findByToken(any()))
				.thenReturn(Optional.of(token));

		authenticationService.logout(
				new LogoutRequestDto("refresh-token"));

		assertTrue(token.isRevoked());

		verify(refreshTokenRepository).save(token);
	}

	@Test
	void logout_ShouldThrow_WhenTokenNotFound() {

		when(refreshTokenRepository.findByToken(any()))
				.thenReturn(Optional.empty());

		assertThrows(
				InvalidRefreshTokenException.class,
				() -> authenticationService.logout(
						new LogoutRequestDto("refresh-token")));
	}
}
