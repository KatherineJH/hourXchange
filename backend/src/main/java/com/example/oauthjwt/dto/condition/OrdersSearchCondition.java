package com.example.oauthjwt.dto.condition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdersSearchCondition {
    private Long ordersId;
    private String impUid;
    private String merchantUid;
    private String email;
    private String paymentItemName;
    private LocalDate startDate; // 시작일
    private LocalDate endDate; // 끝일

}
