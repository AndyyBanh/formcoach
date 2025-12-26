package com.formcoach.formcoach_backend.expections;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorObject> handleUserAlreadyExistsException(UserAlreadyExistsException ex, WebRequest request) {
        ErrorObject errorObject = new ErrorObject();
        errorObject.setMessage(ex.getMessage());
        errorObject.setStatusCode(HttpStatus.CONFLICT.value());
        errorObject.setTimestamp(new Date());

        return new ResponseEntity<>(errorObject, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorObject> handleUserNotFoundException(UserNotFoundException ex, WebRequest request) {
        ErrorObject errorObject = new ErrorObject();
        errorObject.setMessage(ex.getMessage());
        errorObject.setStatusCode(HttpStatus.NOT_FOUND.value());
        errorObject.setTimestamp(new Date());

        return new ResponseEntity<>(errorObject, HttpStatus.NOT_FOUND);
    }


}
