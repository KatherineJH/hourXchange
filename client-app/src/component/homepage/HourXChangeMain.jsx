import React from "react";
import { Box, Typography } from "@mui/material";
import Header from "../../layout/Header";
import TopHourXChange from "./TopHourXChange";
import CheckBar from "./CheckBar";
import Footer from "../../layout/Footer.jsx";
import Theme from "../../Theme.js";
import BannerStrip from "./BannerStrip.jsx";
import Mid2HourXChange from "./Mid2HourXChange.jsx";
import Mid1HourXChange from "./Mid1HourXChange.jsx";
import Mid3HourXChange from "./Mid3HourXChange.jsx";
import Mid4HourXChange from "./Mid4HourXChange.jsx";
import Mid5HourXChange from "./Mid5HourXChnage.jsx";

export default function HourXChangeMain() {
  return (
    <>
      <Header />
      <BannerStrip />
      <Mid1HourXChange />
      <Mid2HourXChange />
      <Mid3HourXChange />
      <Mid4HourXChange />
      <Mid5HourXChange />
      <TopHourXChange />
      <Footer />
    </>
  );
}
