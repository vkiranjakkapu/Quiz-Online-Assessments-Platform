package com.qoap.quiz.services;

import java.util.Collection;
import java.util.UUID;

import com.labmantix.platform.security.model.AuthenticatedUser;

public interface CurrentUserService {

    AuthenticatedUser currentUser();

    UUID userId();

    String username();

    String email();

    Collection<String> authorities();

    boolean isAdmin();

    boolean isStudent();

}