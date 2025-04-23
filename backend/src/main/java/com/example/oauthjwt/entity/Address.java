package com.example.oauthjwt.entity;

import com.example.oauthjwt.dto.request.AddressRequest;
import com.example.oauthjwt.dto.request.UserRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String zonecode;

  @Column(nullable = false)
  private String roadAddress;

  @Column(nullable = false)
  private String jibunAddress;

  private String detailAddress;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "user_id")
  private User user;

  public static Address of(AddressRequest addressRequest) {
    return Address.builder()
            .zonecode(addressRequest.getZonecode())
            .roadAddress(addressRequest.getRoadAddress())
            .jibunAddress(addressRequest.getJibunAddress())
            .detailAddress(addressRequest.getDetailAddress())
            .build();
  }
}
