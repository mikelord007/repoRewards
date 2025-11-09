import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RepoRewards",
  description:
    "Fund open-source contributors using the Optent protocol. Distribute yield from pooled funds to contributors.",
  icons: {
    icon: "/repoRewards%20logo.png",
    shortcut: "/repoRewards%20logo.png",
    apple: "/repoRewards%20logo.png",
  },
  openGraph: {
    title: "RepoRewards",
    description:
      "Fund open-source contributors using the Optent protocol. Distribute yield from pooled funds to contributors.",
    images: ["/repoRewards%20logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "RepoRewards",
    description:
      "Fund open-source contributors using the Optent protocol. Distribute yield from pooled funds to contributors.",
    images: ["/repoRewards%20logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
