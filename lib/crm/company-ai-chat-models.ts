import type { LanguageModelUsage } from "ai"
import type { SimulatedMessage } from "@/lib/crm/company-ai-chat-simulator"

export type DemoChatModel = {
  id: string
  name: string
  provider: string
  maxTokens: number
  group: string
  description: string
}

export const DEMO_CHAT_MODELS: DemoChatModel[] = [
  {
    id: "cabpl-assistant",
    name: "Asystent CRM",
    provider: "synthetic",
    maxTokens: 32_000,
    group: "CA On-premise (demo)",
    description: "Ogólna analiza firmy i rekomendacje",
  },
  {
    id: "cabpl-risk",
    name: "Analityk ryzyka",
    provider: "synthetic",
    maxTokens: 16_000,
    group: "CA On-premise (demo)",
    description: "Scoring, płatności i sygnały ostrzegawcze",
  },
  {
    id: "cabpl-products",
    name: "Doradca produktowy",
    provider: "synthetic",
    maxTokens: 24_000,
    group: "CA On-premise (demo)",
    description: "Cross-sell i dopasowanie oferty bankowej",
  },
  {
    id: "cabpl-pipeline",
    name: "Coach pipeline",
    provider: "synthetic",
    maxTokens: 20_000,
    group: "CA On-premise (demo)",
    description: "Deale, szanse i kolejne kroki sprzedaży",
  },
]

const CRM_BASE_CONTEXT_TOKENS = 1_200

function estimateTokens(text: string): number {
  return Math.max(0, Math.ceil(text.trim().length / 4))
}

export function estimateChatTokenUsage(messages: readonly SimulatedMessage[]): {
  usedTokens: number
  usage: LanguageModelUsage
} {
  let inputTokens = CRM_BASE_CONTEXT_TOKENS
  let outputTokens = 0
  let reasoningTokens = 0

  for (const message of messages) {
    if (message.role === "user") {
      inputTokens += estimateTokens(message.text)
      continue
    }

    outputTokens += estimateTokens(message.text || message.displayedText || "")
    reasoningTokens += estimateTokens(
      message.reasoning || message.displayedReasoning || "",
    )
  }

  const totalTokens = inputTokens + outputTokens + reasoningTokens

  return {
    usedTokens: totalTokens,
    usage: {
      inputTokens,
      outputTokens,
      reasoningTokens,
      totalTokens,
      inputTokenDetails: {
        noCacheTokens: inputTokens,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
      },
      outputTokenDetails: {
        textTokens: outputTokens,
        reasoningTokens,
      },
    } as LanguageModelUsage,
  }
}

export function getDemoChatModel(modelId: string): DemoChatModel {
  return (
    DEMO_CHAT_MODELS.find((model) => model.id === modelId) ?? DEMO_CHAT_MODELS[0]
  )
}

export function formatCompactTokens(value: number): string {
  return new Intl.NumberFormat("pl-PL", { notation: "compact" }).format(value)
}
