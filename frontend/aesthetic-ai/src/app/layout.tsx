import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aesthetic AI - Transform Your Creative Vision",
  description:
    "Create stunning AI-generated art and images with our advanced artificial intelligence platform. Transform text to images, apply artistic styles, and unleash your creativity.",
  keywords: [
    "AI art",
    "image generation",
    "artificial intelligence",
    "creative tools",
    "digital art",
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
    title: "Aesthetic AI - Transform Your Creative Vision",
    description:
      "Create stunning AI-generated art and images with our advanced artificial intelligence platform.",
    url: "https://aesthetic-ai.vercel.app",
    siteName: "Aesthetic AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aesthetic AI - AI-powered creative platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aesthetic AI - Transform Your Creative Vision",
    description:
      "Create stunning AI-generated art and images with our advanced artificial intelligence platform.",
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased bg-slate-900 text-white overflow-x-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                <span className="text-xl font-bold">Aesthetic AI</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Gallery
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="pt-20">{children}</div>

        {/* Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </body>
    </html>
  );
}
