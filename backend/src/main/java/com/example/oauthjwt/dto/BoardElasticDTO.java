package com.example.oauthjwt.dto;

import com.example.oauthjwt.entity.Board;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;

@Document(indexName = "board_index")  // 실제 인덱스 이름에 맞춰줘야 해
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class BoardElasticDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String authorName;

    public static BoardElasticDTO fromEntity(Board board) {
        return new BoardElasticDTO(
                board.getId(),
                board.getTitle(),
                board.getDescription(),
                board.getCategory().getCategoryName(),
                board.getAuthor().getName()
        );
    }
}

