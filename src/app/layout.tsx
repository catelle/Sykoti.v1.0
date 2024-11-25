import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../../context/ThemeProvider";

// Adjust the path if needed

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sykoti E-awareness Center",
  description: "Plateforme offrant des services d'assistance aux victimes de cybercrimes, des programmes éducatifs et des initiatives pour développer une culture de la cybersécurité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
    <html lang="en">
      <body className={inter.className}>
      {/* Wrap the entire app in ContextProvider */}
          {children}
        
      </body>
    </html>
    </ThemeProvider>
  );
}
