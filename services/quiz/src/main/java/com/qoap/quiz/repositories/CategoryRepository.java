package com.qoap.quiz.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.qoap.quiz.models.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query(value = "SELECT * FROM categories WHERE to_tsvector('english', name) @@ plainto_tsquery('english', :searchTerm)", nativeQuery = true)
    Optional<Category> findByName(@Param("searchTerm") String searchTerm);

}
