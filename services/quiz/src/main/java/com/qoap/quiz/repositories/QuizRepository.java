package com.qoap.quiz.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qoap.quiz.models.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

}
