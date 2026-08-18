import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "CineScope Ultra — Discover, Preview & Track Top Movies",
  description:
    "CineScope Ultra brings you HD cinema previews, official trailers, curated trending spotlights, cast information, and personalized movie watchlists.",
  keywords: "movies, cinema, trailers, 4k trailers, tmdb, streaming preview, watchlist, top rated films",
  openGraph: {
    title: "CineScope Ultra — The Premier Movie Discovery Experience",
    description: "Watch official HD trailers, explore top rated films, and manage your custom cinema watchlist.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full`}>
      <body className="min-h-full flex flex-col noise">{children}</body>
    </html>
  );
}
