package com.labmantix.platform.security.context;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.labmantix.platform.security.adapter.AuthenticationAdapter;
import com.labmantix.platform.security.model.AuthenticatedUser;

public final class DefaultAuthenticationContext
        implements AuthenticationContext {

    private final AuthenticationAdapter authenticationAdapter;

    public DefaultAuthenticationContext(
            AuthenticationAdapter authenticationAdapter) {
        this.authenticationAdapter = authenticationAdapter;
    }

    @Override
    public Optional<AuthenticatedUser> getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }

        return Optional.of(authenticationAdapter.adapt(authentication));
    }

    @Override
    public boolean isAuthenticated() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return authentication != null && authentication.isAuthenticated();
    }
}