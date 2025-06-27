import type { Metadata } from "next";
import { Playfair_Display, Crimson_Text } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const crimson = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aesthetic AI - AI-Powered Beauty Analysis",
  description:
    "Professional aesthetic analysis using advanced AI technology. Get personalized recommendations for cosmetic treatments based on facial analysis.",
  keywords: [
    "aesthetic analysis",
    "AI beauty analysis",
    "facial analysis",
    "cosmetic treatments",
    "aesthetic AI",
    "beauty technology",
    "skincare analysis",
    "peptide skincare",
    "advanced skincare",
  ],
  authors: [{ name: "Aesthetic AI Team" }],
  creator: "Aesthetic AI",
  publisher: "Aesthetic AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aesthetic-ai.vercel.app"),
  openGraph: {
    title: "Aesthetic AI - AI-Powered Beauty Analysis",
    description:
      "Professional aesthetic analysis using advanced AI technology. Get personalized recommendations for cosmetic treatments.",
    url: "https://aesthetic-ai.vercel.app",
    siteName: "Aesthetic AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aesthetic AI - AI-powered beauty analysis",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aesthetic AI - AI-Powered Beauty Analysis",
    description:
      "Professional aesthetic analysis using advanced AI technology. Get personalized recommendations for cosmetic treatments.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification-code-here",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${crimson.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className="antialiased bg-gradient-to-br from-nude-50 via-cream-100 to-nude-100 text-brown-900 font-body"
        suppressHydrationWarning={true}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
