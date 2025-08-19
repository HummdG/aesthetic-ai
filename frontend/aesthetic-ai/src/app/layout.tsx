import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
        url: "/social_preview.png",
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
    images: ["/social_preview.png"],
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
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className="antialiased bg-background text-foreground font-inter"
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
