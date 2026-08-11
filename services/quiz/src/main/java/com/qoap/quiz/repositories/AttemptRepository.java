package com.qoap.quiz.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qoap.quiz.enums.CompletionStatus;
import com.qoap.quiz.models.Attempt;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {

    List<Attempt> findAllByStatus(CompletionStatus status);

    List<Attempt> findAllByStudentId(UUID studentId);
    
}
