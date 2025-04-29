import React, { useState, useEffect } from "react";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { getList } from "../../api/categoryApi";
import { postSave } from "../../api/productApi";

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
      // API 호출 (백엔드에 데이터 저장)
      const response = await postSave(saveData);
      console.log(response);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const imageUrls = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...imageUrls]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleStartTimeChange = (newValue) => {
    setSaveData((preState) => ({
      ...prevState,
      startedAt: newValue,
    }));
  };

  const handleEndTimeChange = (newValue) => {
    if (saveData.startedAt && newValue.isBefore(saveData.startedAt)) {
      alert("종료시간은 시작 시간 후에 설정해 주시길 바랍니다.");
      return;
    }

    setSaveData((prevState) => ({
      ...prevState,
      endAt: newValue,
    }));
  };

  return (
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
      />
      {/* 시간(비용) 입력 */}
      <TextField
        label="상품 시간"
        name="hours"
        type="number"
        value={saveData.hours}
        onChange={handleChange}
        fullWidth
        margin="normal"
        inputProps={{ min: 0 }}
      />
      {/* 이미지 업로드 */}
      <Box>
        {/* 이미지 업로드 필드 */}
        <TextField
          type="file"
          inputProps={{ multiple: true }}
          onChange={handleImageChange}
          fullWidth
          margin="normal"
        />

        {/* 미리보기 및 삭제 버튼 */}
        <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
          {images.map((img, index) => (
            <Box key={index} position="relative">
              <img
                src={img.preview}
                alt={`uploaded-${index}`}
                width={100}
                height={100}
                style={{ objectFit: "cover", borderRadius: 4 }}
              />
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleRemoveImage(index)}
                sx={{ mt: 1 }}
                fullWidth
              >
                삭제
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
      {/* 카테고리 드롭다운 */}
      <FormControl fullWidth margin="normal">
        <InputLabel>카테고리를 선택하세요.</InputLabel>
        <Select
          name="categoryId"
          value={saveData.categoryId}
          onChange={handleChange}
          label="Category"
        >
          <MenuItem value="">
            <em>카테고리를 선택하세요.</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* 시작 시간 */}
      <Box display="flex" flexDirection="column" gap={2}>
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

        {/* 종료 시간 */}
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

        {/* 주소 클릭 버튼 */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
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
      </Box>
    </form>
  );
};

export default ProductForm;
