package com.qoap.quiz.enums;

import com.labmantix.platform.web.exception.ErrorDefinition;

/**
 * 
 * IdentityExceptions:
 * 
 * @Available
 * <li>TIME_COMPLETED</li>
 * <li>USER_MISMATCH</li>
 */
public enum QuizExceptions implements ErrorDefinition {

    TIME_COMPLETED("TIME_COMPLETED", "QUIZ-2001", "Quiz Completed as the quiz time exceeded."),
    USER_MISMATCH("USER_MISMATCH", "QUIZ-4011", "Cross user access detected while quiz attempt.");

    private final String errorName;
    private final String errorCode;
    private final String errorMessage;

    QuizExceptions(String errorName,
            String errorCode,
            String errorMessage) {
        this.errorName = errorName;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    @Override
    public String getErrorName() {
        return this.errorName;
    }

    @Override
    public String getErrorCode() {
        return this.errorCode;
    }

    @Override
    public String getErrorMessage() {
        return this.errorMessage;
    }

}