package org.kine.backend.errors;


import java.util.List;
import java.util.stream.Collectors;

import org.kine.backend.errors.exceptions.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<List<CustomFieldError>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<CustomFieldError> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(this::mapCustomFieldError)
                .collect(Collectors.toList());

        return new ResponseEntity<>(fieldErrors, HttpStatus.BAD_REQUEST);
    }

    // Helper method to map Spring's FieldError to your CustomFieldError
    private CustomFieldError mapCustomFieldError(FieldError springFieldError) {
        return new CustomFieldError(
                springFieldError.getField(),
                springFieldError.getDefaultMessage() != null ? springFieldError.getDefaultMessage() : "Invalid value"
        );
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<?> handleBusinessException(BusinessException ex) {
        if (ex.getFieldErrors() != null && !ex.getFieldErrors().isEmpty()) {
            return new ResponseEntity<>(ex.getFieldErrors(),ex.getStatus());
        } else {
            return new ResponseEntity<>(ex.getMessage(), ex.getStatus());
        }
    }
}