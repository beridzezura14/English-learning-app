import "./globals.css";
import type { Metadata } from "next";
import MainHeader from "./components/MainHeader";
import Footer from "./components/Footer";
import Script from "next/script";
import PageViewTracker from "./PageViewTracker";

export const metadata: Metadata = {
  title: "Language Learning App",
  description: "Learn words daily and build vocabulary",
  icons: {
    icon: "/book.png",
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
        <PageViewTracker />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R8YSPHSBK8"
          strategy="afterInteractive"
        />

        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}

            gtag('js', new Date());

            gtag('config', 'G-R8YSPHSBK8', {
              send_page_view: true
            });
          `}
        </Script>
      </body>
    </html>
  );
}