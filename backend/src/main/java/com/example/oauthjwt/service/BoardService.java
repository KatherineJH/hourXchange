package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.BoardRequest;
import com.example.oauthjwt.dto.response.BoardResponse;

import java.util.Map;

public interface BoardService {
    Map<String, String> existsById(Long id);

    Map<String, String> existsByImgUrl(String imgUrl);

    BoardResponse save(BoardRequest boardRequest);

    BoardResponse findById(Long id);

    BoardResponse update(BoardRequest boardRequest);
}
