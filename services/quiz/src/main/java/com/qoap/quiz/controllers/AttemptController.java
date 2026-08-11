package com.qoap.quiz.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qoap.quiz.dto.APIResponseDto;
import com.qoap.quiz.dto.SaveAnswerDto;
import com.qoap.quiz.enums.CompletionStatus;
import com.qoap.quiz.services.AttemptsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/quiz/api/v1/attempts")
@RequiredArgsConstructor
public class AttemptController {

    private final AttemptsService attemptsService;

    // * Per day
    // ? 1. Quizzes created per day,
    // ? 2. No.of Students attempted those quizzes

    // * Indv. Quiz details
    // ? 1. No.of Students attempted -> Title
    // ? i. Quiz Name, description, difficulty, No.of Q's, createdAt
    // ? ii. Avg., Max., Min., Scores of quiz --> BARs
    // ? 2. Leaderboard with scores descending

    @GetMapping("/")
    public ResponseEntity<APIResponseDto> getAllAttempts() {
        return ResponseEntity.ok(APIResponseDto.builder().data(attemptsService.getAllAttempts()).build());
    }

    @GetMapping("/{attemptId}")
    public ResponseEntity<APIResponseDto> getAttemptById(@PathVariable Long attemptId) {
        return ResponseEntity.ok(APIResponseDto.builder().data(attemptsService.getAttemptById(attemptId)).build());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<APIResponseDto> getAttemptsByUserId(@PathVariable UUID studentId) {
        return ResponseEntity
                .ok(APIResponseDto.builder().data(attemptsService.getAllAttemptsByStudent(studentId)).build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<APIResponseDto> getAllAttemptByStatus(@PathVariable CompletionStatus status) {
        return ResponseEntity.ok(APIResponseDto.builder().data(attemptsService.getAllAttemptsByStatus(status)).build());
    }

    @PostMapping("/begin/{quizId}")
    public ResponseEntity<APIResponseDto> createAttempt(@PathVariable Long quizId) {
        return ResponseEntity.ok(APIResponseDto.builder().data(null).build());
    }

    @PostMapping("/auto-save")
    public ResponseEntity<APIResponseDto> autoSaveAttempt(@RequestBody SaveAnswerDto request) {
        return ResponseEntity.ok(APIResponseDto.builder().data(null).build());
    }

}
