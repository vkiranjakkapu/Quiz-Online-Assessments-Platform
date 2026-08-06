package com.qoap.quiz.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qoap.quiz.models.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
