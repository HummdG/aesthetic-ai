import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    <html lang="en" className={inter.variable}>
      <body
        className="antialiased bg-gray-50 text-gray-900"
        suppressHydrationWarning={true}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
