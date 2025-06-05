// src/components/ProductForm.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import DaumPostcode from "react-daum-postcode";

import { getList } from "../../api/categoryApi.js";
import { getUserTags, postSave } from "../../api/productApi.js";
import uploadToCloudinary from "../../assets/uploadToCloudinary.js";
import KakaoSaveMap from "../common/KakaoSaveMap.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProductForm() {
  const [saveData, setSaveData] = useState({
    title: "",
    description: "",
    hours: 0,
    categoryId: "",
    providerType: "",
    images: [],
    lat: '',
    lng: '',
    startedAt: dayjs().add(30, "minute").format("YYYY-MM-DDTHH:mm:ss"),
    endAt: dayjs().add(2, "hour").format("YYYY-MM-DDTHH:mm:ss"),
  });
  const [categories, setCategories] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [userTags, setUserTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const defaultTags = ["신규", "잘 부탁 드립니다"];

  // 유저 태그 요청 useEffect
  useEffect(() => {
    if (!user?.id) return;
    getUserTags(user.id)
      .then((data) => {
        console.log("유저 태그 확인:", data);
        setUserTags(data);
      })
      .catch((err) => {
        console.error("사용자 태그 불러오기 실패:", err);
      });
  }, [user?.id]);

  const handleTagClick = (tag, source = "user") => {
    const isSelected = selectedTags.includes(tag);

    if (isSelected) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      const defaultSelected = selectedTags.filter((t) =>
        defaultTags.includes(t)
      );
      const userSelected = selectedTags.filter((t) => !defaultTags.includes(t));

      if (source === "default" && defaultSelected.length >= 2) {
        alert("기본 키워드는 최대 2개까지 선택할 수 있습니다.");
        return;
      }
      if (selectedTags.length >= 5) {
        alert("전체 태그는 최대 5개까지 선택할 수 있습니다.");
        return;
      }
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  // 주소 검색 모달
  const [openPostcode, setOpenPostcode] = useState(false);

  useEffect(() => {
    getList().then((res) => setCategories(res.data.content));
  }, []);

  // 주소 검색 완료 핸들러
  const handlePostcodeComplete = (data) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(data.address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const { y, x } = result[0];
        setSaveData((prev) => ({
          ...prev,
          lat: parseFloat(y),
          lng: parseFloat(x),
        }));
      } else {
        alert("주소 검색에 실패했습니다.");
      }
    });
    setOpenPostcode(false);
  };

  // 지도 클릭 시 호출되는 콜백
  const handleMapClick = ({ lat, lng }) => {
    setSaveData((prev) => ({ ...prev, lat, lng }));
  };

  // 이미지 업로드 & 미리보기
  const handleAddClick = () => fileInputRef.current.click();
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(f);
    });
    uploadImagesToCloudinary(files);
  };
  const uploadImagesToCloudinary = async (files) => {
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadToCloudinary(f)));
      setSaveData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch {
      alert("이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "hours") {
      const num = parseInt(value, 10);
      setSaveData((prev) => ({ ...prev, hours: isNaN(num) ? 0 : num }));
    } else {
      setSaveData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 날짜 시간 변경
  const handleStartTimeChange = (newVal) => {
    if (newVal.isBefore(dayjs())) return alert("현재 이후로 설정하세요");
    setSaveData((prev) => ({
      ...prev,
      startedAt: newVal.format("YYYY-MM-DDTHH:mm:ss"),
    }));
  };
  const handleEndTimeChange = (newVal) => {
    if (newVal.isBefore(dayjs(saveData.startedAt)))
      return alert("시작 이후로 설정하세요");
    setSaveData((prev) => ({
      ...prev,
      endAt: newVal.format("YYYY-MM-DDTHH:mm:ss"),
    }));
  };

  // 미리보기 클릭 시 해당 이미지 제거
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postSave({
        ...saveData,
        tags: selectedTags, // 태그 추가
      });
      navigate("/product/read/" + response.data.id);
      alert("저장 성공!");
    } catch {
      alert("저장 실패");
    }
  };

  const handlePreviewClick = (idx) => {
    if (!window.confirm("이 사진을 삭제하시겠습니까?")) return;
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setSaveData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <form onSubmit={handleSubmit}>
        {/* 이미지 업로드 */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <input
            type="file"
            hidden
            multiple
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <Button
            variant="outlined"
            onClick={handleAddClick}
            sx={{ width: 150, height: 150 }}
          >
            <AddPhotoAlternateIcon />
          </Button>
          {previews.map((src, i) => (
            <Box
              key={i}
              component="img"
              src={src}
              sx={{
                width: 150,
                height: 150,
                objectFit: "cover",
                borderRadius: 1,
                cursor: "pointer",
              }}
              onClick={() => handlePreviewClick(i)}
            />
          ))}
        </Box>

        {/* 타입·카테고리 */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>타입</InputLabel>
            <Select
              name="providerType"
              value={saveData.providerType}
              label="타입"
              onChange={handleChange}
            >
              <MenuItem value="BUYER">BUYER</MenuItem>
              <MenuItem value="SELLER">SELLER</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>카테고리</InputLabel>
            <Select
              name="categoryId"
              value={saveData.categoryId}
              label="카테고리"
              onChange={handleChange}
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* 제목·설명 */}
        <TextField
          label="제목"
          name="title"
          fullWidth
          margin="normal"
          value={saveData.title}
          onChange={handleChange}
        />
        <TextField
          label="설명"
          name="description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={saveData.description}
          onChange={handleChange}
        />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          좋은 리뷰를 많이 받으신 분들의 추천 태그(기본 키워드 포함 최대 5개
          선택 가능)
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {userTags.map((tag, index) => {
            const isSelected = selectedTags.includes(tag.tag);
            return (
              <Button
                key={index}
                variant={isSelected ? "contained" : "outlined"}
                onClick={() => {
                  if (isSelected) {
                    setSelectedTags((prev) =>
                      prev.filter((t) => t !== tag.tag)
                    );
                  } else if (selectedTags.length < 5) {
                    setSelectedTags((prev) => [...prev, tag.tag]);
                  } else {
                    alert("최대 5개까지만 선택 가능합니다.");
                  }
                }}
                size="small"
              >
                {tag.tag}
              </Button>
            );
          })}
        </Box>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          아직 키워드가 없으신가요? 기본 키워드 중 0~2 개를 선택하세요.
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {defaultTags.map((tag, index) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Button
                key={`default-${index}`}
                variant={isSelected ? "contained" : "outlined"}
                onClick={() => handleTagClick(tag, "default")}
                size="small"
              >
                {tag}
              </Button>
            );
          })}
        </Box>
        {/* 시간픽커 */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: "flex", gap: 1, my: 2 }}>
            <DateTimePicker
              sx={{ flex: 1 }}
              label="시작 시간"
              value={dayjs(saveData.startedAt)}
              onChange={handleStartTimeChange}
              renderInput={(props) => <TextField {...props} fullWidth />}
            />
            <DateTimePicker
              sx={{ flex: 1 }}
              label="종료 시간"
              value={dayjs(saveData.endAt)}
              onChange={handleEndTimeChange}
              renderInput={(props) => <TextField {...props} fullWidth />}
            />
          </Box>
        </LocalizationProvider>

        {/* 상품 시간 */}
        <TextField
          label="상품 시간(분)"
          name="hours"
          type="number"
          fullWidth
          margin="normal"
          value={saveData.hours}
          onChange={handleChange}
        />

        {/* 주소 직접검색 버튼 */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <Button variant="outlined" onClick={() => setOpenPostcode(true)}>
            주소 직접검색
          </Button>
        </Box>

        {/* 주소검색 다이얼로그 */}
        <Dialog
          open={openPostcode}
          onClose={() => setOpenPostcode(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>주소 검색</DialogTitle>
          <DialogContent sx={{ height: 400, p: 0 }}>
            <DaumPostcode
              onComplete={handlePostcodeComplete}
              style={{ height: "100%" }}
            />
          </DialogContent>
        </Dialog>

        {/* 지도 클릭 or 드래그로 좌표 선택 */}
        <Box sx={{ height: 400, mb: 2 }}>
          <KakaoSaveMap
            saveData={saveData}
            setSaveData={setSaveData}
            onMapClick={handleMapClick}
          />
          {(saveData.lat && saveData.lng) && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                선택된 좌표: {saveData.lat.toFixed(6)}, {saveData.lng.toFixed(6)}
              </Typography>
          )}
        </Box>

        {/* 저장 버튼 */}
        <Box sx={{ textAlign: "right" }}>
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            등록
          </Button>
        </Box>
      </form>
    </Box>
  );
}
