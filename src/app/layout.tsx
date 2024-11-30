
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "../../context/ThemeProvider";
import { useEffect } from "react";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallButton from "@/components/InstallPromt";

// Adjust the path if needed



const APP_NAME = "Sykoti";
const APP_DEFAULT_TITLE = "Sykoti E-awareness Center";
const APP_TITLE_TEMPLATE = "%s - Sykoti";
const APP_DESCRIPTION = "Plateforme offrant des services d'assistance aux victimes de cybercrimes, des programmes éducatifs et des initiatives pour développer une culture de la cybersécurité.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};



export const viewport: Viewport = {
  themeColor: "#FFFFFF",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
    <html lang="en">
      <body >
      {/* Wrap the entire app in ContextProvider */}
          {children}
          <ServiceWorkerRegistration/>
          <InstallButton />
      </body>
    </html>
    </ThemeProvider>
  );
}
