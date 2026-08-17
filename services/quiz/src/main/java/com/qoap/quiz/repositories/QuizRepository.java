package com.qoap.quiz.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.qoap.quiz.models.Category;
import com.qoap.quiz.models.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, UUID> {

    @Query(value = "SELECT * FROM quizzes WHERE to_tsvector('english', title) @@ plainto_tsquery('english', :searchTerm)", nativeQuery = true)
    List<Quiz> searchByTitleFts(@Param("searchTerm") String searchTerm);

    List<Quiz> findAllByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Quiz> findAllByCategory(Category category);

}
