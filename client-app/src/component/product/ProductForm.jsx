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

      if (images.length > 0) {
        // Cloudinary에 업로드
        const uploadPromises = images.map((file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
          return axios
            .post(
              `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
              formData
            )
            .then((res) => res.data.secure_url);
        });

        imageUrls = await Promise.all(uploadPromises);
        console.log("업로드된 Cloudinary URL:", imageUrls);
      }

      // 여기에 이후 저장 또는 전송 로직이 들어가야 할 수도 있음
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      alert("이미지 업로드 중 문제가 발생했습니다.");
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
      />
      {/* 이미지 업로드 */}
      <Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
          {previews.map((src, idx) => (
            <Box key={idx} position="relative">
              <img
                src={src}
                alt={`preview-${idx}`}
                width={100}
                height={100}
                style={{ objectFit: "cover", borderRadius: 4 }}
              />
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleRemoveImage(idx)}
                sx={{ mt: 1 }}
                fullWidth
              >
                삭제
              </Button>
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
