package com.qoap.quiz.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qoap.quiz.models.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    
}
