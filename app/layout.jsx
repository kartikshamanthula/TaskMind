import "./globals.css";

export const metadata = {
  title: {
    default: "TaskMind | AI-Powered Productivity",
    template: "%s | TaskMind"
  },
  description: "A premium, secure task management application to streamline your daily workflow, collaborate with teams, and boost productivity.",
  keywords: ["task manager", "productivity", "kanban board", "workflow", "collaboration"],
  authors: [{ name: "Admin" }],
  creator: "Admin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dailytaskboard.com",
    title: "TaskMind | AI-Powered Productivity",
    description: "A premium, secure task management application to streamline your daily workflow, collaborate with teams, and boost productivity.",
    siteName: "TaskMind",
    images: [
      {
        url: '/meta-image.png',
        width: 1200,
        height: 630,
        alt: 'TaskMind Preview',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskMind | AI-Powered Productivity",
    description: "A premium, secure task management application to streamline your daily workflow.",
  },
  icons: {
    icon: "/landing.png",
    shortcut: "/landing.png",
    apple: "/landing.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050508" },
  ],
};

import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster richColors position="bottom-right" closeButton />
      </body>
    </html>
  );
}
