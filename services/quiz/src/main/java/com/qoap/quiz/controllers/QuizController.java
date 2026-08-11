package com.qoap.quiz.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qoap.quiz.dto.APIResponseDto;
import com.qoap.quiz.dto.CreateQuizRequestDto;
import com.qoap.quiz.dto.UpdateQuizRequestDto;
import com.qoap.quiz.services.QuizService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/quiz/api/v1")
@RequiredArgsConstructor
public class QuizController {

    private QuizService quizService;

    @GetMapping("/")
    public ResponseEntity<APIResponseDto> getAllQuizzes() {
        return ResponseEntity.ok().body(APIResponseDto.builder().data(quizService.getAllQuizzes()).build());
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<APIResponseDto> getQuizById(@PathVariable UUID quizId) {
        return ResponseEntity.ok().body(APIResponseDto.builder().data(quizService.getQuizById(quizId)).build());
    }

    @PostMapping("/")
    public ResponseEntity<APIResponseDto> createQuiz(@RequestBody CreateQuizRequestDto quiz) {
        return ResponseEntity.ok().body(APIResponseDto.builder().data(quizService.createQuiz(quiz)).build());
    }

    @PutMapping("/{quizId}")
    public ResponseEntity<APIResponseDto> updateQuiz(@PathVariable UUID quizId, @RequestBody UpdateQuizRequestDto quiz) {
        return ResponseEntity.ok().body(APIResponseDto.builder().data(null).build());
    }

}
