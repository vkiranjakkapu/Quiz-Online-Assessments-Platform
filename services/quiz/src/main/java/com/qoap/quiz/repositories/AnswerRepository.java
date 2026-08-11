package com.qoap.quiz.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qoap.quiz.models.Answer;
import com.qoap.quiz.models.Attempt;
import com.qoap.quiz.models.Question;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    Answer findByAttemptAndQuestion(Attempt attempt, Question question);

    List<Answer> findAllByAttempt(Attempt attempt);

}
