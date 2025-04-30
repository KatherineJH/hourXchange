package com.example.oauthjwt.entity;

import java.util.Collections;
import java.util.Map;

public enum ProviderType {
  SELLER, // 판매
  BUYER, // 구매
  VOLUNTEER; // 자원봉사

  public static ProviderType parseProviderType(String statusInput) {
    try {
      return ProviderType.valueOf(statusInput);
    } catch (Exception e) {
      return null;
    }
  }
}
