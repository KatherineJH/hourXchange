package com.example.oauthjwt.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
public class UserTagResponse {
    private String tag;
    private int count;

    public UserTagResponse(String tag, int count) {
        this.tag = tag;
        this.count = count;
    }
}