package com.qoap.identity.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record FetchUsersResponseDto(List<UserResponse> users) {

}
