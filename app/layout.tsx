import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { TrpcProvider } from "@/components/providers/trpc-provider";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Ship your startup in days, not weeks",
  description:
    "The NextJS boilerplate with all you need to build your SaaS or any other web app and make your first $ online fast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${quicksand.className} antialiased`}>
        <TrpcProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
