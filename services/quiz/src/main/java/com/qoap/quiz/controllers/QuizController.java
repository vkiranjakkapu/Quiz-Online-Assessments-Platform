package com.qoap.quiz.controllers;

import java.time.YearMonth;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qoap.quiz.dto.APIResponseDto;
import com.qoap.quiz.dto.CreateQuizRequestDto;
import com.qoap.quiz.dto.UpdateQuizRequestDto;
import com.qoap.quiz.dto.UpdateQuizStatusDto;
import com.qoap.quiz.services.CurrentUserService;
import com.qoap.quiz.services.QuizService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/quiz/api/v1")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final CurrentUserService currentUser;

    @GetMapping("/")
    public ResponseEntity<APIResponseDto> getAllQuizzes() {
        if (currentUser.isAdmin())
            return ResponseEntity.ok().body(APIResponseDto.builder().data(quizService.getAllQuizzes()).build());
        else
            return ResponseEntity.ok().body(APIResponseDto.builder()
                    .data(quizService.getAllQuizzes().stream().map(q -> quizService.mapQuizResponse(q))).build());
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<APIResponseDto> getQuizById(@PathVariable UUID quizId) {
        if (currentUser.isAdmin()) {
            return ResponseEntity.ok().body(APIResponseDto.builder().data(quizService.getQuizById(quizId)).build());
        } else {
            return ResponseEntity.ok().body(APIResponseDto.builder()
                    .data(quizService.mapQuizResponse(quizService.getQuizById(quizId))).build());
        }
    }

    @GetMapping("/title/{title}")
    public ResponseEntity<APIResponseDto> getAllQuizzesByTitle(@PathVariable String title) {
        if (currentUser.isAdmin())
            return ResponseEntity.ok()
                    .body(APIResponseDto.builder().data(quizService.getAllQuizzesByTitle(title)).build());
        else
            return ResponseEntity.ok()
                    .body(APIResponseDto.builder().data(
                            quizService.getAllQuizzesByTitle(title).stream().map(q -> quizService.mapQuizResponse(q)))
                            .build());
    }

    @PostMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponseDto> createQuiz(@RequestBody CreateQuizRequestDto quiz) {
        return ResponseEntity.ok().body(APIResponseDto.builder().data(quizService.createQuiz(quiz)).build());
    }

    @PutMapping("/{quizId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponseDto> updateQuiz(@PathVariable UUID quizId,
            @RequestBody UpdateQuizRequestDto quiz) {
        return ResponseEntity.ok().body(APIResponseDto.builder().data(quizService.updateQuiz(quizId, quiz)).build());
    }

    @PatchMapping("/{quizId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponseDto> updateQuizStatus(@PathVariable UUID quizId,
            @RequestBody UpdateQuizStatusDto request) {
        return ResponseEntity.ok()
                .body(APIResponseDto.builder().data(quizService.updateQuizStatus(quizId, request.status())).build());
    }

    @DeleteMapping("/{quizId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponseDto> deleteQuiz(@PathVariable UUID quizId) {
        return ResponseEntity.ok()
                .body(APIResponseDto.builder().data(quizService.deleteQuiz(quizId)).build());
    }

    @GetMapping("/monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponseDto> getAllQuizzesPerDayThisMonth() {
        return ResponseEntity.ok()
                .body(APIResponseDto.builder().data(quizService.getAllQuizzesPerDayInMonth()).build());
    }

    @GetMapping("/monthly/{month}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponseDto> getAllQuizzesPerDayInGivenMonth(@PathVariable YearMonth month) {
        return ResponseEntity.ok()
                .body(APIResponseDto.builder().data(quizService.getAllQuizzesPerDayInMonth(month)).build());
    }

}
