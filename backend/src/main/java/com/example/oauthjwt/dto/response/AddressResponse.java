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

  private String zonecode; // 우편번호

  private String roadAddress; // 도로명주소

  private String jibunAddress; // 지번주소

  private String detailAddress; // 상세주소

  public static AddressResponse toDto(Address address) {
    return address == null
        ? null
        : AddressResponse.builder().id(address.getId()).zonecode(address.getZonecode())
            .roadAddress(address.getRoadAddress()).jibunAddress(address.getJibunAddress())
            .detailAddress(address.getDetailAddress()).build();
  }
}
