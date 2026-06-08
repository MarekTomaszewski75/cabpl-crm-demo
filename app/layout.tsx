import { Noto_Sans } from "next/font/google"

import "./globals.css"
import { AppProviders } from "@/components/app-providers"
import { cn } from "@/lib/utils"

const notoSans = Noto_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
})

export const metadata = {
  title: "CRM Korporacyjny — Demo | Credit Agricole",
  description: "Demonstracja Quick Win CRM — bankowość korporacyjna CABPL",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pl"
      suppressHydrationWarning
      className={cn("antialiased", notoSans.variable, "font-sans")}
    >
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
