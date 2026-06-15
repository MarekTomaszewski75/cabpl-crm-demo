import * as React from "react"

export function useHighlightCrmActivity(
  highlightActivityId: string | null,
  itemIds: readonly string[],
) {
  React.useEffect(() => {
    if (!highlightActivityId) return
    const element = document.getElementById(`crm-activity-${highlightActivityId}`)
    if (!element) return
    const timeoutId = window.setTimeout(() => {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 150)
    return () => window.clearTimeout(timeoutId)
  }, [highlightActivityId, itemIds])
}

export function crmActivityItemClassName(
  itemId: string,
  highlightActivityId: string | null | undefined,
): string {
  if (!highlightActivityId || highlightActivityId !== itemId) {
    return ""
  }
  return "rounded-md ring-2 ring-primary ring-offset-2 ring-offset-background"
}
