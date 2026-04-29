import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 110,
          fontWeight: 800,
          background: "linear-gradient(135deg,#0f0f0f 0%,#1a1a2e 100%)",
          color: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "-4px",
          borderRadius: 30,
          fontFamily: "sans-serif",
        }}
      >
        SC
      </div>
    ),
    size
  );
}
