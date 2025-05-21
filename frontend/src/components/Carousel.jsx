import React from "react";
import Slider from "react-slick";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "@mui/icons-material";

import carouselImg1 from "../assets/Carousel-img.jpg";
import carouselImg2 from "../assets/Carousel-img2.jpg";
import carouselImg3 from "../assets/Carousel-img3.jpg";

const Carousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width:400px)");

  const carouselData = [
    {
      id: 1,
      title: "Find Your Dream Internship",
      description: "Connect with top companies looking for your skills",
      image: carouselImg1,
    },
    {
      id: 2,
      title: "Hire Top Talent",
      description: "Discover the best students for your organization",
      image: carouselImg2,
    },
    {
      id: 3,
      title: "Seamless Experience",
      description: "Easy-to-use platform for students and recruiters",
      image: carouselImg3,
    },
  ];

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <Box
        sx={{
          position: "absolute",
          right: isMobile ? "10px" : "30px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          cursor: "pointer",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "50%",
          width: isMobile ? "35px" : "40px",
          height: isMobile ? "35px" : "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
        }}
        onClick={onClick}
      >
        <ChevronRightIcon sx={{ 
          color: "#2563eb", 
          fontSize: isMobile ? "25px" : "30px" 
        }} />
      </Box>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <Box
        sx={{
          position: "absolute",
          left: isMobile ? "10px" : "30px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          cursor: "pointer",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "50%",
          width: isMobile ? "35px" : "40px",
          height: isMobile ? "35px" : "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
        }}
        onClick={onClick}
      >
        <ChevronLeftIcon sx={{ 
          color: "#2563eb", 
          fontSize: isMobile ? "25px" : "30px" 
        }} />
      </Box>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <Box
        sx={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ul style={{ 
          margin: "0", 
          padding: "0", 
          display: "flex", 
          flexDirection: "row",
          gap: "6px"
        }}>{dots}</ul>
      </Box>
    ),
    customPaging: (i) => (
      <Box
        sx={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: (theme) => 
            theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.5)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&.slick-active": {
            backgroundColor: "#2563eb"
          }
        }}
      />
    ),
  };

  return (
    <Box
      sx={{
        width: "100%",
        margin: "40px 0",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        "& .slick-slide": {
          overflow: "hidden",
          lineHeight: 0
        },
        "& .slick-list": {
          overflow: "hidden",
        },
      }}
    >
      <Slider {...settings}>
        {carouselData.map((slide) => (
          <Box
            key={slide.id}
            sx={{
              position: "relative",
              height: isSmallMobile ? "250px" : isMobile ? "300px" : "500px",
              width: "100%",
              overflow: "hidden",
              lineHeight: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
                zIndex: 1,
              },
            }}
          >
            <Box
              component="img"
              src={slide.image}
              alt={slide.title}
              loading="lazy"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                display: "block",
                margin: 0,
                padding: 0,
                lineHeight: 0
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: isSmallMobile ? "20px" : isMobile ? "25px" : "40px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 2,
                maxWidth: "800px",
                width: isMobile ? "90%" : "95%",
                textAlign: "center",
                padding: "0 15px",
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h3"}
                component="h3"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  mb: 1,
                  fontSize: isSmallMobile ? "1.4rem" : isMobile ? "1.6rem" : "2.4rem",
                  lineHeight: "1.2",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {slide.title}
              </Typography>
              <Typography
                variant={isMobile ? "body2" : "h6"}
                component="p"
                sx={{
                  color: "#fff",
                  mb: 2,
                  fontSize: isSmallMobile ? "0.8rem" : isMobile ? "0.9rem" : "1.1rem",
                  lineHeight: "1.3",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                {slide.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default Carousel;