package com.qoap.reports.services;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

import com.qoap.reports.models.User;

public interface IdentityService {

    Map<UUID, User> getAllUsersByIds(Set<UUID> userIds);

}