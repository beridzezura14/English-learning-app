import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Language Learning App",
  description: "Learn words daily and build vocabulary",
  icons: {
    icon: "/user.png", // ან favicon.ico
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
