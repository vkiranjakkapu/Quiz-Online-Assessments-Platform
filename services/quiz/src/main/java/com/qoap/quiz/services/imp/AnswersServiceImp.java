package com.qoap.quiz.services.imp;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.qoap.quiz.models.Answer;
import com.qoap.quiz.models.Attempt;
import com.qoap.quiz.models.Question;
import com.qoap.quiz.repositories.AnswerRepository;
import com.qoap.quiz.services.AnswersService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnswersServiceImp implements AnswersService {

    private final AnswerRepository answerRepository;

    @Override
    public List<Answer> getAllAnswersByAttempt(Attempt attempt) {
        return answerRepository.findAllByAttempt(attempt);
    }

    @Override
    public Answer getAnswerByAttemptAndQuestion(Long attemptId, Long questionId) {
        return Optional.ofNullable(answerRepository.findByAttemptAndQuestion(
                Attempt.builder().id(attemptId).build(), Question.builder().id(questionId).build())).orElse(null);
    }

    @Override
    public Answer createAnswer(Answer answer) {
        return answerRepository.save(answer);
    }

}
