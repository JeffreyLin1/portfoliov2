import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jeffrey Lin",
  description: "Jeffrey Lin's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Foglihten+No07&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
