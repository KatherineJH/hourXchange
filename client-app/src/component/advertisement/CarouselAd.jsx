import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function CarouselAd() {
  const navigate = useNavigate();

  const images = [
    {
      id: 1,
      src: "/donations.png",
      alt: "광고1",
      linkTo: "/product/donation",
    },
    {
      id: 2,
      src: "/volunteer.png",
      alt: "광고2",
      linkTo: "/product/volunteer",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const getCarouselStyle = () => {
    return {
      display: "flex",
      transition: "transform 0.5s ease-in-out",
      transform: `translateX(-${currentIndex * 100}%)`, // 고정된 너비에 맞춰 수정
      width: `${images.length * 100}%`, // 고정된 비율로 처리
    };
  };

  const handleImageClick = (linkTo) => {
    if (linkTo) {
      navigate(linkTo);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.paper",
      }}
    >
      {/* 이미지들을 담는 내부 컨테이너 */}
      <Box sx={getCarouselStyle()}>
        {images.map((image, index) => (
          <Box
            key={image.id}
            sx={{
              width: "100%",
              flexShrink: 0,
              position: "relative", // 버튼 포지션 기준
            }}
          >
            <Box
              component="img"
              src={image.src}
              alt={image.alt}
              sx={{
                flexShrink: 0,
                width: `${200 / images.length}%`, //기존 사용자 설정 유지
                height: "100%",
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
            {/* 버튼을 각 이미지마다 조건부 렌더링 */}
            <Box
              sx={{
                position: "absolute",
                bottom: 12,
                left: 0,
                pl: 2,
                zIndex: 2,
              }}
            >
              {index === 0 && (
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    bgcolor: "",
                    whiteSpace: "normal",
                    // "&:hover": { bgcolor: "" },
                  }}
                  onClick={() => navigate("/product/donation")}
                >
                  기부하러 가기 →
                </Button>
              )}
              {index === 1 && (
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    bgcolor: "",
                    whiteSpace: "normal",
                    // "&:hover": { bgcolor: "" },
                  }}
                  onClick={() => navigate("/product/volunteer")}
                >
                  봉사하러 가기 →
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {/* 좌우 네비게이션 버튼 */}
      <IconButton
        onClick={goToPrev}
        sx={{
          position: "absolute",
          left: 5,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
          color: "text.primary",
          p: 0.5,
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: "1.5rem" }} />
      </IconButton>
      <IconButton
        onClick={goToNext}
        sx={{
          position: "absolute",
          right: 5,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
          color: "text.primary",
          p: 0.5,
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: "1.5rem" }} />
      </IconButton>

      {/* 인디케이터 */}
      <Box
        sx={{
          position: "absolute",
          bottom: 5,
          width: "100%",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor:
                index === currentIndex
                  ? "primary.main"
                  : "rgba(255, 255, 255, 0.7)",
              margin: "0 4px",
              cursor: "pointer",
              border: "1px solid rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
