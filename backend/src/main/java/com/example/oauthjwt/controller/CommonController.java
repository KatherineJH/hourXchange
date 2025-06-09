package com.example.oauthjwt.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * 지정된 테이블의 첫 번째 혹은 마지막 row 데이터를 조회.
 * <p>
 * 주요 사용 목적: - 예측 모델에 필요한 데이터를 빠르게 조회하기 위함.
 * <p>
 * 주의사항: - 허용된 테이블 목록에 한해서만 조회가 가능하며, allowedTables에 정의된 테이블만 허용. - 테이블에 저장된
 * 데이터는 날짜 기준으로 내림차순 정렬되어 있어야 함. FILO. - position 파라미터는 "first" 또는 "last" 값만 지원.
 */
@RestController
@RequestMapping("/api/meta")
public class CommonController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final Set<String> allowedTables = Set.of("address", "advertisement", "board", "boardimage",
            "category", "chat_messages", "chat_room_users", "chat_rooms", "comment", "donation", "donationhistory",
            "donationimage", "favorite", "orders", "payment", "paymentitem", "product", "review", "reviewtag",
            "serviceproduct", "spimage", "thumbsup", "transaction", "user", "visitlog", "wallet", "wallethistory");

    /**
     * 지정된 테이블에서 첫 번째 또는 마지막 row를 조회. 해당 컨트롤러는 서비스와 레포지토리를 따로 사용하지 않음으로, 예외적으로 예외처리를
     * 컨트롤러에 작성함.
     *
     * @param table
     *            조회할 테이블명 (소문자로 비교되며, allowedTables 내에 있어야 함)
     * @param position
     *            "first" 또는 "last" 중 하나의 값으로, ASC 또는 DESC 정렬 여부를 지정
     * @return 해당 테이블의 첫 번째 또는 마지막 row를 Map 형식으로 반환
     * @throws ResponseStatusException
     *             잘못된 테이블명 또는 포지션 값이 들어올 경우 400 Bad Request 응답 예: GET
     *             /api/meta/row?table=user&position=first
     */
    @GetMapping("/row")
    public Map<String, Object> getFirstOrLastRow(@RequestParam String table, @RequestParam String position) {
        if (!allowedTables.contains(table.toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid table name.");
        }
        if (!position.equalsIgnoreCase("first") && !position.equalsIgnoreCase("last")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Position must be 'first' or 'last'.");
        }

        String order = position.equalsIgnoreCase("first") ? "ASC" : "DESC";
        String query = String.format("SELECT * FROM %s ORDER BY id %s LIMIT 1", table, order);
        List<Map<String, Object>> result = jdbcTemplate.queryForList(query);

        return result.isEmpty() ? Map.of() : result.get(0);
    }
}
