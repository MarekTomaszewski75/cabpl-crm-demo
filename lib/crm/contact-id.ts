export function createNextContactId(
  existing: readonly { id: string }[],
): string {
  const max = existing.reduce((acc, item) => {
    const match = /^contact-(\d+)$/.exec(item.id)
    if (!match) return acc
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `contact-${String(max + 1).padStart(3, "0")}`
}
