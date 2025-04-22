package com.example.oauthjwt.entity;

import java.util.Collections;
import java.util.Map;

public enum ProviderType {
  SELLER, // 1
  BUYER; // 2

  public static ProviderType parseProviderType(String statusInput) {
    try {
      return ProviderType.valueOf(statusInput);
    } catch (Exception e) {
      return null;
    }
  }
}
