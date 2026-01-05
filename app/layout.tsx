import type { Metadata } from "next";
import { Caveat, Nunito, Prompt } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-caveat",
});

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

const prompt = Prompt({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "Bullet Journal",
  description: "Simple and fast bullet journal",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${nunito.variable} ${prompt.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
