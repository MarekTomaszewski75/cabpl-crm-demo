"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SessionProvider } from "@/lib/auth/demo-session"
import { DemoDataProvider } from "@/lib/data/demo-data-context"
import { NotificationProvider } from "@/lib/notifications/notification-context"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <DemoDataProvider>
          <SessionProvider>
            <NotificationProvider>
              {children}
              <Toaster position="top-center" richColors />
            </NotificationProvider>
          </SessionProvider>
        </DemoDataProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
