/**
 * Prawdopodobieństwo wygranej wybierane przez opiekuna z listy (QW-05, odpowiedź Banku R22/R197).
 * System go nie wylicza; 100% ustawia wygrana.
 */
export const DEAL_PROBABILITY_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90] as const

export const DEFAULT_DEAL_PROBABILITY = 10

export function formatDealProbability(value: number | undefined): string {
  return value == null ? "—" : `${value}%`
}
