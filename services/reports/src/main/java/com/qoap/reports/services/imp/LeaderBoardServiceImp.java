package com.qoap.reports.services.imp;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.BinaryOperator;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import com.qoap.reports.dto.LeaderBoardReportSto;
import com.qoap.reports.dto.RestResponseDto;
import com.qoap.reports.enums.AttemptStatus;
import com.qoap.reports.exceptions.InternalCommunicationException;
import com.qoap.reports.exceptions.ResourceNotFoundException;
import com.qoap.reports.models.Attempt;
import com.qoap.reports.models.User;
import com.qoap.reports.services.IdentityService;
import com.qoap.reports.services.LeaderBoardService;

@Service
public class LeaderBoardServiceImp implements LeaderBoardService {

    private final RestClient restClient;
    private final IdentityService identityService;

    @Value("${services.uri.quiz}")
    private String QUIZ_SERVICE_URL;

    public LeaderBoardServiceImp(@LoadBalanced RestClient.Builder builder,
            IdentityService identityService) {
        this.restClient = builder.build();
        this.identityService = identityService;
    }

    @Override
    public List<LeaderBoardReportSto> getLeaderBoardByQuizId(UUID quizId) {
        List<Attempt> latestAttempts = Optional.ofNullable(getAllAttemptsByQuizId(quizId))
                .orElseGet(Collections::emptyList)
                .stream()
                .filter(atmp -> atmp.getStatus() == AttemptStatus.AUTO_COMPLETED
                        || atmp.getStatus() == AttemptStatus.SUBMITTED)
                // Group by studentId and keep only the latest Attempt (by attemptTime) for each
                .collect(Collectors.toMap(
                        Attempt::getStudentId,
                        atmp -> atmp,
                        BinaryOperator.maxBy(Comparator.comparing(Attempt::getAttemptTime))))
                .values()
                .stream()
                // Primary sort: Score (Desc), Secondary sort: Time Spent (Asc for speed
                // tie-breaker)
                .sorted(Comparator.comparing(Attempt::getScore, Comparator.nullsLast(Comparator.naturalOrder()))
                        .reversed()
                        .thenComparing(Attempt::getTimeSpent, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();

        Set<UUID> studentIds = latestAttempts.stream()
                .map(Attempt::getStudentId)
                .collect(Collectors.toSet());

        Map<UUID, User> studentsMap = identityService.getAllUsersByIds(studentIds);

        return latestAttempts.stream()
                .map(attempt -> LeaderBoardReportSto.builder()
                        .attempt(attempt)
                        .student(studentsMap.get(attempt.getStudentId()))
                        .score(attempt.getScore())
                        .build())
                .toList();
    }

    @Override
    public List<Attempt> getAllAttemptsByQuizId(UUID quizId) {
        try {
            RestResponseDto<List<Attempt>> response = restClient.get()
                    .uri(QUIZ_SERVICE_URL + "/attempts/quiz/" + quizId)
                    .retrieve()
                    .body(new ParameterizedTypeReference<RestResponseDto<List<Attempt>>>() {
                    });
            System.out.println(response);
            return response != null ? response.getData() : null;
        } catch (HttpStatusCodeException e) {
            String rawJsonResponseBody = e.getResponseBodyAsString();
            throw new InternalCommunicationException(rawJsonResponseBody);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResourceNotFoundException("Error Connecting Quiz Service.");
        }
    }

}
