package com.example.oauthjwt.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.oauthjwt.dto.request.ServiceProductRequest;
import com.example.oauthjwt.dto.request.ServiceProductUpdateRequest;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceProduct {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private String description;

  @Column(nullable = false)
  private int hours;

  @Column(nullable = false)
  private LocalDateTime startedAt;

  @Column(nullable = false)
  private LocalDateTime endAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "owner_id", nullable = false)
  private User owner;

  // single category can have multiple service products
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id", nullable = false)
  private Category category; // 서비스 카테고리

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private ProviderType providerType; // SP 타입 (구매, 판매)

  @OneToMany(mappedBy = "serviceProduct", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<SPImage> images = new ArrayList<>();

  // single transaction can have multiple service products
  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<Transaction> transactions = new ArrayList<>();

  // 하나의 serviceProduct에 문의는 여러 명이 걸 수 있으므로, OneToOne 에서  OneToMany 으로 수정
  @OneToMany(mappedBy = "serviceProduct", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ChatRoom> chatRooms = new ArrayList<>();

  public static ServiceProduct of(ServiceProductRequest serviceProductRequest, User owner, Category category, ProviderType providerType) {
    return ServiceProduct.builder()
            .title(serviceProductRequest.getTitle())
            .description(serviceProductRequest.getDescription())
            .hours(serviceProductRequest.getHours())
            .startedAt(serviceProductRequest.getStartedAt())
            .endAt(serviceProductRequest.getEndAt())
            .owner(owner)
            .category(category)
            .providerType(providerType)
            .build();
  }

  public static ServiceProduct of(ServiceProductRequest serviceProductRequest, User owner, Category category, ProviderType providerType, List<SPImage> images) {
    ServiceProduct serviceProduct = of(serviceProductRequest, owner, category, providerType);
    images.forEach(image -> image.setServiceProduct(serviceProduct));
    serviceProduct.getImages().addAll(images);
    return serviceProduct;
  }



  public ServiceProduct setUpdateValue(ServiceProductRequest serviceProductRequest, Category category, ProviderType providerType, List<SPImage> images) {
      this.title = serviceProductRequest.getTitle();
      this.description = serviceProductRequest.getDescription();
      this.hours = serviceProductRequest.getHours();
      this.startedAt = serviceProductRequest.getStartedAt();
      this.endAt = serviceProductRequest.getEndAt();
      this.category = category;
      this.providerType = providerType;
      this.getImages().clear();
      this.getImages().addAll(images);
    return this;
  }
}
