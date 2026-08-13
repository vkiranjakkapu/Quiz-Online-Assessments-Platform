package com.qoap.reports.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionOption {

    private Long id;

    private Question question;

    private String optionText;

    @Builder.Default
    private Boolean isCorrect = false;

}
