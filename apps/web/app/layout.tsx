import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INF CRM",
  description: "Advanced Agency & Influencer Management System",
};

import { Toaster } from "@/components/ui/sonner";

import { Providers } from "@/components/common/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 scroll-smooth">
      <body
        className="font-sans antialiased h-full"
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
