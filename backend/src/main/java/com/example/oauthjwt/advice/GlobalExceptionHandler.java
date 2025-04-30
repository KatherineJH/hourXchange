package com.example.oauthjwt.advice;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.exception.ValidationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  // 1) ResponseStatusException 처리 (e.g. 404 NOT_FOUND)
  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<Map<String, Object>> handleResponseStatus(ResponseStatusException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("status", ex.getStatusCode().value());
    body.put("error", ((HttpStatus) ex.getStatusCode()).getReasonPhrase());
    body.put("message", ex.getReason());
    return ResponseEntity.status(ex.getStatusCode()).body(body);
  }

  // 2) @Valid 검증 실패 처리 (400 BAD_REQUEST)
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getFieldErrors().forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));

    Map<String, Object> body = new HashMap<>();
    body.put("status", HttpStatus.BAD_REQUEST.value());
    body.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
    body.put("validationErrors", errors);
    return ResponseEntity.badRequest().body(body);
  }

  // 1) ValidationException 처리 (e.g. 400 BAD_REQUEST)
  @ExceptionHandler(ValidationException.class)
  public ResponseEntity<Map<String, Object>> handleValidationException(ValidationException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("status", HttpStatus.BAD_REQUEST.value());
    body.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
    body.put("message", ex.getMessage());
    return ResponseEntity.badRequest().body(body);
  }

  // 3) 기타 예외 (500 INTERNAL_SERVER_ERROR)
  // @ExceptionHandler(Exception.class)
  // public ResponseEntity<Map<String,Object>> handleAll(Exception ex) {
  // Map<String,Object> body = new HashMap<>();
  // body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
  // body.put("error", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
  // body.put("message", "알 수 없는 서버 오류가 발생했습니다.");
  // // 필요한 경우 ex.getMessage() 또는 스택트레이스 로깅
  // return ResponseEntity
  // .status(HttpStatus.INTERNAL_SERVER_ERROR)
  // .body(body);
  // }
}
