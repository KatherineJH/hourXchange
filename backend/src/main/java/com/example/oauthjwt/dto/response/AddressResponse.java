package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.Address;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {
  private Long id;

  private String streetAddress; // 도로명 주소

  private String city; // 고양시

  private String state; // 경기도

  private String postalCode; // 우편번호

  private String country; // 국가명

  public static AddressResponse toDto(Address address) {
    return address == null
        ? null
        : AddressResponse.builder()
            .id(address.getId())
            .streetAddress(address.getStreetAddress())
            .city(address.getCity())
            .state(address.getState())
            .postalCode(address.getPostalCode())
            .country(address.getCountry())
            .build();
  }
}
