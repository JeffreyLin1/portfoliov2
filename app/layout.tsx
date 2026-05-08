import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Nav from "./components/nav";
import Footer from "./components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jeffrey Lin",
  description: "Jeffrey Lin's personal website",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex justify-center">
          <div className="flex min-h-screen w-full max-w-xl flex-col px-6 pt-8 pb-8">
            <Nav />
            <main className="mt-4">{children}</main>
            <Footer />
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
