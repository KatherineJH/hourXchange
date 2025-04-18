package com.example.oauthjwt.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

  public ServiceProduct setUpdateValue(ServiceProductUpdateRequest serviceProductUpdateRequest) {
    if (serviceProductUpdateRequest.getTitle() != null) { // 제목
      this.title = serviceProductUpdateRequest.getTitle();
    }
    if (serviceProductUpdateRequest.getDescription() != null) { // 설명
      this.description = serviceProductUpdateRequest.getDescription();
    }
    if (serviceProductUpdateRequest.getHours() > 0) { // 시간(코스트)
      this.hours = serviceProductUpdateRequest.getHours();
    }
    if (serviceProductUpdateRequest.getStartedAt() != null) { // 시작시간
      this.startedAt = serviceProductUpdateRequest.getStartedAt();
    }
    if (serviceProductUpdateRequest.getEndAt() != null) { // 끝시간
      this.endAt = serviceProductUpdateRequest.getEndAt();
    }
    if (serviceProductUpdateRequest.getCategory() != null) { // 카테고리
      this.category = serviceProductUpdateRequest.getCategory();
    }
    if (serviceProductUpdateRequest.getImages() != null
        && !serviceProductUpdateRequest.getImages().isEmpty()) { // 이미지
      this.getImages().clear();
      for (String imageUrl : serviceProductUpdateRequest.getImages()) {
        SPImage spImage = SPImage.builder().imgUrl(imageUrl).serviceProduct(this).build();
        this.getImages().add(spImage);
      }
    }
    return this;
  }
}
