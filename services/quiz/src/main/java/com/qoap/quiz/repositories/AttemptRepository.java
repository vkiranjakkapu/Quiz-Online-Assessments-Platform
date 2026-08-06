package com.qoap.quiz.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qoap.quiz.models.Attempt;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    
}
