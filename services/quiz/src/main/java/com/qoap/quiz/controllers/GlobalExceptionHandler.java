package com.qoap.quiz.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.labmantix.platform.web.exception.SecurityExceptions;
import com.labmantix.platform.web.model.ErrorResponse;
import com.qoap.quiz.enums.IdentityExceptions;
import com.qoap.quiz.enums.QuizExceptions;
import com.qoap.quiz.exceptions.ForbiddenQuizAttemptException;
import com.qoap.quiz.exceptions.InternalCommunicationException;
import com.qoap.quiz.exceptions.QuizException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ QuizException.class })
    public ResponseEntity<ErrorResponse> handleQuiExceptions(QuizException e) {
        return ResponseEntity.status(HttpStatus.CONTINUE)
                .body(new ErrorResponse(QuizExceptions.TIME_COMPLETED, e.getMessage()));
    }

    @ExceptionHandler({ BadCredentialsException.class })
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(IdentityExceptions.BAD_CREDENTIALS));
    }

    @ExceptionHandler({ AuthorizationDeniedException.class })
    public ResponseEntity<ErrorResponse> handleForbiddenException(AuthorizationDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse(SecurityExceptions.FORBIDDEN_ACCESS, e.getMessage()));
    }

    @ExceptionHandler({ ForbiddenQuizAttemptException.class })
    public ResponseEntity<ErrorResponse> handleForbiddenException(ForbiddenQuizAttemptException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse(QuizExceptions.USER_MISMATCH, e.getMessage()));
    }

    @ExceptionHandler({ InternalCommunicationException.class })
    public ResponseEntity<?> handleForbiddenException(InternalCommunicationException e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(e.getMessage());
    }
}
