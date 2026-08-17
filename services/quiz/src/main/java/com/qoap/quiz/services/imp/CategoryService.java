package com.qoap.quiz.services.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qoap.quiz.exceptions.ResourceNotFoundException;
import com.qoap.quiz.models.Category;
import com.qoap.quiz.models.Quiz;
import com.qoap.quiz.repositories.CategoryRepository;
import com.qoap.quiz.repositories.QuizRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final QuizRepository quizRepository;

    public Category getCategoryById(Long catId) {
        return categoryRepository.findById(catId)
                .orElseThrow(() -> new ResourceNotFoundException("Category with given ID not found."));
    }

    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Category with given name not found."));
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Quiz> getAllQuizzesByCategory(Long catId) {
        return quizRepository.findAllByCategory(Category.builder().id(catId).build());
    }

}
