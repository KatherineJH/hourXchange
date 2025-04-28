// src/page/board/BoardPage.jsx
import React, { useEffect, useState } from "react";
import BoardTable from "../../component/board/BoardTable";
import { useNavigate } from "react-router-dom";
import {
  getAllBoards,
  searchBoards,
  getAutocompleteSuggestions,
} from "../../api/boardApi";

function BoardPage() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);

  const [page, setPage] = useState(0); // JPA는 0부터 시작
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState(""); // 검색어 입력
  const [suggestions, setSuggestions] = useState([]); // 추천 검색어 리스트

  // 게시판 데이터 가져오기
  const fetchBoards = async () => {
    try {
      if (keyword.trim() === "") {
        const data = await getAllBoards(page, size);
        setBoards(data.content);
        setTotalPages(data.totalPages);
      } else {
        const data = await searchBoards(keyword, page, size);
        setBoards(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("게시판 불러오기 실패", error);
    }
  };

  // 페이지 변경, 검색어 변경 시 다시 게시판 데이터를 불러옴
  useEffect(() => {
    fetchBoards();
  }, [page, size, keyword]);

  // 🔍 입력값이 바뀔 때마다 추천 검색어 호출
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.trim() === "") {
        setSuggestions([]);
        return;
      }
      try {
        const result = await getAutocompleteSuggestions(searchInput);
        setSuggestions(result);
      } catch (e) {
        console.error("추천 검색어 실패", e);
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [searchInput]);

  const handleSearch = () => {
    setKeyword(searchInput); // 검색어를 확정
    setPage(0); // 첫 페이지로
  };

  return (
    <div>
      <h1>📋 Board 검색 페이지</h1>

      <div style={{ position: "relative", width: "300px" }}>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>

        {/* 🔽 추천 검색어 리스트 표시 */}
        {suggestions.length > 0 && (
          <ul
            style={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              listStyle: "none",
              padding: "0",
              margin: "0",
              position: "absolute",
              width: "100%",
              zIndex: 10,
            }}
          >
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setSearchInput(s);
                  setKeyword(s);
                  setPage(0);
                  setSuggestions([]); // 추천창 닫기
                }}
                style={{ padding: "5px", cursor: "pointer" }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <BoardTable boards={boards} navigate={navigate} />

      <div style={{ marginTop: "1rem" }}>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          이전
        </button>
        <span style={{ margin: "0 10px" }}>
          {page + 1} / {totalPages} 페이지
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default BoardPage;
