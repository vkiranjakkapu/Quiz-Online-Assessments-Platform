package com.qoap.identity.services;

import com.qoap.identity.dto.LoginRequestDto;
import com.qoap.identity.dto.LoginResponseDto;
import com.qoap.identity.dto.LogoutRequestDto;
import com.qoap.identity.dto.RefreshTokenRequest;
import com.qoap.identity.dto.RefreshTokenResponse;

public interface AuthenticationService {

    LoginResponseDto login(LoginRequestDto request);

    RefreshTokenResponse refresh(RefreshTokenRequest request);

    void logout(LogoutRequestDto request);

}