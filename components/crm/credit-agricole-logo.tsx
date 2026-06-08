import Image from "next/image"
import { cn } from "@/lib/utils"

type CreditAgricoleLogoProps = {
  className?: string
  variant?: "on-dark" | "on-light"
}

export function CreditAgricoleLogo({
  className,
  variant = "on-dark",
}: CreditAgricoleLogoProps) {
  return (
    <Image
      src="/brand/credit-agricole-logo.svg"
      alt="Credit Agricole"
      width={364}
      height={71}
      priority
      className={cn(
        "h-8 w-auto",
        variant === "on-dark" && "brightness-0 invert",
        className
      )}
    />
  )
}
