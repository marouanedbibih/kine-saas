package org.kine.backend.errors.exceptions;

import java.util.List;

import org.kine.backend.errors.CustomFieldError;
import org.springframework.http.HttpStatus;

public class BusinessException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    private List<CustomFieldError> fieldErrors;
    private String message;
    private HttpStatus status;

    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.message = message;
        this.status = status;
    }

    public BusinessException(String field, String message, HttpStatus status) {
        super(message);
        this.fieldErrors = List.of(new CustomFieldError(field, message));
        this.message = message;
        this.status = status;
    }

    public BusinessException(List<CustomFieldError> fieldErrors, HttpStatus status) {
        this.fieldErrors = fieldErrors;
        this.status = status;
    }

    public List<CustomFieldError> getFieldErrors() {
        return fieldErrors;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getStatus() {
        return status;
    }

}