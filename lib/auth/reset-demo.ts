/**
 * Reset pokazu: czyści sesję przeglądarki (zalogowany użytkownik, flagi banerów,
 * „Ponów” katalogu) i przeładowuje stronę, więc seed wraca do stanu początkowego (US-58).
 */
export function resetDemoSession(): void {
  sessionStorage.clear()
  window.location.assign("/login")
}
