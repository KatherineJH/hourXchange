import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { ReactComponent as CloseBtn } from "src/assets/plus.svg";
// import { ReactComponent as Arrow } from "src/assets/back.svg";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
export default function CarouselAd() {
  const navigate = useNavigate();
  //   const location = useLocation();

  const images = [
    {
      id: 1,
      src: "/donationAd.png",
      alt: "광고1",
      linkTo: "/product/donation",
    },
    {
      id: 2,
      src: "/donationAd1.png",
      alt: "광고2",
      linkTo: "/product/donation",
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
      transform: `translateX(-${(currentIndex * 200) / images.length}%)`,
      width: `${images.length * 200}%`,
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
        position: "relative", // 자식 요소 (버튼, 점) 위치 지정을 위해 필수
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
        {images.map((image) => (
          <Box
            key={image.id}
            component="img"
            src={image.src}
            alt={image.alt}
            onClick={() => handleImageClick(image.linkTo)}
            sx={{
              flexShrink: 0, // 이미지가 줄어들지 않도록
              width: `${200 / images.length}%`, // 각 이미지의 너비 (전체 너비의 1/이미지 개수)
              height: "100%",
              objectFit: "cover",
              borderRadius: 1,
            }}
          />
        ))}
      </Box>
      {/* 좌우 네비게이션 버튼 (이미지 양옆 배치) */}
      <IconButton
        onClick={goToPrev}
        sx={{
          position: "absolute",
          left: 5, // 이미지 왼쪽 끝에서 5px
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2, // 이미지 위에 버튼이 보이도록
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
          color: "text.primary",
          p: 0.5,
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: "1.5rem" }} />{" "}
        {/* 아이콘 크기 조절 */}
      </IconButton>
      <IconButton
        onClick={goToNext}
        sx={{
          position: "absolute",
          right: 5, // 이미지 오른쪽 끝에서 5px
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
        <ArrowForwardIosIcon sx={{ fontSize: "1.5rem" }} />{" "}
        {/* 아이콘 크기 조절 */}
      </IconButton>
      {/* 인디케이터 (점) - 이미지 안에 배치 */}
      <Box
        sx={{
          position: "absolute",
          bottom: 5, // 이미지 하단에서 10px 위로
          width: "100%",
          textAlign: "center",
          zIndex: 2, // 이미지 위에 보이도록
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
                  : "rgba(255, 255, 255, 0.7)", // 활성/비활성 색상 (이미지 위에서 잘 보이도록 흰색 계열로 변경)
              margin: "0 4px",
              cursor: "pointer",
              border: "1px solid rgba(0,0,0,0.2)", // 점의 테두리 (옵션)
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
