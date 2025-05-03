import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Toaster } from 'react-hot-toast'
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
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              <div className="flex flex-col h-screen overflow-y-hidden">
                <Navbar />
                <div className="flex flex-1 bg-white dark:bg-[#100f1b] overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-64px)]">
                    {children}
                  </main>
                </div>

              </div>
              <ChatBotWrapper />
              <Toaster />
            </body>
          </html>
        </SidebarProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
