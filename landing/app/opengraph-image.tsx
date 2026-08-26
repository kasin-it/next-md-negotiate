import { ImageResponse } from "next/og";

export const alt = "next-md-negotiate — Markdown for agents, HTML for people";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#f7f7f5",
        color: "#171717",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px 80px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          fontFamily: "monospace",
          fontSize: 24,
          justifyContent: "space-between",
        }}
      >
        <span>next-md-negotiate</span>
        <span style={{ color: "#2563eb" }}>Vary: Accept</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 650, lineHeight: 1.05 }}>
          Markdown for agents.
        </div>
        <div style={{ color: "#737373", display: "flex", fontSize: 72, lineHeight: 1.05 }}>
          HTML for people.
        </div>
      </div>
      <div
        style={{
          borderTop: "2px solid #d4d4d4",
          display: "flex",
          fontFamily: "monospace",
          fontSize: 22,
          justifyContent: "space-between",
          paddingTop: 28,
        }}
      >
        <span>Accept: text/markdown</span>
        <span style={{ color: "#737373" }}>same URL · negotiated response</span>
      </div>
    </div>,
    size,
  );
}
