package com.qoap.quiz.services;

import java.util.List;

import com.qoap.quiz.models.QuestionOption;

public interface OptionsService {

    QuestionOption getOptionById(Long id);

    List<QuestionOption> getAllOptionsByIds(List<Long> id);

}