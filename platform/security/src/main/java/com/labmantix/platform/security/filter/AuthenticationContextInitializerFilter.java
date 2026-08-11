package com.labmantix.platform.security.filter;

import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;

import com.labmantix.platform.logging.constants.LoggingConstants;
import com.labmantix.platform.logging.holder.RequestContextHolder;
import com.labmantix.platform.security.context.AuthenticationContext;
import com.labmantix.platform.security.model.AuthenticatedUser;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public final class AuthenticationContextInitializerFilter
		extends OncePerRequestFilter {

	private final AuthenticationContext authenticationContext;

	private final RequestContextHolder requestContextHolder;

	public AuthenticationContextInitializerFilter(
			AuthenticationContext authenticationContext,
			RequestContextHolder requestContextHolder) {

		this.authenticationContext = authenticationContext;
		this.requestContextHolder = requestContextHolder;
	}

	@Override
	protected void doFilterInternal(
			HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain)
			throws ServletException, IOException {

		authenticationContext
				.getCurrentUser()
				.ifPresent(this::populateRequestContext);

		filterChain.doFilter(request, response);
	}

	private void populateRequestContext(
			AuthenticatedUser user) {

		requestContextHolder.put(
				LoggingConstants.USER_ID,
				user.getUserId());

		requestContextHolder.put(
				LoggingConstants.USERNAME,
				user.getUsername());
	}
}