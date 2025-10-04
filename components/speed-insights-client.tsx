"use client";

import dynamic from "next/dynamic";
import React from "react";

const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((mod) => mod.SpeedInsights),
  { ssr: false }
);

export default function SpeedInsightsClient() {
  return <SpeedInsights />;
}
