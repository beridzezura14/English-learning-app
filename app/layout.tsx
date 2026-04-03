import "./globals.css";
import type { Metadata } from "next";
import MainHeader from "./components/MainHeader";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Language Learning App",
  description: "Learn words daily and build vocabulary",
  icons: {
    icon: "/user.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="min-h-screen flex flex-col bg-[#0b1220] text-white">
        <MainHeader />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}