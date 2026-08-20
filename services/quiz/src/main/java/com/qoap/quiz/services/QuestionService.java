package com.qoap.quiz.services;

import java.util.List;

import com.qoap.quiz.models.Question;

public interface QuestionService {

    Question getQuestionById(Long questionId);

    List<Question> getAllQuestionsByIds(List<Long> qids);

}