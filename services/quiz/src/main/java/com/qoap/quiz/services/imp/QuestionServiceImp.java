package com.qoap.quiz.services.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qoap.quiz.exceptions.ResourceNotFoundException;
import com.qoap.quiz.models.Question;
import com.qoap.quiz.repositories.QuestionRepository;
import com.qoap.quiz.services.QuestionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuestionServiceImp implements QuestionService {

    private final QuestionRepository questionRepository;

    @Override
    public Question getQuestionById(Long questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question with given ID not found"));
    }

    @Override
    public List<Question> getAllQuestionsByIds(List<Long> qids) {
        return questionRepository.findAllById(qids);
    }

}
