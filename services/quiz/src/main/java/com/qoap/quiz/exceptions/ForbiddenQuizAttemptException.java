package com.qoap.quiz.exceptions;

public class ForbiddenQuizAttemptException extends RuntimeException {

    public ForbiddenQuizAttemptException(String message) {
        super(message);
    }

}
