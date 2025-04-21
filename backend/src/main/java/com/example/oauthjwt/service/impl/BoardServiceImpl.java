package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.request.BoardRequest;
import com.example.oauthjwt.dto.response.BoardResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.exception.ValidationException;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final BoardImageRepository boardImageRepository;
    private final CategoryRepository categoryRepository;
    private final ThumbsUpRepository thumbsUpRepository;

    @Override
    public Map<String, String> existsById(Long id) {
        if (!boardRepository.existsById(id)) { // id로 조회한 정보가 존재하지 않는 경우
            return Map.of("error", "게시글를 찾을 수 없습니다.");
        }
        return Collections.emptyMap();
    }

    @Override
    public Map<String, String> existsByImgUrl(String imgUrl) {
        if (boardImageRepository.existsByImgUrl(imgUrl)) {
            return Map.of("error", "중복된 이미지 주소입니다.");
        }
        return Collections.emptyMap();
    }

    @Override
    public BoardResponse save(BoardRequest boardRequest) {
        User author = userRepository.findById(boardRequest.getAuthorId())
                .orElseThrow(() -> new ValidationException("작성자 정보가 존재하지 않습니다."));

        Category category = categoryRepository.findById(boardRequest.getCategoryId())
                .orElseThrow(() -> new ValidationException("카테고리가 존재하지 않습니다."));

        if (boardRequest.getImages() != null) {
            for (String url : boardRequest.getImages()) {
                if (boardImageRepository.existsByImgUrl(url)) {
                    throw new ValidationException("이미 등록된 이미지입니다: " + url);
                }
            }
        }
        Board board = Board.builder()
                .author(author)
                .id(boardRequest.getId())
                .title(boardRequest.getTitle())
                .description(boardRequest.getDescription())
                .category(category)
                .images(new ArrayList<>())
                .build();

        if (boardRequest.getImages() != null) {
            for (String url : boardRequest.getImages()) {
                BoardImage boardImage = BoardImage.builder().imgUrl(url).board(board).build();
                board.getImages().add(boardImage);
            }
        }

        Board result = boardRepository.save(board);
        return BoardResponse.toDto(result);
    }

    @Override
    public BoardResponse findById(Long boardId, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        long likeCount = thumbsUpRepository.countByBoardId(boardId);
        boolean likedByMe = thumbsUpRepository
                .findByBoardIdAndUserId(boardId, userId)
                .isPresent();

        return BoardResponse.toDto(board, likeCount, likedByMe);
    }

    @Override
    public BoardResponse update(BoardRequest boardRequest) {
        Board board = boardRepository.findById(boardRequest.getId())
                .orElseThrow(() -> new ValidationException("수정할 게시글이 존재하지 않습니다."));
        if (!board.getAuthor().getId().equals(boardRequest.getAuthorId())) {
            throw new ValidationException("작성자만 수정할 수 있습니다.");
        }

        Category category = categoryRepository.findById(boardRequest.getCategoryId())
                .orElseThrow(() -> new ValidationException("카테고리가 존재하지 않습니다."));
        boardRequest.setCategory(category);

        Board updated = boardRepository.save(board.setUpdateValue(boardRequest));
        return BoardResponse.toDto(updated);
    }

    @Override
    @Transactional
    public BoardResponse toggleThumbsUp(Long boardId, Long userId) {
        // 1) 게시글·사용자 조회
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + boardId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 없습니다. id=" + userId));

        // 2) “자신의 게시글엔 좋아요 불가” 체크
        if (board.getAuthor().getId().equals(userId)) {
            throw new IllegalArgumentException("자신의 게시글에는 좋아요를 누를 수 없습니다.");
        }

        // 3) 기존 좋아요 조회 및 토글
        Optional<ThumbsUp> existing =
                thumbsUpRepository.findByBoardIdAndUserId(boardId, userId);

        if (existing.isPresent()) {
            thumbsUpRepository.delete(existing.get());
        } else {
            ThumbsUp tu = new ThumbsUp();
            tu.setBoard(board);
            tu.setUser(user);
            thumbsUpRepository.save(tu);
        }

        // 4) 최신 좋아요 개수·내 좋아요 여부
        long totalLikes = thumbsUpRepository.countByBoardId(boardId);
        boolean likedByMe = existing.isEmpty();

        // 5) DTO 반환
        return BoardResponse.toDto(board, totalLikes, likedByMe);
    }
}
