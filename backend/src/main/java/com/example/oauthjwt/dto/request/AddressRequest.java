package com.example.oauthjwt.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressRequest {
    @NotBlank(message = "우편번호는 필수 입력사항입니다.")
    private String zonecode; // 우편번호
    @NotBlank(message = "도로명주소는 필수 입력사항입니다.")
    private String roadAddress; // 도로명주소

    private String jibunAddress; // 지번주소

    private String detailAddress; // 상세주소

    public boolean isEmpty() {
        // 필수 입력값이 있는지 확인
        return (zonecode == null || zonecode.isBlank()) && (roadAddress == null || roadAddress.isBlank());
    }
}
