package com.qoap.quiz.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qoap.quiz.dto.APIResponseDto;
import com.qoap.quiz.services.imp.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/quiz/api/v1/category")
@RequiredArgsConstructor
public class CategoriesController {

    private final CategoryService categoryService;

    @GetMapping("/")
    public ResponseEntity<APIResponseDto> getAllCategories() {
        return ResponseEntity.ok(APIResponseDto.builder().data(categoryService.getAllCategories()).build());
    }

    @GetMapping("/{catId}")
    public ResponseEntity<APIResponseDto> getAllQuizzesByCategories(@PathVariable Long catId) {
        return ResponseEntity.ok(APIResponseDto.builder().data(categoryService.getAllQuizzesByCategory(catId)).build());
    }

}
