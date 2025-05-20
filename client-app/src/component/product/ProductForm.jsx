import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { getList } from "../../api/categoryApi.js";
import { postSave } from "../../api/productApi";
import uploadToCloudinary from "../../assets/uploadToCloudinary.js";
import KakaoSaveMap from "../common/KakaoSaveMap.jsx";
import { useNavigate } from "react-router-dom";

const ProductForm = () => {
  const [saveData, setSaveData] = useState({
    title: "",
    description: "",
    hours: 0,
    categoryId: "",
    providerType: "",
    images: [],
    lat: 37.529521713,
    lng: 126.964540921,
    // ISO 문자열로 초기화
    startedAt: dayjs().add(30, "minute").format("YYYY-MM-DDTHH:mm:ss"),
    endAt: dayjs().add(2, "hour").format("YYYY-MM-DDTHH:mm:ss"),
    address: {
      zonecode: "",
      roadAddress: "",
      jibunAddress: "",
      detailAddress: "",
    },
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getList();
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
    uploadImagesToCloudinary(files);
  };

  const uploadImagesToCloudinary = async (imageFiles) => {
    setUploading(true);
    try {
      const newFiles = imageFiles.filter((f) => !images.includes(f.name));
      if (newFiles.length) {
        const urls = await Promise.all(
          newFiles.map((f) => uploadToCloudinary(f))
        );
        setImages((prev) => [...prev, ...urls]);
        setSaveData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      }
    } catch (error) {
      console.error("이미지 업로드 실패", error);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "hours") {
      const num = parseInt(value, 10);
      setSaveData((prev) => ({
        ...prev,
        hours: isNaN(num) || num < 0 ? 0 : num,
      }));
    } else {
      setSaveData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStartTimeChange = (newValue) => {
    if (!newValue) return;

    const now = dayjs(); // 현재 시간
    const newStart = newValue;

    if (newStart.isBefore(now)) {
      alert("시작 시간은 현재 시간보다 이전으로 설정할 수 없습니다.");
      return;
    }

    setSaveData((prev) => ({
      ...prev,
      startedAt: newStart.format("YYYY-MM-DDTHH:mm:ss"),
    }));
  };

  const handleEndTimeChange = (newValue) => {
    if (!newValue) return;

    const newEnd = newValue;
    const currentStart = dayjs(saveData.startedAt);

    if (newEnd.isBefore(currentStart)) {
      alert("종료 시간은 시작 시간 이후로 설정해야 합니다.");
      return;
    }

    setSaveData((prev) => ({
      ...prev,
      endAt: newEnd.format("YYYY-MM-DDTHH:mm:ss"),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // saveData.startedAt과 endAt은 이미 ISO 문자열
      console.log("전송 payload:", saveData);
      const res = await postSave(saveData);
      alert("상품이 성공적으로 저장되었습니다.");
      navigate(`/product/read/${res.data.id}`);
    } catch (err) {
      console.error("서버 전송 오류", err);
      alert("저장 중 문제가 발생하였습니다.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <form onSubmit={handleSubmit}>
        {/* 이미지 업로드 및 미리보기 */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
            multiple
          />
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={handleAddClick}
              sx={{
                width: 150,
                height: 150,
                borderRadius: 2,
                border: "1px solid #ddd",
              }}
            >
              <AddPhotoAlternateIcon />
            </Button>
            {previews.map((src, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 150,
                  height: 150,
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (window.confirm("사진을 지우시겠습니까?")) {
                    setPreviews((prev) => prev.filter((_, i) => i !== idx));
                    setImages((prev) => prev.filter((_, i) => i !== idx));
                    setSaveData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== idx),
                    }));
                  }
                }}
              >
                <img
                  src={src}
                  alt={`preview-${idx}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* 타입 및 카테고리 */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="providerType-label">타입</InputLabel>
            <Select
              labelId="providerType-label"
              name="providerType"
              value={saveData.providerType}
              label="타입"
              onChange={handleChange}
            >
              <MenuItem value="">---타입---</MenuItem>
              <MenuItem value="BUYER">BUYER</MenuItem>
              <MenuItem value="SELLER">SELLER</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="categoryId-label">카테고리</InputLabel>
            <Select
              labelId="categoryId-label"
              name="categoryId"
              value={saveData.categoryId}
              label="카테고리"
              onChange={handleChange}
            >
              <MenuItem value="">---카테고리---</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* 제목 */}
        <TextField
          label="제목"
          name="title"
          value={saveData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* 설명 */}
        <TextField
          label="내용"
          name="description"
          value={saveData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />

        {/* 날짜 */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="시작 시간"
              value={dayjs(saveData.startedAt)}
              onChange={handleStartTimeChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="종료 시간"
              value={dayjs(saveData.endAt)}
              onChange={handleEndTimeChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Box>

        {/* 상품 시간 */}
        <TextField
          label="상품 시간"
          name="hours"
          type="number"
          value={saveData.hours}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* 지도 */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <KakaoSaveMap saveData={saveData} setSaveData={setSaveData} />
        </Box>

        {/* 전송 버튼 */}
        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Button variant="contained" endIcon={<SendIcon />} type="submit">
            등록
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProductForm;
