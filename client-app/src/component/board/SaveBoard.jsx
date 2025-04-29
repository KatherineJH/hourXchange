// src/component/board/SaveBoard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import uploadToCloudinary from "../../assets/uploadToCloudinary";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { createBoard } from "../../api/boardApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // 로그인 유저 가져오기
import { getList as getCategoryList } from "../../api/categoryApi";

function SaveBoard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // 여러 이미지
  const [uploading, setUploading] = useState(false);

  const [categoryId, setCategoryId] = useState(""); // 카테고리 선택

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setImages((prev) => [...prev, url]); // 여러장 업로드 가능
    } catch (error) {
      console.error("이미지 업로드 실패", error);
    } finally {
      setUploading(false);
    }
  };

  // 사진 삭제 핸들러
  const handleDeleteImage = (index) => {
    const confirmDelete = window.confirm("정말 이 사진을 삭제하시겠습니까?");
    if (confirmDelete) {
      setImages((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !categoryId) {
      alert("제목, 내용, 카테고리를 모두 입력해주세요.");
      return;
    }
    try {
      const boardData = {
        title,
        description,
        images, // List<String>으로 보내야 함
        authorId: user.id,
        categoryId,
      };
      await createBoard(boardData);
      alert("게시글 작성 완료!");
      navigate("/board/list");
    } catch (error) {
      console.error("게시글 저장 실패", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoryList();
        setCategories(response.data); // 서버에서 받은 카테고리 배열 저장
      } catch (error) {
        console.error("카테고리 불러오기 실패", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Box sx={{ mt: 4, maxWidth: "600px", mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        📝 게시글 작성
      </Typography>

      <TextField
        fullWidth
        label="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        label="내용"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={6}
        margin="normal"
      />

      {/* 카테고리 선택 */}
      <TextField
        select
        fullWidth
        label="카테고리 선택"
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))} // 숫자로 변환
        margin="normal"
      >
        {categories.length > 0 ? (
          categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.categoryName}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>카테고리가 없습니다</MenuItem>
        )}
      </TextField>

      {/* 이미지 업로드 */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          🖼️ 사진 업로드
        </Typography>

        {/* 업로드 버튼 + 이미지들 수평 정렬 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* 업로드 버튼 */}
          <Button
            component="label"
            variant="outlined"
            sx={{
              width: "100px",
              height: "100px",
              minWidth: "100px",
              minHeight: "100px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 0,
            }}
          >
            <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>

          {/* 업로드된 이미지 목록 */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {images.map((imgUrl, idx) => (
              <Box
                key={idx}
                onClick={() => handleDeleteImage(idx)} // 👈 클릭 이벤트 추가
                sx={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #ddd",
                  cursor: "pointer", // 👈 마우스 커서 변경
                  position: "relative",
                  "&:hover::after": {
                    content: '"삭제"',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                  },
                }}
              >
                <img
                  src={imgUrl}
                  alt={`업로드된 이미지 ${idx}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* 업로드 중 로딩 */}
          {uploading && <CircularProgress size={24} sx={{ ml: 2 }} />}
        </Box>
      </Box>

      {/* 작성 버튼 */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 4 }}
        onClick={handleSave}
      >
        작성 완료
      </Button>
    </Box>
  );
}

export default SaveBoard;
