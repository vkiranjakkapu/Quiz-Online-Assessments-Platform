package com.qoap.quiz.services.imp;

import java.util.Collection;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.labmantix.platform.security.context.AuthenticationContext;
import com.labmantix.platform.security.model.AuthenticatedUser;
import com.qoap.quiz.enums.RoleType;
import com.qoap.quiz.services.CurrentUserService;

import jakarta.ws.rs.ForbiddenException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrentUserServiceImp implements CurrentUserService {

    private final AuthenticationContext authenticationContext;

    @Override
    public AuthenticatedUser currentUser() {
        return authenticationContext.getCurrentUser()
                .orElseThrow(() -> new ForbiddenException("No authenticated user"));
    }

    @Override
    public UUID userId() {
        return UUID.fromString(currentUser().getUserId());
    }

    @Override
    public String username() {
        return currentUser().getUsername();
    }

    @Override
    public String email() {
        return currentUser().getEmail();
    }

    @Override
    public Collection<String> authorities() {
        return currentUser().getAuthorities();
    }

    @Override
    public boolean isAdmin() {
        return currentUser().getAuthorities().contains("ROLE_" + RoleType.ADMIN);
    }

    @Override
    public boolean isStudent() {
        return currentUser().getAuthorities().contains("ROLE_" + RoleType.STUDENT);
    }

}
