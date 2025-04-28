// src/component/board/BoardTable.jsx
import React from "react";

function BoardTable({ boards, navigate }) {
  const goToDetail = (id) => {
    navigate(`/board/${id}`);
  };

  return (
    <table border="1" width="100%" style={{ marginTop: "1rem" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
        </tr>
      </thead>
      <tbody>
        {boards.length > 0 ? (
          boards.map((board) => (
            <tr
              key={board.id}
              onClick={() => goToDetail(board.id)}
              style={{ cursor: "pointer" }}
            >
              <td>{board.id}</td>
              <td>{board.title}</td>
              <td>{board.authorName}</td>
              <td>{new Date(board.createdAt).toLocaleString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>
              검색 결과가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default BoardTable;
