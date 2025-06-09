package com.example.oauthjwt.entity;

import com.example.oauthjwt.dto.request.AdvertisementRequest;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.minidev.json.annotate.JsonIgnore;

import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Advertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private Double hours;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "advertisement_images", joinColumns = @JoinColumn(name = "advertisement_id"))
    @Column(name = "image_url")
    private List<String> images;

    // @ManyToOne(fetch = FetchType.LAZY)
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnore
    private User owner;

    //광고 수정용 메서드
    public void setUpdateValue(AdvertisementRequest request) {
        this.title = request.getTitle();
        this.description = request.getDescription();
        this.hours = request.getHours();
        this.images = request.getImages();
    }

    public static Advertisement of(AdvertisementRequest request, User owner) {
        return Advertisement.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .hours(request.getHours())
                .images(request.getImages())
                .owner(owner)
                .build();
    }
}
