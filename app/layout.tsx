import type { Metadata } from "next";
import { DM_Serif_Display, IBM_Plex_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ToastContainer } from "@/components/ui/toast";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const ibmPlex = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-data",
});

export const metadata: Metadata = {
  title: "EduFi — Web3 Student Loan Funding",
  description: "Tranched student loan pools for investors and aggregators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${dmSerif.variable} ${ibmPlex.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <WalletProvider>
            <div className="layout-shell">
              <Sidebar />
              <div className="layout-main">
                <TopNav />
                <main className="flex-1 overflow-auto scroll-thin">{children}</main>
              </div>
            </div>
            <ToastContainer />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
