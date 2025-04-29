// src/component/board/SaveBoard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import uploadToCloudinary from "../../assets/uploadToCloudinary";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { createBoard, updateBoard, getBoardDetail } from "../../api/boardApi";
import { useSelector } from "react-redux"; // 로그인 유저 가져오기
import { getList as getCategoryList } from "../../api/categoryApi";

function SaveBoard() {
  const navigate = useNavigate();
  const { id } = useParams();
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
        title: title.trim(),
        description: description.trim(),
        images,
        authorId: user.id,
        categoryId,
      };
      if (id) {
        // 📌 수정모드면 updateBoard 호출
        await updateBoard(id, boardData);
        alert("게시글 수정 완료!");
      } else {
        // 작성모드면 createBoard 호출
        await createBoard(boardData);
        alert("게시글 작성 완료!");
      }
      navigate("/board/list");
    } catch (error) {
      console.error("게시글 저장 실패", error);
    }
  };

  // 📌 기존 글 수정 -> 데이터 불러오기
  useEffect(() => {
    const fetchInit = async () => {
      try {
        const categoryResponse = await getCategoryList();
        setCategories(categoryResponse.data);
        // id가 있으면 수정모드
        if (id) {
          const boardResponse = await getBoardDetail(id);
          setTitle(boardResponse.title);
          setDescription(boardResponse.description);
          setImages(boardResponse.images || []);
          setCategoryId(boardResponse.category.id);
        }
      } catch (error) {
        console.error("초기 데이터 불러오기 실패", error);
      }
    };

    fetchInit();
  }, [id]);

  return (
    <Box sx={{ mt: 4, maxWidth: "600px", mx: "auto" }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
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
          <Box sx={{ mt: 4 }}>
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
                    onClick={() => handleDeleteImage(idx)}
                    sx={{
                      width: 100,
                      height: 100,
                      border: 1,
                      borderRadius: 2,
                      overflow: "hidden",
                      position: "relative",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.5)",
                        "&::after": { content: '"삭제"' },
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
            {/* 작성 완료 */}
            {id ? "수정 완료" : "작성 완료"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SaveBoard;
