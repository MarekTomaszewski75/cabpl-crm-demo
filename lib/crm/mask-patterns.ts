import type { MaskPattern } from "@/components/ui/mask-input"

/** NIP — 10 cyfr, zapis unmasked. */
export const NIP_MASK: MaskPattern = {
  pattern: "##########",
  transform: (v) => v.replace(/\D/g, "").slice(0, 10),
  validate: (v) => v.length === 10,
}

/** Telefon PL — +48 + 9 cyfr, zapis unmasked (cyfry krajowe). */
export const PL_PHONE_MASK: MaskPattern = {
  pattern: "+48 ### ### ###",
  transform: (v) => v.replace(/\D/g, "").replace(/^48/, "").slice(0, 9),
  validate: (v) => v.length === 9,
}

/** Kod pocztowy PL — ##-###, zapis unmasked (5 cyfr). */
export const PL_POSTAL_CODE_MASK: MaskPattern = {
  pattern: "##-###",
  transform: (v) => v.replace(/\D/g, "").slice(0, 5),
  validate: (v) => v.length === 5,
}
