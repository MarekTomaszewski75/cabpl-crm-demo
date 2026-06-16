"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ChatStatus } from "ai"
import { nanoid } from "nanoid"
import {
  buildCompanyChatContext,
  getStreamCharDelay,
  randomBetween,
  resolveResponseTemplate,
  type ChatPhase,
  type CompanyChatContext,
  type QueueItem,
  type SimulatedMessage,
} from "@/lib/crm/company-ai-chat-simulator"
import { useDemoData } from "@/lib/data/demo-data-context"
import { useSession } from "@/lib/auth/demo-session"

type StreamTimers = {
  intervalId?: ReturnType<typeof setInterval>
  timeoutId?: ReturnType<typeof setTimeout>
}

function clearStreamTimers(timers: StreamTimers) {
  if (timers.intervalId) clearInterval(timers.intervalId)
  if (timers.timeoutId) clearTimeout(timers.timeoutId)
  timers.intervalId = undefined
  timers.timeoutId = undefined
}

export function useCompanyAiChatSimulator(clientId: string) {
  const demoData = useDemoData()
  const { user } = useSession()

  const [messages, setMessages] = useState<SimulatedMessage[]>([])
  const [phase, setPhase] = useState<ChatPhase>("idle")
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [inputStatus, setInputStatus] = useState<ChatStatus>("ready")

  const phaseRef = useRef<ChatPhase>("idle")
  const queueRef = useRef<QueueItem[]>([])
  const timersRef = useRef<StreamTimers>({})
  const contextRef = useRef<CompanyChatContext | null>(null)
  const startSimulationRef = useRef<(text: string) => void>(() => {})

  const companyContext = useMemo(() => {
    if (!user) return null
    return buildCompanyChatContext(clientId, demoData, user)
  }, [clientId, demoData, user])

  useEffect(() => {
    contextRef.current = companyContext
  }, [companyContext])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  useEffect(() => {
    const timers = timersRef.current
    return () => clearStreamTimers(timers)
  }, [])

  const streamText = useCallback(
    (
      fullText: string,
      targetDurationMs: number,
      onUpdate: (partial: string) => void,
      onComplete: () => void,
    ) => {
      clearStreamTimers(timersRef.current)

      if (!fullText) {
        onComplete()
        return
      }

      const delay = getStreamCharDelay(fullText.length, targetDurationMs)
      let index = 0

      timersRef.current.intervalId = setInterval(() => {
        index += 1
        onUpdate(fullText.slice(0, index))

        if (index >= fullText.length) {
          clearStreamTimers(timersRef.current)
          onComplete()
        }
      }, delay)
    },
    [],
  )

  const processNextQueueItem = useCallback(() => {
    const nextPending = queueRef.current.find((item) => item.status === "pending")
    if (!nextPending) return

    setQueue((prev) =>
      prev.map((item) =>
        item.id === nextPending.id ? { ...item, status: "processing" } : item,
      ),
    )

    timersRef.current.timeoutId = setTimeout(() => {
      setQueue((prev) => prev.filter((item) => item.id !== nextPending.id))
      startSimulationRef.current(nextPending.text)
    }, 150)
  }, [])

  const startSimulation = useCallback(
    (promptText: string) => {
      const ctx = contextRef.current
      if (!ctx) return

      const trimmed = promptText.trim()
      if (!trimmed) return

      const response = resolveResponseTemplate(trimmed, ctx)
      const userMessageId = nanoid()
      const assistantMessageId = nanoid()

      setMessages((prev) => [
        ...prev,
        { id: userMessageId, role: "user", text: trimmed },
        {
          id: assistantMessageId,
          role: "assistant",
          text: "",
          displayedText: "",
          reasoning: response.reasoning,
          displayedReasoning: "",
          sources: response.sources,
          phase: "reasoning",
        },
      ])

      setPhase("reasoning")
      setInputStatus("submitted")

      timersRef.current.timeoutId = setTimeout(() => {
        setInputStatus("streaming")

        streamText(
          response.reasoning,
          randomBetween(2500, 4500),
          (partial) => {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantMessageId
                  ? { ...message, displayedReasoning: partial }
                  : message,
              ),
            )
          },
          () => {
            setPhase("streaming_answer")
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantMessageId
                  ? { ...message, phase: "streaming_answer" }
                  : message,
              ),
            )

            timersRef.current.timeoutId = setTimeout(() => {
              streamText(
                response.answer,
                randomBetween(3000, 8000),
                (partial) => {
                  setMessages((prev) =>
                    prev.map((message) =>
                      message.id === assistantMessageId
                        ? { ...message, displayedText: partial }
                        : message,
                    ),
                  )
                },
                () => {
                  setMessages((prev) =>
                    prev.map((message) =>
                      message.id === assistantMessageId
                        ? {
                            ...message,
                            text: response.answer,
                            displayedText: response.answer,
                            reasoning: response.reasoning,
                            displayedReasoning: response.reasoning,
                            sources: response.sources,
                            phase: "done",
                          }
                        : message,
                    ),
                  )
                  setPhase("done")
                  setInputStatus("ready")
                  processNextQueueItem()
                },
              )
            }, randomBetween(200, 400))
          },
        )
      }, 200)
    },
    [processNextQueueItem, streamText],
  )

  useEffect(() => {
    startSimulationRef.current = startSimulation
  }, [startSimulation])

  const submitPrompt = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || !contextRef.current) return

      const currentPhase = phaseRef.current
      if (currentPhase === "reasoning" || currentPhase === "streaming_answer") {
        setQueue((prev) => [
          ...prev,
          { id: nanoid(), text: trimmed, status: "pending" },
        ])
        return
      }

      startSimulation(trimmed)
    },
    [startSimulation],
  )

  const showSuggestions =
    phase === "idle" || (phase === "done" && inputStatus === "ready")

  return {
    messages,
    phase,
    queue,
    inputStatus,
    submitPrompt,
    showSuggestions,
    companyContext,
  }
}
