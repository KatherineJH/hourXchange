import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Mid2HourXChange() {
  const navigate = useNavigate();

  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");

    const handleScroll = () => {
      revealElements.forEach((el) => {
        const { top, bottom } = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (top < windowHeight && bottom > 0) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cards = [
    {
      src: "/comunity.png",
      title: "우리, 대화하러 갈래?",
      buttonText: "커뮤니티로 Gogo!",
      onClick: () => navigate("/board/list"),
    },
    {
      src: "/donations.png",
      title: "우리, 기부하러 갈래?",
      buttonText: "기부하러 가기",
      onClick: () => navigate("/product/donation"),
    },
    {
      src: "/volunteer.png",
      title: "우리, 봉사하러 갈래?",
      buttonText: "봉사하러 가기",
      onClick: () => navigate("/product/volunteer"),
    },
  ];

  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // 1초마다 자동 슬라이드
    speed: 500,
    arrows: true,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          bgcolor: "#FCFCFC",
          py: 4,
          px: { xs: 1, md: 4 },
          gap: 3,
        }}
      >
        <Slider {...settings}>
          {cards.map((card, index) => (
            <Box
              key={index}
              className="reveal"
              sx={{
                position: "relative",
                mx: 0,
                height: { xs: "180px", sm: "240px", md: "280px" },
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
                opacity: 0,
                transform: "translateY(50px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
              }}
            >
              <Box
                component="img"
                src={card.src}
                alt={card.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  bgcolor: "rgba(0, 0, 0, 0.6)",
                  color: "#fCfCfC",
                  py: 1.5,
                  px: 1,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 0.5 }}
                >
                  {card.title}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={card.onClick}
                  sx={{
                    borderRadius: 1,
                    px: 2,
                    py: 0.6,
                    fontSize: 12,
                    textTransform: "none",
                  }}
                >
                  {card.buttonText}
                </Button>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>

      <style>
        {`
          .reveal.active {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
        `}
      </style>
    </>
  );
}

export default Mid2HourXChange;
