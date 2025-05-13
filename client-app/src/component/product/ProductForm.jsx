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
import GoogleSaveMap from "../common/GoogleSaveMap.jsx";
import KakaoSaveMap from "../common/KakaoSaveMap.jsx";
import {useNavigate} from "react-router-dom";

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
    startedAt: dayjs("2025-05-01T10:00:00"),
    endAt: dayjs("2025-05-01T10:00:00"),
    address: {
      zonecode: '',
      roadAddress: '',
      jibunAddress: '',
      detailAddress: ''
    }
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getList(); // 카테고리 목록을 가져옴
      setCategories(response.data); // 카테고리 목록을 상태에 저장
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prevPreviews) => [...prevPreviews, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    // 실제 이미지 업로드는 다른 함수에서 처리하도록 분리합니다.
    uploadImagesToCloudinary(files);
  };

  const uploadImagesToCloudinary = async (imageFiles) => {
    setUploading(true);
    try {
      // 이미 업로드된 이미지를 필터링하여 중복 업로드 방지
      const newFiles = imageFiles.filter((file) => !images.includes(file.name)); // `file.name`으로 중복 체크

      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map((file) => uploadToCloudinary(file));
        const urls = await Promise.all(uploadPromises);

        setImages((prev) => [...prev, ...urls]);

        // saveData에도 반영
        setSaveData((prev) => ({
          ...prev,
          images: [...prev.images, ...urls],
        }));
      }
    } catch (error) {
      console.error("이미지 업로드 실패", error);
      console.log(saveData);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (index) => {
    if (window.confirm("사진을 지우시겠습니까?")) {
      setImages((prev) => prev.filter((_, idx) => idx !== index));
      setPreviews((prev) => prev.filter((_, idx) => idx !== index));
      setSaveData((prev) => ({
        ...prev,
        images: prev.images.filter((_, idx) => idx !== index),
      }));
    }
  };

  //시작시간
  // const handleStartTimeChange = (newValue) => {
  //   if (newValue && newValue.isAfter(saveData.endAt)) {
  //     return;
  //   }

  //   setSaveData((prevState) => ({
  //     ...prevState,
  //     startedAt: newValue, // 상태 업데이트
  //   }));
  // };
  const handleStartTimeChange = (newValue) => {
    if (newValue && newValue.isAfter(dayjs(saveData.endAt))) {
      alert("시작 시간은 종료 시간 이후로 설정할 수 없습니다.");
      return;
    }

    setSaveData((prevState) => ({
      ...prevState,
      startedAt: newValue,
    }));
  };

  // const handleEndTimeChange = (newValue) => {
  //   if (newValue && newValue.isBefore(saveData.startedAt)) {
  //     alert("종료시간은 시작 시간 이후로 설정해야 합니다.");
  //     return;
  //   }

  //   setSaveData((prevState) => ({
  //     ...prevState,
  //     endAt: newValue, // 상태 업데이트
  //   }));
  // };

  const handleEndTimeChange = (newValue) => {
    if (newValue && newValue.isBefore(dayjs(saveData.startedAt))) {
      alert("종료 시간은 시작 시간 이후로 설정해야 합니다.");
      return;
    }

    setSaveData((prevState) => ({
      ...prevState,
      endAt: newValue,
    }));
  };

  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "hours") {
      const newValue = parseInt(value, 10);
      if (isNaN(newValue) || newValue < 0) {
        setSaveData((prevData) => ({
          ...prevData,
          hours: 0,
        }));
        return;
      }
    }
    setSaveData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleComplete = (data) => {
    const fullAddress = data.address;
    setSaveData((prevData) => ({
      ...prevData,
      address: fullAddress,
    }));
    setIsOpen(false); // 선택 후 팝업 닫기
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(saveData)
      const response = await postSave(saveData);
      console.log(response.data)
      alert("상품이 성공적으로 저장되었습니다.");
      navigate("/product/read/" + response.data.id)
    } catch (error) {
      console.error("서버 전송 오류", error || error.message);
      alert("저장 중 문제가 발생하였습니다.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          maxWidth={600}
        >
          {/* 타입 드롭다운 */}
          <Box flex={1} mr={2}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontSize={13}
            ></Typography>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel id="providerType-label">타입</InputLabel>
              <Select
                labelId="providerType-label"
                id="providerType"
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
          </Box>

          {/* 카테고리 드롭다운 */}
          <Box flex={1}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontSize={13}
            ></Typography>
            <FormControl fullWidth margin="normal" size="small">
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
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {/* 업로드 버튼 (왼쪽 고정) */}
            <Box>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <Button
                variant="outlined"
                onClick={handleAddClick}
                sx={{
                  width: "150px",
                  height: "150px",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #ddd",
                }}
              >
                <AddPhotoAlternateIcon />
              </Button>
            </Box>

            {/* 미리보기 이미지들 (오른쪽 나열) */}
            {previews.map((src, idx) => (
              <Box
                key={idx}
                position="relative"
                onClick={() => handleDeleteImage(idx)}
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                  cursor: "pointer",
                }}
              >
                <img
                  src={src}
                  alt={`preview-${idx}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* 날짜 선택 */}
        <Box display="flex" flexWrap="wrap" mt={2}>
          <Box flex={1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="시작 시간"
                value={saveData.startedAt}
                onChange={(newValue) =>
                  setSaveData((prev) => ({ ...prev, startedAt: newValue }))
                }
              />
            </LocalizationProvider>
          </Box>

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

        <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
          {/* 상품 시간 입력 */}
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
        </Box>

        <Box>
          {/* 지도만 표시 */}
          <Box mt={2}>
            {/* 구글 맵 컴포넌트 표시 */}
            {/*<GoogleSaveMap saveData={saveData} setSaveData={setSaveData} />*/}
            <KakaoSaveMap saveData={saveData} setSaveData={setSaveData} />
          </Box>
        </Box>
        {/* 전송 버튼 */}
        <Box mt={3}>
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
