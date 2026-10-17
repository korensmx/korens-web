"use client";

import React from "react";
import { useSeasonalTheme } from "./useSeasonalTheme";
import CempasuchilCanvas from "./CempasuchilCanvas";

export default function SeasonalEngine({ children }: { children: React.ReactNode }) {
  const { isActive } = useSeasonalTheme();

  if (!isActive) {
    // Si la fecha es a partir del 4 de noviembre, regresa 100% al diseño normal sin sobrecarga
    return <>{children}</>;
  }

  return (
    <>
      {/* Partículas Graphic Motion de cempasúchil flotantes a 60 FPS */}
      <CempasuchilCanvas />

      {/* Resplandores etéreos de ofrenda y cirios en el fondo */}
      <div className="fixed top-12 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-korens-orange/10 rounded-full blur-[140px] pointer-events-none z-10" />
      <div className="fixed top-36 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none z-10" />

      {children}
    </>
  );
}
