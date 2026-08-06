package com.qoap.quiz.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qoap.quiz.models.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

}
