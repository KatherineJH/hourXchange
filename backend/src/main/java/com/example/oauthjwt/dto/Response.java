package com.example.oauthjwt.dto;

import com.fasterxml.jackson.annotation.JsonIncludeProperties;

import java.util.Map;

@JsonIncludeProperties
public class Response {
    private String message;
    private UserDTO userDTO;

    private Map<String, String> errors;
}
