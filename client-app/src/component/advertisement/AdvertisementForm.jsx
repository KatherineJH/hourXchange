import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import uploadToCloudinary from "../../assets/uploadToCloudinary.js";
import {
  postAdvertisement,
  getAdvertisement,
  updateAdvertisement,
  getAdvertisementDetail,
} from "../../api/advertisementApi";

export default function AdvertisementForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [adData, setAdData] = useState({
    title: "",
    description: "",
    hours: "",
    images: [],
  });

  const [errors, setErrors] = useState({
    title: false,
    description: false,
  });

  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (isEdit) {
      console.log("Edit mode detected, fetching ad detail for ID:", id);
      getAdvertisementDetail(id)
        .then((data) => {
          console.log("API response data:", data);
          console.log("Images from API:", data.images);
          setAdData({
            title: data.title,
            description: data.description,
            hours: data.hours.toString(),
            images: data.images || [],
          });

          setPreviews(data.images || []);
          console.log("Previews after setting:", data.images || []);
        })
        .catch((err) => {
          console.error("Failed to fetch advertisement detail:", err);
        });
    }
  }, [id, isEdit]);

  // 폼 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 30자 초과 입력 방지
    if (name === "description" && value.length > 30) {
      setErrors((prev) => ({ ...prev, [name]: true }));
      return;
    }

    // 에러 리셋
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }

    setAdData((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 추가 버튼 클릭
  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  // 파일 선택 시 미리보기 및 업로드
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(f);
    });
    uploadImagesToCloudinary(files);
  };

  //이미지 업로드
  const uploadImagesToCloudinary = async (files) => {
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadToCloudinary(f)));
      setAdData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch {
      alert("이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  // 미리보기 클릭 시 삭제
  const handlePreviewClick = (idx) => {
    if (!window.confirm("이 사진을 삭제하시겠습니까?")) return;
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setAdData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: adData.title,
        description: adData.description,
        hours: Number(adData.hours),
        images: adData.images,
      };
      setPreviews(adData.images || []);
      if (isEdit) {
        await updateAdvertisement(id, payload);
        alert("광고 수정이 완료되었습니다!");
      } else {
        await postAdvertisement(payload);
        alert("새 광고가 성공적으로 등록되었습니다!");
      }
      navigate("/myPage/advertisement/list");
    } catch (err) {
      // 403 Forbidden: 작성자만 수정 가능
      if (err.response?.status === 403) {
        const msg = err.response.data?.message || "작성자만 수정가능합니다.";
        alert(msg);
        return;
      }

      console.error("광고 저장/수정 실패:", err);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: "auto", p: 2 }}
    >
      <Box>
        <h1 style={{ marginBottom: "24px" }}>🙋‍♀️광고 등록</h1>
      </Box>
      {/* 이미지 업로드 버튼 + 미리보기 */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <input
          type="file"
          hidden
          multiple
          ref={fileInputRef}
          onChange={handleImageChange}
          disabled={uploading}
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

      {/* 제목 입력 */}
      <TextField
        label="광고 제목"
        name="title"
        value={adData.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      {/* 설명 입력 */}
      <TextField
        label="광고 설명"
        name="description"
        value={adData.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        margin="normal"
        required
        inputProps={{ maxLength: 30 }}
        helperText={`${adData.description.length}/30`}
        FormHelperTextProps={{
          sx: { color: "#f07b5a" },
        }}
      />

      {/* 시간(분) 입력 */}
      <TextField
        label="시간(분)"
        name="hours"
        type="number"
        value={adData.hours}
        onChange={handleChange}
        fullWidth
        margin="normal"
        inputProps={{
          min: 0, // 하한
          max: 0.9999, // 상한 (1 미만)
          step: 0.01, // 0.01 단위로 올림/내림
        }}
        helperText="1 미만의 소수만 입력 가능합니다."
        FormHelperTextProps={{
          sx: { color: "#f07b5a" },
        }}
      />

      {/* 등록 버튼 */}
      <Box sx={{ textAlign: "right", mt: 2 }}>
        <Button type="submit" variant="contained" endIcon={<SendIcon />}>
          등록
        </Button>
      </Box>
    </Box>
  );
}
