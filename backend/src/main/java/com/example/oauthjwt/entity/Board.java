package com.example.oauthjwt.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.oauthjwt.dto.request.BoardRequest;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    // single category can have multiple service boards
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // 서비스 카테고리

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User author;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    private List<ThumbsUp> thumbsUps = new ArrayList<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BoardImage> images = new ArrayList<>();



    public static Board of(BoardRequest boardRequest, User author, Category category) {
        return Board.builder()
                .title(boardRequest.getTitle())
                .category(category)
                .description(boardRequest.getDescription())
                .author(author)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public Board setUpdateValue(BoardRequest request, Category category) {
        if (request.getTitle() != null) { // 제목
            this.title = request.getTitle();
        }
        if (request.getDescription() != null) { // 내용
            this.description = request.getDescription();
        }
        this.category = category;
        if (request.getImages() != null && !request.getImages().isEmpty()) { // 이미지
            this.images.clear();
            for (String imageUrl : request.getImages()) {
                BoardImage boardImage = new BoardImage();
                boardImage.setImgUrl(imageUrl);
                boardImage.setBoard(this);
                this.images.add(boardImage);
            }
        }
        return this;
    }
}
