import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Select,
  InputLabel,
  FormControl,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { getList } from "../../api/categoryApi.js";
import { postSave } from "../../api/productApi";
import uploadToCloudinary from "../../assets/image/uploadToCloudinary.js";

const ProductForm = () => {
  const [saveData, setSaveData] = useState({
    title: "",
    description: "",
    hours: 0,
    categoryId: "",
    providerType: "",
    images: [],
    lat: "",
    lng: "",
    startedAt: dayjs(),
    endAt: dayjs(),
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getList(); // 카테고리 목록을 가져옴
      setCategories(response.data); // 카테고리 목록을 상태에 저장
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaveData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrls = [];

      if (saveData.images.length > 0) {
        const uploadPromises = saveData.images.map((file) =>
          uploadToCloudinary(file)
        );
        imageUrls = await Promise.all(uploadPromises);
        console.log("Cloudinary에 업로드된 이미지 URL:", imageUrls);
      }

      const finalData = {
        ...saveData,
        images: imageUrls, // 업로드된 이미지 URL을 여기에 포함
      };

      await postSave(finalData); // 실제 저장 API 호출

      alert("상품이 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("업로드 또는 저장 중 오류:", error);
      alert("저장 중 문제가 발생했습니다.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImages((prev) => [...prev, file]);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews((prev) => [...prev, reader.result]);
    };
    reader.readAsDataURL(file);

    e.target.value = null; // 동일 파일 다시 선택할 수 있게 초기화
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  const handleStartTimeChange = (newValue) => {
    setSaveData((prevState) => ({
      ...prevState,
      startedAt: newValue,
    }));
  };

  const handleEndTimeChange = (newValue) => {
    if (newValue && newValue.isBefore(saveData.startedAt)) {
      alert("종료시간은 시작 시간 후에 설정해 주시길 바랍니다.");
      return;
    }

    setSaveData((prevState) => {
      return {
        ...prevState,
        endAt: newValue,
      };
    });
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <form onSubmit={handleSubmit}>
        {/* 제목 입력 */}
        <TextField
          label="제목을 입력하세요."
          name="title"
          value={saveData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {/* 설명 입력 */}
        <TextField
          label="내용을 입력하세요."
          name="description"
          value={saveData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={6}
        />

        {/* 이미지 업로드 */}
        <Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
            {previews.map((src, idx) => (
              <Box
                key={idx}
                position="relative"
                onClick={() => handleRemoveImage(idx)} // 이미지 클릭 시 삭제
                sx={{ cursor: "pointer" }} // 클릭 가능한 것처럼 커서를 변경
              >
                <img
                  src={src}
                  alt={`preview-${idx}`}
                  width={100}
                  height={100}
                  style={{
                    objectFit: "cover",
                    borderRadius: 4,
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </Box>
            ))}
            {/* 추가 버튼 */}
            <Button
              variant="outlined"
              onClick={handleAddClick}
              sx={{
                width: 100,
                height: 100,
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
                border: "1px dashed rgba(0,0,0,0.3)",
              }}
            >
              <AddPhotoAlternateIcon />
            </Button>

            {/* 숨겨진 파일 input */}
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
          {/* 상품 시간 */}
          <Box flex={1}>
            <TextField
              label="상품 시간"
              name="hours"
              type="number"
              value={saveData.hours}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Box>

          {/* 카테고리 드롭다운 */}
          <Box flex={1}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="categoryId-label">카테고리</InputLabel>
              <Select
                labelId="categoryId-label"
                id="categoryId"
                name="categoryId"
                value={saveData.categoryId}
                label="카테고리"
                onChange={handleChange}
              >
                <MenuItem value="">---카테고리---</MenuItem>
                {categories.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box display="flex" flexWrap="wrap" mt={2}>
          {/* 시작 시간 */}
          <Box flex={1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="시작 시간"
                value={saveData.startedAt}
                onChange={handleStartTimeChange}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
            </LocalizationProvider>
          </Box>

          {/* 종료 시간 */}
          <Box flex={0.97} width="50%">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="종료 시간"
                value={saveData.endAt}
                onChange={handleEndTimeChange}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        {/* 주소 클릭 버튼 */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
          gap={1}
        >
          <Button
            variant="contained"
            size="medium"
            onClick={() => alert("Open Map or Address Picker")}
            sx={{
              width: "50%",
            }}
          >
            주소 입력
          </Button>

          {/* 제출 버튼 */}
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            type="submit"
            sx={{ width: "50%" }}
          >
            전송
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProductForm;
