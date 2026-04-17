import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Shailesh Chaudhari";
  const type = searchParams.get("type") ?? "blog"; // "blog" | "page"

  const truncatedTitle = title.length > 70 ? title.slice(0, 67) + "..." : title;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
        padding: "60px",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "6px",
          background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)",
        }}
      />

      {/* Type label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "rgba(99,102,241,0.2)",
            border: "1px solid rgba(99,102,241,0.4)",
            borderRadius: "6px",
            padding: "6px 14px",
            color: "#a5b4fc",
            fontSize: "14px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {type === "blog" ? "Blog Post" : "Portfolio"}
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: title.length > 50 ? "42px" : "52px",
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: 1.3,
            maxWidth: "900px",
          }}
        >
          {truncatedTitle}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            SC
          </div>
          <div style={{ color: "#e2e8f0", fontSize: "18px", fontWeight: 600 }}>
            Shailesh Chaudhari
          </div>
        </div>
        <div style={{ color: "#64748b", fontSize: "16px" }}>
          shaileshchaudhari.vercel.app
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
