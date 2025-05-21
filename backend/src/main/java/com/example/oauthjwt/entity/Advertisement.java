package com.example.oauthjwt.entity;

import com.example.oauthjwt.dto.request.AdvertisementRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.minidev.json.annotate.JsonIgnore;

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
    private int hours;

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
    }

    public static Advertisement of(AdvertisementRequest request, User owner) {
        return Advertisement.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .hours(request.getHours())
                .owner(owner)
                .build();
    }
}
