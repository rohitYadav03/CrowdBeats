import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrowdBeats",
  description: "spoitif jam ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
<html lang="en" suppressHydrationWarning>
  <body 
    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    suppressHydrationWarning
  >
        {children}
        <Toaster 
        position="top-center"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
            className: 'backdrop-blur-xl',
            duration: 3000,
          }}
          theme="dark"
        />
      </body>
    </html>
  );
}
