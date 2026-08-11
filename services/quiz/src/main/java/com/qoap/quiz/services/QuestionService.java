package com.qoap.quiz.services;

import com.qoap.quiz.models.Question;

public interface QuestionService {

    Question getQuestionById(Long questionId);

}