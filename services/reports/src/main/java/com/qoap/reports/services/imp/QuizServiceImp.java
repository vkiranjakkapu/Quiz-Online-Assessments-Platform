package com.qoap.reports.services.imp;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import com.qoap.reports.dto.RestResponseDto;
import com.qoap.reports.exceptions.InternalCommunicationException;
import com.qoap.reports.exceptions.ResourceNotFoundException;
import com.qoap.reports.models.Attempt;
import com.qoap.reports.models.Quiz;
import com.qoap.reports.services.QuizService;

@Service
public class QuizServiceImp implements QuizService {

    private final RestClient restClient;

    @Value("${services.uri.quiz}")
    private String QUIZ_SERVICE_URL;

    public QuizServiceImp(@LoadBalanced RestClient.Builder builder) {
        this.restClient = builder.build();
    }

    @Override
    public Map<LocalDate, List<Quiz>> getAllQuizzesPerDayInMonth() {
        try {
            RestResponseDto<Map<LocalDate, List<Quiz>>> response = restClient.get().uri(QUIZ_SERVICE_URL + "/monthly")
                    .retrieve()
                    .body(new ParameterizedTypeReference<RestResponseDto<Map<LocalDate, List<Quiz>>>>() {
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

    @Override
    public Map<LocalDate, List<Quiz>> getAllQuizzesPerDayInMonth(YearMonth month) {
        try {
            RestResponseDto<Map<LocalDate, List<Quiz>>> response = restClient.get()
                    .uri(QUIZ_SERVICE_URL + "/monthly/" + month)
                    .retrieve()
                    .body(new ParameterizedTypeReference<RestResponseDto<Map<LocalDate, List<Quiz>>>>() {
                    });
            return response != null ? response.getData() : null;
        } catch (HttpStatusCodeException e) {
            String rawJsonResponseBody = e.getResponseBodyAsString();
            throw new InternalCommunicationException(rawJsonResponseBody);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResourceNotFoundException("Error Connecting Quiz Service.");
        }
    }

    @Override
    public List<Attempt> getAttemptsByQuizIds(Set<UUID> quizIds) {
        try {
            RestResponseDto<List<Attempt>> response = restClient.post()
                    .uri(QUIZ_SERVICE_URL + "/quiz")
                    .body(quizIds)
                    .retrieve()
                    .body(new ParameterizedTypeReference<RestResponseDto<List<Attempt>>>() {
                    });
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
