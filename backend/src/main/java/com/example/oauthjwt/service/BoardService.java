package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.BoardRequest;
import com.example.oauthjwt.dto.response.BoardResponse;

import java.util.List;
import java.util.Map;

public interface BoardService {
    Map<String, String> existsById(Long id);

    Map<String, String> existsByImgUrl(String imgUrl);

    BoardResponse save(BoardRequest boardRequest);

    List<BoardResponse> findAllBoards();

    BoardResponse findById(Long boardId, Long userId);

    BoardResponse findMyBoardById(Long boardId, Long userId);

    BoardResponse update(BoardRequest boardRequest);

    /**
     * 특정 게시글에 대해 좋아요 토글 처리 후,
     * 최신 좋아요 개수와 내 좋아요 여부를 담은 DTO 반환
     */
    BoardResponse toggleThumbsUp(Long boardId, Long userId) throws Exception;
}
