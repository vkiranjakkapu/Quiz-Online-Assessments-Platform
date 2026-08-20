package com.qoap.quiz.services.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import com.qoap.quiz.exceptions.ResourceNotFoundException;
import com.qoap.quiz.models.QuestionOption;
import com.qoap.quiz.repositories.OptionRepository;
import com.qoap.quiz.services.OptionsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OptionsServiceImp implements OptionsService {

    private final OptionRepository optionRepository;

    @Override
    public QuestionOption getOptionById(Long id) {
        return optionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Option not found with given ID."));
    }

    @Override
    public List<QuestionOption> getAllOptionsByIds(List<Long> ids) {
        return optionRepository.findAllById(ids);
    }

}
