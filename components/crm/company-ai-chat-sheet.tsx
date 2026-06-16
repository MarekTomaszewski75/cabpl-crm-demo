"use client"

import * as React from "react"
import {
  Context,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
} from "@/components/ai-elements/context"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input"
import { SelectGroup } from "@/components/ui/select"
import {
  Queue,
  QueueItem,
  QueueItemContent,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from "@/components/ai-elements/queue"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning"
import { Shimmer } from "@/components/ai-elements/shimmer"
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources"
import {
  Suggestion,
} from "@/components/ai-elements/suggestion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { getChatSuggestions } from "@/lib/crm/company-ai-chat-simulator"
import {
  DEMO_CHAT_MODELS,
  estimateChatTokenUsage,
  formatCompactTokens,
  getDemoChatModel,
} from "@/lib/crm/company-ai-chat-models"
import { useCompanyAiChatSimulator } from "@/lib/crm/use-company-ai-chat-simulator"
import type { Client } from "@/types/crm"
import { SparklesIcon } from "lucide-react"

type CompanyAiChatSheetProps = {
  client: Client
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompanyAiChatSheet({
  client,
  open,
  onOpenChange,
}: CompanyAiChatSheetProps) {
  const {
    messages,
    queue,
    inputStatus,
    submitPrompt,
    showSuggestions,
  } = useCompanyAiChatSimulator(client.id)

  const [modelId, setModelId] = React.useState(DEMO_CHAT_MODELS[0].id)

  const selectedModel = getDemoChatModel(modelId)
  const tokenUsage = React.useMemo(
    () => estimateChatTokenUsage(messages),
    [messages],
  )

  const suggestions = getChatSuggestions()
  const pendingQueue = queue.filter((item) => item.status !== "completed")

  function handlePromptSubmit(message: PromptInputMessage) {
    const text = message.text.trim()
    if (!text) return
    submitPrompt(text)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-xl data-[side=right]:sm:max-w-xl"
      >
        <SheetHeader className="shrink-0 border-b px-4 py-4">
          <SheetTitle>Asystent firmy</SheetTitle>
          <SheetDescription>{client.name}</SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          <Conversation className="min-h-0 flex-1">
            <ConversationContent>
              {messages.length === 0 ? (
                <ConversationEmptyState
                  description={`Przeanalizuję profil ${client.name} — wybierz sugestię poniżej lub zadaj własne pytanie.`}
                  icon={<SparklesIcon />}
                  title="Czym mogę się zająć?"
                />
              ) : null}

              {messages.map((message) => {
                if (message.role === "user") {
                  return (
                    <Message key={message.id} from="user">
                      <MessageContent>
                        <p>{message.text}</p>
                      </MessageContent>
                    </Message>
                  )
                }

                const isActiveAssistant =
                  message.phase === "reasoning" ||
                  message.phase === "streaming_answer"
                const answerText =
                  message.displayedText ?? message.text
                const reasoningText =
                  message.displayedReasoning ?? message.reasoning ?? ""
                const isReasoningStreaming = message.phase === "reasoning"
                const showSources =
                  !isActiveAssistant &&
                  message.sources &&
                  message.sources.length > 0

                return (
                  <Message key={message.id} from="assistant">
                    <MessageContent>
                      {reasoningText ? (
                        <Reasoning isStreaming={isReasoningStreaming}>
                          <ReasoningTrigger
                            getThinkingMessage={(isStreaming) =>
                              isStreaming ? (
                                <Shimmer duration={1}>Analizuję dane…</Shimmer>
                              ) : (
                                <p>Przemyślałem odpowiedź</p>
                              )
                            }
                          />
                          <ReasoningContent>
                            {reasoningText}
                          </ReasoningContent>
                        </Reasoning>
                      ) : null}

                      {answerText ? (
                        <MessageResponse>{answerText}</MessageResponse>
                      ) : null}

                      {showSources ? (
                        <Sources>
                          <SourcesTrigger count={message.sources!.length}>
                            <p className="font-medium">
                              Wykorzystano {message.sources!.length} źródeł
                            </p>
                          </SourcesTrigger>
                          <SourcesContent>
                            {message.sources!.map((source) => (
                              <Source
                                key={source.href}
                                href={source.href}
                                title={source.title}
                              />
                            ))}
                          </SourcesContent>
                        </Sources>
                      ) : null}
                    </MessageContent>
                  </Message>
                )
              })}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="flex shrink-0 flex-col gap-3 border-t px-4 py-3">
            {showSuggestions ? (
              <div className="flex flex-col gap-2">
                {suggestions.map((suggestion) => (
                  <Suggestion
                    key={suggestion}
                    className="h-auto w-full justify-start rounded-lg px-3 py-2 text-left whitespace-normal"
                    suggestion={suggestion}
                    onClick={submitPrompt}
                  />
                ))}
              </div>
            ) : null}

            {pendingQueue.length > 0 ? (
              <Queue>
                <QueueSection defaultOpen>
                  <QueueSectionTrigger>
                    <QueueSectionLabel
                      count={pendingQueue.length}
                      label="Kolejka"
                    />
                  </QueueSectionTrigger>
                  <QueueSectionContent>
                    <QueueList>
                      {pendingQueue.map((item) => (
                        <QueueItem key={item.id}>
                          <div className="flex items-start gap-2">
                            <QueueItemIndicator
                              completed={item.status === "processing"}
                            />
                            <QueueItemContent
                              completed={item.status === "processing"}
                            >
                              {item.text}
                            </QueueItemContent>
                          </div>
                        </QueueItem>
                      ))}
                    </QueueList>
                  </QueueSectionContent>
                </QueueSection>
              </Queue>
            ) : null}

            <PromptInput className="rounded-xl border" onSubmit={handlePromptSubmit}>
              <PromptInputBody>
                <PromptInputTextarea placeholder="Zapytaj o firmę…" />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <Context
                    maxTokens={selectedModel.maxTokens}
                    usedTokens={tokenUsage.usedTokens}
                    usage={tokenUsage.usage}
                  >
                    <ContextTrigger />
                    <ContextContent align="end">
                      <ContextContentHeader />
                      <ContextContentBody className="flex flex-col gap-2">
                        <ContextInputUsage>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Wejście</span>
                            <span>
                              {formatCompactTokens(
                                tokenUsage.usage.inputTokens ?? 0,
                              )}
                            </span>
                          </div>
                        </ContextInputUsage>
                        <ContextReasoningUsage>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              Rozumowanie
                            </span>
                            <span>
                              {formatCompactTokens(
                                tokenUsage.usage.reasoningTokens ?? 0,
                              )}
                            </span>
                          </div>
                        </ContextReasoningUsage>
                        <ContextOutputUsage>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Wyjście</span>
                            <span>
                              {formatCompactTokens(
                                tokenUsage.usage.outputTokens ?? 0,
                              )}
                            </span>
                          </div>
                        </ContextOutputUsage>
                      </ContextContentBody>
                      <ContextContentFooter>
                        <span className="text-muted-foreground">
                          Okno kontekstu
                        </span>
                        <span className="font-mono">
                          {formatCompactTokens(selectedModel.maxTokens)}
                        </span>
                      </ContextContentFooter>
                    </ContextContent>
                  </Context>

                  <PromptInputSelect onValueChange={setModelId} value={modelId}>
                    <PromptInputSelectTrigger className="max-w-44">
                      <PromptInputSelectValue />
                    </PromptInputSelectTrigger>
                    <PromptInputSelectContent align="start">
                      <SelectGroup>
                        {DEMO_CHAT_MODELS.map((model) => (
                          <PromptInputSelectItem key={model.id} value={model.id}>
                            {model.name}
                          </PromptInputSelectItem>
                        ))}
                      </SelectGroup>
                    </PromptInputSelectContent>
                  </PromptInputSelect>
                </PromptInputTools>
                <PromptInputSubmit status={inputStatus} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
