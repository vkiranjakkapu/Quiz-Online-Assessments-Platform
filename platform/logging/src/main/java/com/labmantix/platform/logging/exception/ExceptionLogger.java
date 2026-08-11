package com.labmantix.platform.logging.exception;

import org.springframework.http.HttpStatusCode;

import jakarta.servlet.http.HttpServletRequest;

public interface ExceptionLogger {

    void log(
            Exception exception,
            HttpServletRequest request,
            HttpStatusCode status
    );

}