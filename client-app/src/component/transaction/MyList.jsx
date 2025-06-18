// MyPage에서 거래 내역을 보여주는 컴포넌트
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getMyTransactionList,
  postReview,
  updateReview,
  getReviewById,
  patchCompleteTransaction,
} from "../../api/transactionApi.js";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Rating,
  TextField,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function MyList() {
  const [serverDataList, setServerDataList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(null);

  const auth = useSelector((state) => state.auth);
  const handleMarkAsCompleted = async (transactionId) => {
    try {
      await patchCompleteTransaction(transactionId);
      alert("거래가 완료되었습니다.");

      const refreshed = await getMyTransactionList();
      setServerDataList(refreshed.data);
    } catch (error) {
      console.error("거래 완료 실패:", error);
      alert("거래 완료에 실패했습니다.");
    }
  };

  // 상대방 이름 구하기
  const getOpponentName = (item) => {
    const myId = auth.user?.id;
    return item.user.id === myId ? item.product.owner.name : item.user.name;
  };

  // 내가 돈 받는 사람인지 확인하는 함수
  const isReceiver = (item) => {
    const myId = auth.user?.id;
    const providerType = item.product.providerType;
    const isOwner = myId === item.product.owner.id;

    if (providerType === "SELLER") {
      return isOwner; // 판매자는 돈 받는 사람
    } else {
      return !isOwner; // 구매글이면 요청자(user)가 돈 받음
    }
  };

  const handleOpenModal = async (transaction) => {
    setSelectedTransaction(transaction);
    setOpenModal(true);

    if (transaction.reviewId) {
      try {
        const review = await getReviewById(transaction.reviewId);
        console.log("리뷰 조회 성공:", review);
        setReviewText(review.content);
        setReviewStars(review.stars);
      } catch (err) {
        console.error("리뷰 조회 실패:", err);
      }
    } else {
      setReviewText("");
      setReviewStars(0);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setReviewText("");
    setSelectedTransaction(null);
  };

  const handleSubmitReview = async () => {
    if (reviewStars == null) {
      alert("별점을 선택해주세요.");
      return;
    }
    const reviewRequest = {
      text: reviewText,
      productId: selectedTransaction.product.id,
      transactionId: selectedTransaction.id,
      stars: reviewStars,
    };

    try {
      if (selectedTransaction.reviewId) {
        const response = await updateReview(
          selectedTransaction.reviewId,
          reviewRequest
        );
        console.log("리뷰 수정 성공:", response);
        alert("리뷰가 수정되었습니다.");
      } else {
        const response = await postReview(reviewRequest);
        console.log("리뷰 등록 성공:", response);
        alert("리뷰가 저장되었습니다.");
        // 선택된 트랜잭션에 reviewId 업데이트 (리뷰 다시 열 때 편하게 하려고)
        setSelectedTransaction({
          ...selectedTransaction,
          reviewId: response.reviewId,
        });
      }
    } catch (err) {
      console.error("리뷰 저장 실패:", err);
      alert("리뷰 저장에 실패했습니다.");
    }
    handleCloseModal();
  };

  useEffect(() => {
    getMyTransactionList()
      .then((response) => {
        console.log("내 트랜잭션 데이터:", response.data);
        setServerDataList(response.data);
      })
      .catch((error) => {
        console.error("트랜잭션 목록 불러오기 실패:", error);
      });
  }, []);

  return (
    <Box sx={{ maxWidth: 1220, mx: "auto", p: 2 }}>
      <Box>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🙋 나의 거래 내역
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table stickyHeader aria-label="transaction table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>Id</TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>
                    제품명
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>
                    상대방 이름
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>상태</TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>
                    생성일자
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>
                    완료 👉 리뷰
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serverDataList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.product.title}</TableCell>
                    <TableCell>{item.user?.name || "상대방 없음"}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell>
                      {item.status === "ACCEPTED" && !isReceiver(item) && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleMarkAsCompleted(item.id)}
                        >
                          <Typography>거래 완료</Typography>
                        </Button>
                      )}
                      {item.status === "COMPLETED" && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenModal(item)}
                        >
                          <Typography>
                            {item.reviewId ? "리뷰 수정" : "리뷰 작성"}
                          </Typography>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Box>

      {/* 모달 영역 */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            리뷰 작성 (ID: {selectedTransaction?.id})
          </Typography>
          <Rating
            name="user-rating"
            value={reviewStars}
            onChange={(event, newValue) => {
              setReviewStars(newValue);
            }}
            size="large"
            sx={{ mb: 2 }}
          />

          <TextField
            label="리뷰 내용"
            fullWidth
            multiline
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseModal}
            >
              닫기
            </Button>
            <Button variant="contained" onClick={handleSubmitReview}>
              저장
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default MyList;
