import CustomLayout from "@/components/custom-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import {
  ClerkProvider
} from '@clerk/nextjs';
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "Discord Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CustomLayout>
      <ClerkProvider>
        <html lang="pt-br" suppressHydrationWarning>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <head />
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
    </CustomLayout>
  );
}
