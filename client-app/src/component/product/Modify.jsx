// src/components/ModifyProduct.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRead, getUserTags, putUpdate } from "../../api/productApi.js";
import { getList as getCategoryList } from "../../api/categoryApi.js";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import DaumPostcode from "react-daum-postcode";
import KakaoSaveMap from "../common/KakaoSaveMap.jsx";

const IMAGE_SIZE = 150;

export default function ModifyProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const auth = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hours: 0,
    providerType: "",
    categoryId: "",
    startedAt: dayjs().add(30, "minute"),
    endAt: dayjs().add(2, "hour"),
    images: [],
    lat: 0,
    lng: 0,
  });
  const [categories, setCategories] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const defaultTags = ["신규", "잘 부탁 드립니다"];

  const fileInputRef = useRef();
  const [openPostcode, setOpenPostcode] = useState(false);

  useEffect(() => {
    async function fetch() {
      const { data } = await getRead(id);
      if (auth.user?.id !== data.owner.id) {
        alert("본인이 등록한 상품만 수정할 수 있습니다.");
        return navigate(-1);
      }
      setFormData({
        title: data.title,
        description: data.description,
        hours: data.hours,
        providerType: data.providerType,
        categoryId: data.category.id,
        startedAt: dayjs(data.startedAt),
        endAt: dayjs(data.endAt),
        images: data.images || [],
        lat: data.lat,
        lng: data.lng,
      });
      setPreviews(data.images || []);
      setSelectedTags(data.tags || []);
    }
    fetch();
    getCategoryList().then((res) => setCategories(res.data.content));
    getUserTags(auth.user?.id).then(setUserTags);
  }, [id]);

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

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    if (name === "hours") {
      const n = parseInt(value, 10);
      setFormData((p) => ({ ...p, hours: isNaN(n) ? 0 : n }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleDateChange = (field) => (newVal) => {
    if (field === "startedAt" && newVal.isAfter(formData.endAt)) {
      return alert("시작 시간은 종료 시간 이전이어야 합니다.");
    }
    if (field === "endAt" && newVal.isBefore(formData.startedAt)) {
      return alert("종료 시간은 시작 시간 이후이어야 합니다.");
    }
    setFormData((p) => ({ ...p, [field]: newVal }));
  };

  const handleAddClick = () => fileInputRef.current.click();
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviews((p) => [...p, reader.result]);
    reader.readAsDataURL(file);
    setNewFiles((p) => [...p, file]);
    e.target.value = null;
  };

  const handleRemoveImage = (idx) => {
    if (!window.confirm("이 사진을 삭제하시겠습니까?")) return;
    const existingCount = formData.images.length;
    if (idx < existingCount) {
      setFormData((p) => ({
        ...p,
        images: p.images.filter((_, i) => i !== idx),
      }));
    } else {
      setNewFiles((p) => p.filter((_, i) => i !== idx - existingCount));
    }
    setPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handlePostcodeComplete = (data) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(data.address, (res, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const { y, x } = res[0];
        setFormData((p) => ({
          ...p,
          lat: parseFloat(y),
          lng: parseFloat(x),
        }));
      } else {
        alert("주소 검색에 실패했습니다.");
      }
    });
    setOpenPostcode(false);
  };

  const handleMapClick = ({ lat, lng, address }) => {
    setFormData((p) => ({ ...p, lat, lng, address }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadPromises = newFiles.map((file) => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        return axios
          .post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
            fd
          )
          .then((r) => r.data.secure_url);
      });
      const newUrls = await Promise.all(uploadPromises);
      const finalImages = [...formData.images, ...newUrls];

      const payload = {
        ...formData,
        startedAt: formData.startedAt.format("YYYY-MM-DDTHH:mm:ss"),
        endAt: formData.endAt.format("YYYY-MM-DDTHH:mm:ss"),
        images: finalImages,
        tags: selectedTags,
      };
      await putUpdate(id, payload);
      alert("수정 완료!");
      navigate(`/product/read/${id}`);
    } catch (err) {
      console.error(err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <input
              type="file"
              hidden
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
          />
          <Button
              variant="outlined"
              onClick={handleAddClick}
              sx={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderRadius: 2,
                border: "1px dashed rgba(0,0,0,0.3)",
              }}
          >
            <AddPhotoAlternateIcon />
          </Button>
          {previews.map((src, idx) => (
              <Box
                  key={idx}
                  sx={{
                    width: IMAGE_SIZE,
                    height: IMAGE_SIZE,
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onClick={() => handleRemoveImage(idx)}
              >
                <img
                    src={src}
                    alt={`img-${idx}`}
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

        {/* 타입 & 카테고리 */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>타입</InputLabel>
            <Select
              name="providerType"
              value={formData.providerType}
              onChange={handleFieldChange}
            >
              <MenuItem value="BUYER">구매</MenuItem>
              <MenuItem value="SELLER">판매</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>카테고리</InputLabel>
            <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleFieldChange}
            >
              {Array.isArray(categories) &&
                categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.categoryName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          label="제목"
          name="title"
          margin="normal"
          value={formData.title}
          onChange={handleFieldChange}
        />
        <TextField
          fullWidth
          label="내용"
          name="description"
          margin="normal"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleFieldChange}
        />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          좋은 리뷰를 많이 받으신 분들의 추천 태그(기본 키워드 포함 최대 5개
          선택 가능)
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {userTags.map((tagObj, idx) => {
            const isSelected = selectedTags.includes(tagObj.tag);
            return (
              <Button
                key={idx}
                variant={isSelected ? "contained" : "outlined"}
                size="small"
                onClick={() => handleTagClick(tagObj.tag, "user")}
              >
                #{tagObj.tag}
              </Button>
            );
          })}
        </Box>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          아직 키워드가 없으신가요? 기본 키워드 중 0~2 개를 선택하세요.
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <DateTimePicker
              label="시작 시간"
              value={formData.startedAt}
              onChange={handleDateChange("startedAt")}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <DateTimePicker
              label="종료 시간"
              value={formData.endAt}
              onChange={handleDateChange("endAt")}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
        </LocalizationProvider>

        <TextField
          fullWidth
          label="상품 시간(분)"
          name="hours"
          type="number"
          margin="normal"
          value={formData.hours}
          onChange={handleFieldChange}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <Button variant="outlined" onClick={() => setOpenPostcode(true)}>
            주소 직접검색
          </Button>
        </Box>
        <Dialog
          open={openPostcode}
          onClose={() => setOpenPostcode(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>주소 검색</DialogTitle>
          <DialogContent sx={{ p: 0, height: 400 }}>
            <DaumPostcode
              onComplete={handlePostcodeComplete}
              style={{ width: "100%", height: "100%" }}
            />
          </DialogContent>
        </Dialog>

        <Box sx={{ mb: 2 }}>
          <KakaoSaveMap
            saveData={formData}
            setSaveData={setFormData}
            onMapClick={handleMapClick}
          />
          <Typography variant="caption" color="text.secondary">
            선택된 좌표: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            수정하기
          </Button>
        </Box>
      </form>
    </Box>
  );
}
