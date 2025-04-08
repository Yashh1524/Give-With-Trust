import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GiveWithTrust",
  description: "Support NGOs with transparency",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ThemeProvider>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex flex-1 overflow-hidden bg-white dark:bg-[#100f1b]">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                  {children}
                </main>
              </div>
              {/* <Footer /> */}
            </div>
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}
