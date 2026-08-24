package com.qoap.quiz.controllers;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qoap.quiz.dto.APIResponseDto;
import com.qoap.quiz.dto.AttemptResponseDto;
import com.qoap.quiz.dto.SaveAnswersDto;
import com.qoap.quiz.enums.AttemptStatus;
import com.qoap.quiz.exceptions.QuizException;
import com.qoap.quiz.models.Attempt;
import com.qoap.quiz.services.AttemptsService;
import com.qoap.quiz.services.CurrentUserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/quiz/api/v1/attempts")
@RequiredArgsConstructor
public class AttemptController {

    private final AttemptsService attemptsService;
    private final CurrentUserService currentUser;

    @GetMapping("/")
    public ResponseEntity<APIResponseDto> getAllAttempts() {
        List<Attempt> allAttempts = currentUser.isStudent()
                ? attemptsService.getAllAttemptsByStudent(currentUser.userId())
                : attemptsService.getAllAttempts();

        return ResponseEntity.ok(APIResponseDto.builder().data(
                currentUser.isAdmin() ? allAttempts
                        : allAttempts.stream().map(attempt -> attemptsService.mapAttemptToStudentResponse(attempt)))
                .build());
    }

    @GetMapping("/leaderboard/{quizId}")
    public ResponseEntity<APIResponseDto> getLeaderboardByQuizId(@PathVariable UUID quizId) {
        List<Attempt> allAttempts = attemptsService.getAllAttemptsByQuizId(quizId);
        return ResponseEntity.ok(APIResponseDto.builder().data(
                currentUser.isAdmin() ? allAttempts
                        : allAttempts.stream().map(attempt -> attemptsService.mapAttemptToStudentResponse(attempt)))
                .build());
    }

    @GetMapping("/{attemptId}")
    public ResponseEntity<APIResponseDto> getAttemptById(@PathVariable Long attemptId) {
        Attempt attempt = attemptsService.getAttemptById(attemptId);
        return ResponseEntity.ok(APIResponseDto.builder()
                .data(currentUser.isAdmin() ? attempt : attemptsService.mapAttemptToStudentResponse(attempt)).build());
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponseDto> getAttemptsByUserId(@PathVariable UUID studentId) {
        return ResponseEntity
                .ok(APIResponseDto.builder().data(attemptsService.getAllAttemptsByStudent(studentId)).build());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponseDto> getAllAttemptByStatus(@PathVariable AttemptStatus status) {
        return ResponseEntity.ok(APIResponseDto.builder().data(attemptsService.getAllAttemptsByStatus(status)).build());
    }

    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<APIResponseDto> getAllAttemptsByQuizId(@PathVariable UUID quizId) {
        List<Attempt> allAttempts = currentUser.isAdmin() ? attemptsService.getAllAttemptsByQuizId(quizId)
                : attemptsService.getAllAttemptsByStudent(currentUser.userId()).stream()
                        .filter(a -> a.getQuiz().getId().equals(quizId)).toList();
        return ResponseEntity.ok(APIResponseDto.builder()
                .data(currentUser.isAdmin() ? allAttempts
                        : allAttempts.stream().map(att -> attemptsService.mapAttemptToStudentResponse(att)).toList())
                .build());
    }

    @PostMapping("/quiz")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponseDto> getAllAttemptsByQuizIds(@RequestBody Set<UUID> quizIds) {
        return ResponseEntity
                .ok(APIResponseDto.builder().data(attemptsService.getAllAttemptsByQuizIds(quizIds)).build());
    }

    @PostMapping("/save")
    public ResponseEntity<APIResponseDto> saveAttempt(@Valid @RequestBody SaveAnswersDto request) {
        AttemptResponseDto<?> savedAttempt = attemptsService.saveAnswers(request);
        if (savedAttempt.status().equals(AttemptStatus.AUTO_COMPLETED)) {
            throw new QuizException("Quiz has been submitted as the time was complete.");
        }
        return ResponseEntity.ok(APIResponseDto.builder().data(savedAttempt).build());
    }

}
