package com.example.oauthjwt.dto.request;

import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionUpdateRequest extends TransactionRequest {
    private Long id; // 트랜잭션 id
    private User user;
    private Product product;
}
