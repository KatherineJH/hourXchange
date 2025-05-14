// src/page/board/MyBoardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import BoardTable from "../../component/board/BoardTable";
import { getMyBoardList } from "../../api/boardApi";

function MyBoardPage() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMyBoards = async () => {
    try {
      const data = await getMyBoardList(page, size);
      setBoards(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("❌ 내 게시글 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchMyBoards();
  }, [page, size]);

  return (
    <Box sx={{ mt: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🙋‍♀️ 나의 게시글 리스트
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/board/save")}
              sx={{ height: "40px" }}
            >
              글쓰기
            </Button>
          </Box>

          <BoardTable boards={boards} navigate={navigate} />

          <Box
            sx={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(event, value) => setPage(value - 1)}
                variant="outlined"
                shape="rounded"
                color="primary"
              />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default MyBoardPage;
