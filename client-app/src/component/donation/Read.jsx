// src/components/DonationDetail.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Modal,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getDonation, putCancelDonation } from "../../api/donationApi.js";
import { postDonationHistory } from "../../api/donationHistoryApi.js";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import ShareQrButton from "../common/ShareQrButton.jsx";
import { fetchUserAsync } from "../../slice/AuthSlice.js";

export default function DonationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedHours, setSelectedHours] = useState(null);
  const [customHours, setCustomHours] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const imageSize = 150;

  const listPath = pathname.startsWith("/admin")
    ? `/admin/donation/list`
    : `/donation/list`;
  const modifyPath = pathname.startsWith("/admin")
    ? `/admin/donation/modify/${id}`
    : `/donation/modify/${id}`;

  const fetchDonation = async () => {
    setLoading(true);
    try {
      const res = await getDonation(id);
      setDonation(res.data);
    } catch (err) {
      console.error(err);
      alert("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonation();
  }, [id]);

  const handleDonate = async () => {
    const hours = selectedHours ?? parseInt(customHours, 10);
    if (!hours || hours <= 0) return alert("올바른 기부 시간을 선택하세요.");
    try {
      await postDonationHistory({ donationId: id, amount: hours });
      alert(`${hours}시간 기부 완료`);
      setOpenModal(false);
      setSelectedHours(null);
      setCustomHours("");
      fetchDonation();
      dispatch(fetchUserAsync());
    } catch (error) {
      console.error(error);
      alert(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await putCancelDonation(id);
      alert("삭제되었습니다.");
      navigate(listPath);
    } catch (error) {
      console.error(error);
      alert(error.response.data.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!donation) return null;

  return (
    <>
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          {/* 상단 컨트롤: 리스트로 돌아가기, 삭제, 수정 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Button size="small" onClick={() => navigate(listPath)}>
              리스트로 돌아가기
            </Button>
            <Box>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                sx={{ mr: 1 }}
              >
                삭제하기
              </Button>
              <Button variant="outlined" onClick={() => navigate(modifyPath)}>
                수정하기
              </Button>
            </Box>
          </Box>

          {/* 제목 */}
          <Typography variant="h5" gutterBottom>
            {donation.title}
          </Typography>

          {/* 작성자 · 작성일 · 조회수 */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {donation.author.username} •{" "}
            {dayjs(donation.createdAt).format("YYYY-MM-DD HH:mm")} • 조회{" "}
            {donation.viewCount}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* 이미지 갤러리 */}
          {donation.images?.length > 0 && (
            <Box
              sx={{ display: "flex", overflowX: "auto", gap: 1, mb: 2, p: 1 }}
            >
              {donation.images.map((url, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={url}
                  alt={`Donation Image ${idx}`}
                  sx={{
                    width: imageSize,
                    height: imageSize,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: 1,
                    borderColor: "grey.300",
                    flex: "0 0 auto",
                  }}
                />
              ))}
            </Box>
          )}

          <Typography variant="subtitle2">모집 목적</Typography>
          <Typography>{donation.purpose}</Typography>

          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            현황
          </Typography>
          <Typography>
            {donation.currentAmount} / {donation.targetAmount} 시간
          </Typography>

          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            설명
          </Typography>
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {donation.description}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Box>
              <Typography variant="subtitle2">시작일</Typography>
              <Typography>
                {dayjs(donation.startDate).format("YYYY-MM-DD")}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">종료일</Typography>
              <Typography>
                {dayjs(donation.endDate).format("YYYY-MM-DD")}
              </Typography>
            </Box>
          </Box>
          {donation.proofUrl ? (
            <>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                증빙
              </Typography>
              <Box
                key={donation.proofUrl}
                component="img"
                src={donation.proofUrl}
                alt={`Donation Image ${donation.proofUrl}`}
                sx={{
                  width: imageSize,
                  height: imageSize,
                  objectFit: "cover",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "grey.300",
                  flex: "0 0 auto",
                }}
              />
            </>
          ) : (
            <Box>
              <ShareQrButton />
            </Box>
          )}

          {/* 기부하기 버튼 */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => {
                if (user?.email) {
                  setOpenModal(true);
                } else {
                  setShowLoginModal(true);
                }
              }}
            >
              기부하기
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>기부하기</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {[1, 2, 3, 4, 5, 10].map((h) => (
              <Button
                key={h}
                variant={selectedHours === h ? "contained" : "outlined"}
                onClick={() => {
                  setSelectedHours(h);
                  setCustomHours("");
                }}
              >
                {h}시간
              </Button>
            ))}
          </Box>
          <TextField
            label="직접 입력"
            type="number"
            fullWidth
            value={customHours}
            onChange={(e) => {
              setCustomHours(e.target.value);
              setSelectedHours(null);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>취소</Button>
          <Button variant="contained" onClick={handleDonate}>
            기부
          </Button>
        </DialogActions>
      </Dialog>
      <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6">로그인이 필요합니다</Typography>
          <Typography variant="body2">
            기부 기능은 로그인한 사용자만 사용할 수 있어요.
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} mt={2}>
            <Button variant="outlined" onClick={() => setShowLoginModal(false)}>
              닫기
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setShowLoginModal(false);
                navigate("/login", {
                  state: { from: pathname },
                  replace: true,
                });
              }}
            >
              로그인
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
}
