// Default share image (WhatsApp, Facebook, Google, X) for every page that
// doesn't set its own. Rendered once at build time.
import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import site from "@content/site.json";

export const alt = "Tarana Handicrafts – hand-carved wooden elephants from Jaipur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HERO_IMAGE = "public/images/products/jaali-net-elephant/1.jpg";

export default function OpengraphImage() {
  const photo = `data:image/jpeg;base64,${fs.readFileSync(path.join(process.cwd(), HERO_IMAGE)).toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#F9F8F6" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 630, padding: "0 64px" }}>
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#B8934E" }}>
            Jaipur · Rajasthan
          </div>
          <div style={{ fontSize: 72, lineHeight: 1.05, color: "#1c1917", marginTop: 20 }}>{site.name}</div>
          <div style={{ fontSize: 32, lineHeight: 1.3, color: "#57534e", marginTop: 24 }}>
            Hand-carved wooden elephants, figurines &amp; home decor
          </div>
          <div style={{ fontSize: 24, color: "#78716c", marginTop: 32 }}>Retail · Wholesale · Corporate gifts</div>
        </div>
        <img src={photo} width={570} height={630} style={{ objectFit: "cover" }} alt="" />
      </div>
    ),
    size
  );
}
