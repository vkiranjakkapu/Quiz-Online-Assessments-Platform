package com.labmantix.platform.security.adapter;

import org.springframework.security.core.Authentication;

import com.labmantix.platform.security.model.AuthenticatedUser;

public interface AuthenticationAdapter {

    AuthenticatedUser adapt(Authentication authentication);

}