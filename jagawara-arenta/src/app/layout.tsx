import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Jagawara Arenta | Siaga Jagaren | Dashboard EWS',
  description: 'Sistem peringatan dini mitigasi bencana longsor berbasis Internet of Things (IoT) di Desa Cipelah. Diinisiasi oleh tim PPK Ormawa IAAS LC UNPAD. Lembaga Jagaren bersama warga Desa Cipelah.',
  keywords: ['EWS Cipelah', 'PPK Ormawa IAAS LC UNPAD', 'Jagawara Arenta', 'Jagaren', 'Mitigasi Bencana', 'IoT Cipelah', 'Sensor Longsor'],
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
        {children}
      </body>
    </html>
  );
}
