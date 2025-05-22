package com.example.oauthjwt.entity;

import com.example.oauthjwt.dto.request.AddressRequest;
import com.example.oauthjwt.dto.request.ProductRequest;
import com.example.oauthjwt.dto.response.CenterResponse.Item;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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

    private String jibunAddress;

    private String detailAddress;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "address", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Product> productList = new ArrayList<>();


    public static Address of(AddressRequest addressRequest) {
        return Address.builder().zonecode(addressRequest.getZonecode()).roadAddress(addressRequest.getRoadAddress())
                .jibunAddress(addressRequest.getJibunAddress()).detailAddress(addressRequest.getDetailAddress())
                .build();
    }

    public static Address of(Item item) {
        return Address.builder().zonecode(item.getZipCode()).roadAddress(item.getAddr())
                .detailAddress(item.getAddrDetail()).build();
    }

    public void setUpdateValue(ProductRequest productRequest) {
        this.zonecode = productRequest.getAddress().getZonecode();
        this.roadAddress = productRequest.getAddress().getRoadAddress();
        this.jibunAddress = productRequest.getAddress().getJibunAddress();
        this.detailAddress = productRequest.getAddress().getDetailAddress();
    }
}
