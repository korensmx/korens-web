"use client";

import { useState, useEffect } from "react";

// Ventana temporal de temporada: 16 de Octubre de 2026 al 3 de Noviembre de 2026 (23:59:59 hrs GMT-6 / hora centro México)
const SEASON_START_TIMESTAMP = new Date("2026-10-16T00:00:00-06:00").getTime();
const SEASON_END_TIMESTAMP = new Date("2026-11-03T23:59:59.999-06:00").getTime();

export function useSeasonalTheme() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);

    // Permite previsualizar ambos estados con parámetros de URL:
    // ?season=active o ?season=true  -> fuerza activación
    // ?season=normal o ?season=off   -> fuerza diseño normal original
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const seasonQuery = urlParams.get("season")?.toLowerCase();

      if (seasonQuery === "active" || seasonQuery === "true" || seasonQuery === "1") {
        setIsActive(true);
        return;
      }

      if (seasonQuery === "normal" || seasonQuery === "off" || seasonQuery === "false" || seasonQuery === "0") {
        setIsActive(false);
        return;
      }
    }

    const now = Date.now();
    const active = now >= SEASON_START_TIMESTAMP && now <= SEASON_END_TIMESTAMP;
    setIsActive(active);
  }, []);

  return {
    isActive: isMounted && isActive,
    isMounted,
  };
}
