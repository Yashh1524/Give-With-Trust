import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { SidebarProvider } from "@/context/SidebarContext";
import ChatBotWrapper from "@/components/ChatBotWrapper";

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
        <SidebarProvider>
          <html lang="en">
            <body
              suppressHydrationWarning={true}
              className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`}
            >
              <div className="flex flex-col h-full">
                {/* Navbar at top */}
                <Navbar />

                {/* Sidebar + Scrollable Content */}
                <div className="flex flex-1 overflow-hidden bg-white dark:bg-[#100f1b]">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-hide">
                    {children}
                  </main>
                </div>
                {/* Floating UI */}
                <ChatBotWrapper />
                <Toaster />
              </div>
            </body>
              <Footer />
          </html>
        </SidebarProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
