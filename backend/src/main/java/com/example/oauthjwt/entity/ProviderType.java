package com.example.oauthjwt.entity;

public enum ProviderType {
  SELLER, // 판매
  BUYER; // 구매

  public static ProviderType parseProviderType(String statusInput) {
    try {
      return ProviderType.valueOf(statusInput);
    } catch (Exception e) {
      return null;
    }
  }
}
