package com.example.oauthjwt.dto.response;

import java.util.Map;

import com.example.oauthjwt.dto.UserDTO;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;

@JsonIncludeProperties
public class Response {
  private String message;
  private UserDTO userDTO;

  private Map<String, String> errors;
}
