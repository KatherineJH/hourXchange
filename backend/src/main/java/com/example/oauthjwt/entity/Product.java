package com.example.oauthjwt.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import com.example.oauthjwt.dto.request.ProductRequest;
import com.example.oauthjwt.dto.response.VollcolectionResponse.Item;

import com.example.oauthjwt.entity.type.ProviderType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Product {

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

    @Column(nullable = false)
    private String lat; // 위도 가로

    @Column(nullable = false)
    private String lng; // 경도 세로

    @Column(nullable = false)
    private int viewCount;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // single category can have multiple service products
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // 서비스 카테고리

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id", nullable = false)
    private Address address; // 주소

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProviderType providerType; // SP 타입 (구매, 판매)

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    // single transaction can have multiple service products
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Transaction> transactions = new ArrayList<>();

    // 하나의 serviceProduct에 문의는 여러 명이 걸 수 있으므로, OneToOne 에서 OneToMany 으로 수정
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatRoom> chatRooms = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Favorite> favoriteList = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @Builder.Default
    private List<ProductTag> productTags = new ArrayList<>();

    public static Product of(ProductRequest productRequest,
                             User owner,
                             Category category,
                             ProviderType providerType,
                             Address address,
                             List<ProductImage> images,
                             List<String> tagStrings) {

        Product product = Product.builder()
                .title(productRequest.getTitle())
                .description(productRequest.getDescription())
                .hours(productRequest.getHours())
                .startedAt(productRequest.getStartedAt())
                .endAt(productRequest.getEndAt())
                .lat(productRequest.getLat())
                .lng(productRequest.getLng())
                .viewCount(0)
                .createdAt(LocalDateTime.now())
                .owner(owner)
                .category(category)
                .providerType(providerType)
                .address(address)
                .build();

        // 이미지 설정
        images.forEach(img -> img.setProduct(product));
        product.getImages().addAll(images);

        // 태그 설정
        if (tagStrings != null) {
            tagStrings.stream().limit(5).forEach(tagStr -> {
                ProductTag tag = ProductTag.builder()
                        .productTag(tagStr)
                        .product(product)
                        .build();
                product.getProductTags().add(tag);
            });
        }

        return product;
    }

    public static Product of(ProductRequest productRequest, User owner, Category category, ProviderType providerType, Address address) {
        return Product.builder()
                .title(productRequest.getTitle())
                .description(productRequest.getDescription())
                .hours(productRequest.getHours())
                .startedAt(productRequest.getStartedAt())
                .endAt(productRequest.getEndAt())
                .lat(productRequest.getLat())
                .lng(productRequest.getLng())
                .viewCount(0)
                .createdAt(LocalDateTime.now())
                .status(true)
                .owner(owner)
                .category(category)
                .providerType(providerType)
                .address(address)
                .build();
    }

    public static Product of(ProductRequest productRequest, User owner, Category category, ProviderType providerType, Address address,
            List<ProductImage> images) {
        Product product = of(productRequest, owner, category, providerType, address);
        images.forEach(image -> image.setProduct(product));
        product.getImages().addAll(images);
        return product;
    }

    public static Product of(Item item, User user, Category category, ProviderType providerType, String[] position) {
        return Product.builder()
                .title(item.getTitle())
                .description(item.getSeq())
                .hours(0)
                .startedAt(LocalDateTime.now())
                .endAt(LocalDateTime.now())
                .lat(position[0])
                .lng(position[1])
                .viewCount(0)
                .createdAt(LocalDate.parse(item.getRegDate(), DateTimeFormatter.ISO_DATE).atStartOfDay())
                .status(true)
                .owner(user)
                .category(category)
                .providerType(providerType)
                .build();
    }

    public Product setUpdateValue(ProductRequest productRequest, Category category, ProviderType providerType,
            List<ProductImage> images) {
        this.title = productRequest.getTitle();
        this.description = productRequest.getDescription();
        this.hours = productRequest.getHours();
        this.startedAt = productRequest.getStartedAt();
        this.endAt = productRequest.getEndAt();
        this.lat = productRequest.getLat();
        this.lng = productRequest.getLng();
        this.category = category;
        this.providerType = providerType;
        this.getImages().addAll(images);
        return this;
    }

    public Product addViewCount() {
        this.viewCount++;
        return this;
    }

    public void setDelete(){
        this.status = false;
    }
}
