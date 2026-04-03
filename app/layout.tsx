import type { Metadata } from "next";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ToastContainer } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "QuillFi — Onchain Student Loan Finance",
  description: "Transparent student loan bundles with tranche-based capital formation and onchain investor access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">
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
