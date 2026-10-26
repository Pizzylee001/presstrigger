import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Press Trigger · the accountable football desk",
  description:
    "Two pundit agents read a live match, commit to falsifiable calls, and are graded in public by a deterministic resolver."
};

const themeScript = `(function(){var t=null;try{t=localStorage.getItem("pt-theme")}catch(e){}var q="";try{q=new URLSearchParams(location.search).get("theme")||""}catch(e){}if(q==="dark"||q==="light")t=q;if(t!=="dark"&&t!=="light"){try{t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){t="light"}}document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t;})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Bodoni:ital,wght@0,400;0,700;1,400&family=Public+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
