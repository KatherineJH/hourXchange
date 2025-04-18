package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.request.BoardRequest;
import com.example.oauthjwt.dto.response.BoardResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.BoardImageRepository;
import com.example.oauthjwt.repository.BoardRepository;
import com.example.oauthjwt.repository.CategoryRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final BoardImageRepository boardImageRepository;
    private final CategoryRepository categoryRepository;

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

        User author = userRepository.findById(boardRequest.getAuthorId()).get(); // 유저 조회
        Category category =
                categoryRepository.findById(boardRequest.getCategoryId()).get(); // 카테고리 조회

        Board board =
                Board.builder() // 저장할 객체 생성
                        .author(author)
                        .id(boardRequest.getId())
                        .title(boardRequest.getTitle())
                        .description(boardRequest.getDescription())
                        .category(category)
                        .images(new ArrayList<>()) // ✅ images 리스트 초기화 필요
                        .build();

        if (boardRequest.getImages() != null
                && !boardRequest.getImages().isEmpty()) { // 이미지가 있는 경우에만 등록
            for (String url : boardRequest.getImages()) { // 이미지 url list 등록
                BoardImage boardImage = BoardImage.builder().imgUrl(url).board(board).build();

                board.getImages().add(boardImage);
            }
        }

        Board result = boardRepository.save(board); // 저장 후 결과 반환
        return BoardResponse.toDto(result);
    }

    @Override
    public BoardResponse findById(Long id) {
        return BoardResponse.toDto(boardRepository.findById(id).get());
    }

    @Override
    public BoardResponse update(BoardRequest boardRequest) {
        Board board =
                boardRepository.findById(boardRequest.getId()).get();
        Category category =
                categoryRepository.findById(boardRequest.getCategoryId()).get();
        boardRequest.setCategory(category); // 카테고리 DTO에 등록

        Board result =
                boardRepository.save(
                        board.setUpdateValue(boardRequest)); // 값 수정

        return BoardResponse.toDto(result); // 반환
    }
}
