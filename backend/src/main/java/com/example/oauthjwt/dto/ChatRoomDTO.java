package com.example.oauthjwt.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomDTO {
    private Long id;
    private String name;
    private List<String> participants;
}
