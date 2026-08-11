package com.qoap.identity.services;

import java.util.List;
import java.util.UUID;

import com.qoap.identity.dto.CreateUserRequestDto;
import com.qoap.identity.dto.PasswordChangeRequestDto;
import com.qoap.identity.dto.UpdateUserRequest;
import com.qoap.identity.dto.UserResponse;
import com.qoap.identity.entities.RoleType;

public interface UserService {
    UserResponse createUser(CreateUserRequestDto request);

    List<UserResponse> getAllUsers();

    List<UserResponse> getAllUsersByRole(RoleType role);

    UserResponse getUserById(UUID id);

    UserResponse getUserByEmail(String email);

    UserResponse updateUser(UUID id, UpdateUserRequest request);

    UserResponse changePassword(PasswordChangeRequestDto request);

    void deleteUser(UUID id);
}