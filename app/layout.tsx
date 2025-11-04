import type { Metadata } from "next";
import { Inter, Work_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reyzume — Build ATS-Friendly Resumes Effortlessly",
  description:
    "Create professional, ATS-optimized resumes with Reyzume. Fast, beautiful, and AI-assisted.",
  openGraph: {
    title: "Reyzume",
    description: "Build ATS-friendly resumes in minutes.",
    url: "https://reyzume.com",
    siteName: "Reyzume",
    images: ["/og-image.png"],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://reyzume.com"),
  icons: {
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={`${inter.variable} ${workSans.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
