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
import { useSelector } from "react-redux";
import { getList as getCategoryList } from "../../api/categoryApi";

function SaveBoard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [boardAuthorId, setBoardAuthorId] = useState(null); // 작성자 ID 저장

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setImages((prev) => [...prev, url]);
    } catch (error) {
      console.error("이미지 업로드 실패", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (index) => {
    if (window.confirm("정말 이 사진을 삭제하시겠습니까?")) {
      setImages((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !categoryId) {
      alert("제목, 내용, 카테고리를 모두 입력해주세요.");
      return;
    }

    // ✅ 저장 시에도 작성자 체크
    if (id && user && boardAuthorId !== user.id) {
      alert("작성자만 수정할 수 있습니다.");
      navigate("/board/list");
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
        await updateBoard(id, boardData);
        alert("게시글 수정 완료!");
      } else {
        await createBoard(boardData);
        alert("게시글 작성 완료!");
      }
      const currentPath = window.location.pathname;
      let basePath = "/board"; // Default base path
      if (currentPath.startsWith("/myPage")) {
        basePath = "/myPage/board"; // If inside myPage, adjust the base path
      } else if (currentPath.startsWith("/admin")) {
        basePath = "/admin/board"; // If inside admin, adjust the base path
      }
      // navigate("/board/list");
    } catch (error) {
      console.error("게시글 저장 실패", error);
    }
  };

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const categoryResponse = await getCategoryList();
        setCategories(categoryResponse.data);

        if (id) {
          const boardResponse = await getBoardDetail(id);

          // ✅ 페이지 들어올 때 작성자 검증
          if (user && boardResponse.author.id !== user.id) {
            alert("작성자만 수정할 수 있습니다.");
            navigate("/board/list");
            return;
          }

          setTitle(boardResponse.title);
          setDescription(boardResponse.description);
          setImages(boardResponse.images || []);
          setCategoryId(boardResponse.category.id);
          setBoardAuthorId(boardResponse.author.id); // 작성자 ID 저장
        }
      } catch (error) {
        console.error("초기 데이터 불러오기 실패", error);
      }
    };

    fetchInit();
  }, [id, user, navigate]);

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

          <TextField
            select
            fullWidth
            label="카테고리 선택"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
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

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Button
                component="label"
                variant="outlined"
                sx={{ width: 100, height: 100, borderRadius: 2 }}
              >
                <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>

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
                      cursor: "pointer",
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
            {id ? "수정 완료" : "작성 완료"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SaveBoard;
