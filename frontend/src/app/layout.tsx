import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NavigationBar from "@/components/NavigationBar";
import { WebSocketProvider } from "@/context/WebSocketContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Form Coach",
  description: "AI workout assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
        <NavigationBar />
        <Toaster position="top-center"/>
        <WebSocketProvider>
        <main className="pt-25">
          {children}
        </main>
        </WebSocketProvider>
        
      </body>
    </html>
  );
}
