import Image from "next/image"
import { cn } from "@/lib/utils"

type ApreelLogoProps = {
  className?: string
  /** `on-dark` — białe logo na tle shell; `on-light` — kolor marki (#ff5367). */
  variant?: "on-dark" | "on-light"
}

export function ApreelLogo({ className, variant = "on-dark" }: ApreelLogoProps) {
  return (
    <Image
      src="/brand/apreel-logo.svg"
      alt="apreel"
      width={133}
      height={32}
      priority
      className={cn(
        "h-8 w-auto",
        variant === "on-dark" && "brightness-0 invert",
        className
      )}
    />
  )
}
