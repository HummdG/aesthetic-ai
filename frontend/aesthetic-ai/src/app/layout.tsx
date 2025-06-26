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
  title: "Aesthetic Analysis - AI-Powered Treatment Recommendations",
  description:
    "Professional aesthetic treatment analysis using advanced AI vision technology. Get personalized recommendations for botox, fillers, and other cosmetic treatments based on facial analysis.",
  keywords: [
    "aesthetic analysis",
    "botox recommendations",
    "dermal fillers",
    "facial analysis",
    "cosmetic treatments",
    "AI medical analysis",
  ],
  authors: [{ name: "Aesthetic Analysis Team" }],
  creator: "Aesthetic Analysis",
  publisher: "Aesthetic Analysis",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aesthetic-analysis.vercel.app"),
  openGraph: {
    title: "Aesthetic Analysis - AI-Powered Treatment Recommendations",
    description:
      "Professional aesthetic treatment analysis using advanced AI vision technology. Get personalized recommendations for botox, fillers, and other cosmetic treatments.",
    url: "https://aesthetic-analysis.vercel.app",
    siteName: "Aesthetic Analysis",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aesthetic Analysis - AI-powered treatment recommendations",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aesthetic Analysis - AI-Powered Treatment Recommendations",
    description:
      "Professional aesthetic treatment analysis using advanced AI vision technology. Get personalized recommendations for cosmetic treatments.",
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
      <body
        className="antialiased bg-slate-900 text-white overflow-x-hidden"
        suppressHydrationWarning={true}
      >
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold">Aesthetic Analysis</span>
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
                  How It Works
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Safety
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300">
                Start Analysis
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="pt-20">{children}</div>

        {/* Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </body>
    </html>
  );
}
