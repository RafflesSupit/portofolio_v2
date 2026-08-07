import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Portfolio";
export const dynamic = "force-dynamic";

export default async function OpengraphImage() {
  const profile = await getProfile();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(ellipse 80% 60% at 15% 15%, #17403e 0%, #0b0b0d 60%)",
          color: "#f2f1ed",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#9c9ea6",
            marginBottom: 28,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#4fd1c7" }} />
          Available for opportunities
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05, maxWidth: 980 }}>
          {profile.headline}
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 30, color: "#9c9ea6" }}>
          {profile.name} · {profile.role}
        </div>
      </div>
    ),
    size,
  );
}
