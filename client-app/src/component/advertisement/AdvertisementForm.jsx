import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import uploadToCloudinary from "../../assets/uploadToCloudinary.js";
import {
  postAdvertisement,
  getAdvertisementDetail,
  updateAdvertisement,
} from "../../api/advertisementApi.js";

export default function AdvertisementForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  // --- 1) 폼 데이터 상태 관리 ---
  const [adData, setAdData] = useState({
    title: "",
    description: "",
    hours: "",
    images: [],
  });

  // --- 2) 입력 에러 상태 관리 ---
  const [errors, setErrors] = useState({
    title: false,
    description: false,
  });

  // --- 3) 이미지 미리보기용 Data URL 배열 ---
  const [previews, setPreviews] = useState([]);

  // --- 4) 이미지 업로드 중 상태 ---
  const [uploading, setUploading] = useState(false);

  // --- 5) 숨겨진 파일 input 참조 ---
  const fileInputRef = useRef();

  useEffect(() => {
    if (!isEdit) return;

    getAdvertisementDetail(id)
      .then((data) => {
        // API가 response.data.data인지 response.data인지 확인
        const fetched = data;
        setAdData({
          title: fetched.title || "",
          description: fetched.description || "",
          hours: fetched.hours !== undefined ? fetched.hours.toString() : "",
          images: Array.isArray(fetched.images) ? fetched.images : [],
        });
        setPreviews(Array.isArray(fetched.images) ? fetched.images : []);
      })
      .catch((err) => {
        console.error("광고 상세 조회 실패:", err.response || err);
        alert("광고 정보를 불러오는 중 오류가 발생했습니다.");
      });
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // description 30자 초과 방지
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

  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // 1) Data URL 기반 미리보기
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(f);
    });

    // 2) Cloudinary 업로드
    uploadImagesToCloudinary(files);
  };

  const uploadImagesToCloudinary = async (files) => {
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadToCloudinary(f)));
      setAdData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (err) {
      console.error("Cloudinary 업로드 실패:", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handlePreviewClick = (idx) => {
    if (!window.confirm("이 사진을 삭제하시겠습니까?")) return;
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setAdData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) 필수 입력값 유효성 검사
    if (!adData.title.trim() || !adData.description.trim()) {
      setErrors({
        title: !adData.title.trim(),
        description: !adData.description.trim(),
      });
      alert("제목과 설명은 필수 입력 항목입니다.");
      return;
    }

    // 2) hours 숫자 변환 후 0 < hours < 1 검사
    const hoursNum = Number(adData.hours);
    if (isNaN(hoursNum) || hoursNum <= 0 || hoursNum >= 1) {
      alert(
        "유효한 시간(분) 값을 입력하세요. 0보다 크고 1 미만의 소수여야 합니다."
      );
      return;
    }

    try {
      // 4) 최종 전송 payload 구성
      const payload = {
        title: adData.title.trim(),
        description: adData.description.trim(),
        hours: hoursNum,
        images: adData.images,
      };

      console.log("▶ 전송 payload:", payload);

      if (isEdit) {
        // 수정 모드
        const res = await updateAdvertisement(id, payload);
        console.log("광고 수정 API 응답:", res);
        alert("광고 수정이 완료되었습니다!");
      } else {
        // 등록 모드
        const res = await postAdvertisement(payload);
        console.log("광고 등록 API 응답:", res);
        alert("새 광고가 성공적으로 등록되었습니다!");
      }

      // 5) 완료 후 목록 페이지로 이동
      navigate("/myPage/advertisement/list");
    } catch (err) {
      // 6) 에러 상세 로그
      console.error("AxiosError message:", err.message);
      if (err.response) {
        console.error("응답 상태 코드(status):", err.response.status);
        console.error("응답 데이터(response.data):", err.response.data);
        alert(
          `서버 오류: ${
            err.response.data?.message || "광고 저장에 실패했습니다."
          }`
        );
      } else if (err.request) {
        console.error(
          "요청은 전송되었으나, 응답이 없습니다(err.request):",
          err.request
        );
        alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      } else {
        console.error("Axios 설정 혹은 기타 오류:", err);
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: "auto", p: 2 }}
    >
      <Box>
        <h1 style={{ marginBottom: "24px" }}>
          {isEdit ? "✏️ 광고 수정" : "🙋‍♀️ 신규 광고 등록"}
        </h1>
      </Box>

      {/* ── 이미지 업로드 버튼 + 미리보기 ── */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
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
          disabled={uploading}
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

      {/* ── 제목 입력 ── */}
      <TextField
        label="광고 제목"
        name="title"
        value={adData.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={errors.title}
        helperText={errors.title && "제목을 입력해주세요."}
      />

      {/* ── 설명 입력 ── */}
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
        FormHelperTextProps={{ sx: { color: "#f07b5a" } }}
        error={errors.description}
      />

      {/* ── 시간(분) 입력 ── */}
      <TextField
        label="시간(분)"
        name="hours"
        type="number"
        value={adData.hours}
        onChange={handleChange}
        fullWidth
        margin="normal"
        inputProps={{
          min: 0.01,
          max: 0.9999,
          step: 0.01,
        }}
        helperText="0보다 크고 1 미만의 소수값만 입력 가능합니다."
        FormHelperTextProps={{ sx: { color: "#f07b5a" } }}
      />

      {/* ── 등록/수정 버튼 ── */}
      <Box sx={{ textAlign: "right", mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={uploading}
        >
          {isEdit ? "수정 완료" : "등록 완료"}
        </Button>
      </Box>
    </Box>
  );
}
