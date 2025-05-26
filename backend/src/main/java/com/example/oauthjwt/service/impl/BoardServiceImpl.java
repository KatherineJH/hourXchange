package com.example.oauthjwt.service.impl;

import java.util.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.request.BoardRequest;
import com.example.oauthjwt.dto.response.BoardResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.BoardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final BoardImageRepository boardImageRepository;
    private final CategoryRepository categoryRepository;
    private final ThumbsUpRepository thumbsUpRepository;

    @Override
    public BoardResponse save(BoardRequest boardRequest, CustomUserDetails userDetails) {
        User author = userRepository.findById(userDetails.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "작성자 정보가 존재하지 않습니다."));
        Category category = categoryRepository.findById(boardRequest.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리가 존재하지 않습니다."));

        // 이미지 중복 검사
        if (boardRequest.getImages() != null) {
            for (String url : boardRequest.getImages()) {
                if (boardImageRepository.existsByImgUrl(url)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 이미지입니다: " + url);
                }
            }
        }
        // Board 생성
        Board board = Board.of(boardRequest, author, category);

        // 이미지 추가
        if (boardRequest.getImages() != null) {
            for (String url : boardRequest.getImages()) {
                BoardImage boardImage = BoardImage.of(url, board);
                board.getImages().add(boardImage);
            }
        }
        Board result = boardRepository.save(board);
        return BoardResponse.toDto(result);
    }

    @Override
    public Page<BoardResponse> findAllBoards(Pageable pageable) {
        Page<Board> boardsPage = boardRepository.findAll(pageable);
        if (boardsPage.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "게시글이 존재하지 않습니다.");
        }
        return boardsPage.map(BoardResponse::toDto);
    }

    @Override
    public BoardResponse findById(Long boardId, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글이 존재하지 않습니다."));

        long likeCount = thumbsUpRepository.countByBoardId(boardId);
        boolean likedByMe = thumbsUpRepository.findByBoardIdAndUserId(boardId, userId).isPresent();

        return BoardResponse.toDto(board, likeCount, likedByMe);
    }

    @Override
    public BoardResponse findMyBoardById(Long boardId, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 게시글입니다."));

        if (!board.getAuthor().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인의 게시글만 조회할 수 있습니다.");
        }

        return BoardResponse.toDto(board);
    }

    @Override
    public BoardResponse update(BoardRequest boardRequest, Long boardId, CustomUserDetails userDetails) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "수정할 게시글이 존재하지 않습니다."));

        if (!board.getAuthor().getId().equals(userDetails.getUser().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자만 수정할 수 있습니다.");
        }

        Category category = categoryRepository.findById(boardRequest.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리가 존재하지 않습니다."));

        Board updated = boardRepository.save(board.setUpdateValue(boardRequest, category));
        return BoardResponse.toDto(updated);
    }

    @Override
    @Transactional
    public BoardResponse toggleThumbsUp(Long boardId, Long userId) {
        // 1) 게시글·사용자 조회
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글이 없습니다. id=" + boardId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자가 없습니다. id=" + userId));

        // 2) “자신의 게시글엔 좋아요 불가” 체크
        if (board.getAuthor().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "자신의 게시글에는 좋아요를 누를 수 없습니다.");
        }

        // 3) 기존 좋아요 조회 및 토글
        Optional<ThumbsUp> existing = thumbsUpRepository.findByBoardIdAndUserId(boardId, userId);

        if (existing.isPresent()) {
            thumbsUpRepository.delete(existing.get());
        } else {
            ThumbsUp tu = ThumbsUp.of(board, user);
            thumbsUpRepository.save(tu);
        }

        // 4) 최신 좋아요 개수·내 좋아요 여부
        long totalLikes = thumbsUpRepository.countByBoardId(boardId);
        boolean likedByMe = existing.isEmpty();

        // 5) DTO 반환
        return BoardResponse.toDto(board, totalLikes, likedByMe);
    }

    @Override
    public Page<BoardResponse> findByAuthorId(Long authorId, Pageable pageable) {
        Page<Board> boards = boardRepository.findByAuthorId(authorId, pageable);
        return boards.map(board -> BoardResponse.toDto(board));
    }
}
