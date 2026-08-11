package com.qoap.quiz.services;

import java.util.List;

import com.qoap.quiz.models.Answer;
import com.qoap.quiz.models.Attempt;

public interface AnswersService {

    List<Answer> getAllAnswersByAttempt(Attempt attempt);

    Answer getAnswerByAttemptAndQuestion(Long attemptId, Long questionId);

    Answer createAnswer(Answer answer);

}