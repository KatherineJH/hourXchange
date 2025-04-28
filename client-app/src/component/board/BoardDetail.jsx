// src/page/board/BoardDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBoardDetail } from "../../api/boardApi";

function BoardDetail() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const data = await getBoardDetail(id);
        setBoard(data);
      } catch (error) {
        console.error("게시판 상세 조회 실패", error);
      }
    };
    fetchBoard();
  }, [id]);

  if (!board) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>📄 게시판 상세</h1>
      <h2>{board.title}</h2>
      <p>작성자: {board.authorName}</p>
      <p>작성일: {new Date(board.createdAt).toLocaleString()}</p>
      <p>{board.description}</p>
    </div>
  );
}

export default BoardDetail;
