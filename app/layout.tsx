import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Nav from "./components/nav";
import Footer from "./components/footer";
import LanguageProvider from "./components/language-provider";
import { HTML_LANG } from "./lib/i18n";
import { getLang } from "./lib/lang-server";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();

  return (
    <html lang={HTML_LANG[lang]} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <LanguageProvider initialLang={lang}>
          <div className="min-h-screen flex justify-center">
            <div className="flex min-h-screen w-full max-w-xl flex-col px-6 pt-8 pb-8">
              <Nav />
              <main className="mt-4">{children}</main>
              <Footer />
            </div>
          </div>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
