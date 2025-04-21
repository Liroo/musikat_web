import "@/assets/css/global.css";
import StoreProvider from "@/components/providers/store";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const monumentExtended = localFont({
  src: "../assets/fonts/MonumentExtended-Regular.otf",
  variable: "--font-monument-extended",
});

export const metadata: Metadata = {
  title: "Musikat",
  description: "Learn to play the guitar with Liroo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${monumentExtended.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <StoreProvider>{children}</StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
