package com.qoap.quiz.repositories;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qoap.quiz.enums.CompletionStatus;
import com.qoap.quiz.models.Attempt;
import com.qoap.quiz.models.Quiz;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {

    List<Attempt> findAllByStatus(CompletionStatus status);

    List<Attempt> findAllByStudentId(UUID studentId);

    List<Attempt> findAllByQuiz(Quiz quiz);

    List<Attempt> findAllByQuizIdIn(Collection<UUID> quizIds);

}
