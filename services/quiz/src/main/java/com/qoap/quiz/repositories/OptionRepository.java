package com.qoap.quiz.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qoap.quiz.models.QuestionOption;

public interface OptionRepository extends JpaRepository<QuestionOption, Long> {
    
}
