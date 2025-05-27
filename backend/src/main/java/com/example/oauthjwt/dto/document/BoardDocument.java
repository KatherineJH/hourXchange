//package com.example.oauthjwt.dto.document;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//import org.springframework.data.elasticsearch.annotations.Document;
//import org.springframework.data.elasticsearch.annotations.Field;
//import org.springframework.data.elasticsearch.annotations.FieldType;
//
//import jakarta.persistence.Id;
//import lombok.*;
//
//@Document(indexName = "board_index")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class BoardDocument {
//
//    @Id
//    private Long id;
//
//    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
//    private String title;
//
//    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
//    private String description;
//
//    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
//    private String authorName;
//
//    @Field(type = FieldType.Date)
//    private String createdAt;
//
//    private List<String> suggest;
//}

package com.example.oauthjwt.dto.document;

import java.time.format.DateTimeFormatter;
import java.util.List;

import com.example.oauthjwt.entity.Board;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import jakarta.persistence.Id;
import lombok.*;

@Document(indexName = "board_index")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardDocument {

    @Id
    private Long id;

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String title;

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String description;

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String authorName;

    @Field(type = FieldType.Date)
    private String createdAt;

    private List<String> suggest;

    public static BoardDocument toDocument(Board board, String authorName, List<String> finalKeywords) {
        return BoardDocument.builder()
                .id(board.getId())
                .title(board.getTitle())
                .description(board.getDescription())
                .authorName(authorName)
                .createdAt(board.getCreatedAt()
                        .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .suggest(finalKeywords)
                .build();
    }
}