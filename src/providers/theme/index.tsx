"use client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { ReactNode } from "react";
import { Noto_Sans_JP } from "next/font/google";
import { grey } from "@mui/material/colors";
import React from "react";

type ThemingProps = {
  children: ReactNode;
};

const notoSans = Noto_Sans_JP({
  weight: "400",
  subsets: ["latin"],
});

export default function Theming({ children }: ThemingProps) {
  const theme = createTheme({
    palette: {
      background: {
        paper: grey[50],
        default: grey[200],
      },
      text: {
        primary: "#3A3541DE",
        secondary: "#3A354199",
      },

      primary: {
        main: "#299967",
      },
      secondary: {
        // main: "#fd26a7",
        main: "#deede1",
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 768,
        md: 1024,
        lg: 1266,
        xl: 1536,
      },
    },
    typography: {
      fontFamily: notoSans.style.fontFamily,
      h1: { fontSize: "3rem" },
      h2: { fontSize: "2rem" },
      h3: { fontSize: "1.5rem" },
      body1: { fontSize: "1rem" },
      body2: { fontSize: "0.875rem" },
      caption: { fontSize: "0.75rem" },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
