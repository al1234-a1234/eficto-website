import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "لوحة تحكم افيكتو",
    short_name: "eficto",
    description: "لوحة تحكم إدارة قائمة الانتظار والحجوزات لمطعم افيكتو",
    start_url: "/admin",
    display: "standalone",
    background_color: "#17401F",
    theme_color: "#235C31",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
