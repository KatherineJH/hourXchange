package com.example.oauthjwt.service;

import java.util.Map;

import com.example.oauthjwt.service.impl.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.request.BoardRequest;
import com.example.oauthjwt.dto.response.BoardResponse;

public interface BoardService {

    BoardResponse save(BoardRequest boardRequest, CustomUserDetails userDetails);

    // List<BoardResponse> findAllBoards();
    Page<BoardResponse> findAllBoards(Pageable pageable);

    BoardResponse findById(Long boardId, Long userId);

    BoardResponse findMyBoardById(Long boardId, Long userId);

    BoardResponse update(BoardRequest boardRequest, Long boardId, CustomUserDetails userDetails);

    /** 특정 게시글에 대해 좋아요 토글 처리 후, 최신 좋아요 개수와 내 좋아요 여부를 담은 DTO 반환 */
    BoardResponse toggleThumbsUp(Long boardId, Long userId) throws Exception;

    Page<BoardResponse> findByAuthorId(Long authorId, Pageable pageable);
}
