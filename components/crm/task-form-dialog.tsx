"use client"

import * as React from "react"
import { PencilIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDemoData } from "@/lib/data/demo-data-context"
import { createNextTaskId } from "@/lib/crm/task-id"
import {
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_OPTIONS,
} from "@/lib/crm/task-labels"
import { filterByScope } from "@/lib/rbac/scope"
import type { Client, DemoUser, Opportunity, Task, TaskPriority } from "@/types/crm"

const LINK_NONE = "__none__"

type TaskFormDialogProps = {
  user: DemoUser
  task?: Task
  defaultClientId?: string | null
  defaultTitle?: string | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

function resolveTaskScope(
  user: DemoUser,
  client: Client | undefined,
  opportunity: Opportunity | undefined,
): Pick<Task, "ownerId" | "regionId"> {
  if (client) {
    return { ownerId: client.ownerId, regionId: client.regionId }
  }
  if (opportunity) {
    return { ownerId: opportunity.ownerId, regionId: opportunity.regionId }
  }
  if (user.role === "advisor") {
    return {
      ownerId: user.id,
      regionId: user.regionId ?? "mazowsze",
    }
  }
  return {
    ownerId: user.id,
    regionId: user.regionId ?? "mazowsze",
  }
}

function taskToFormState(task: Task) {
  return {
    title: task.title,
    dueDate: task.dueDate,
    priority: task.priority,
    clientId: task.clientId ?? LINK_NONE,
    opportunityId: task.opportunityId ?? LINK_NONE,
  }
}

export function TaskFormDialog({
  user,
  task,
  defaultClientId = null,
  defaultTitle = null,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  trigger,
}: TaskFormDialogProps) {
  const isEdit = Boolean(task)
  const { tasks, clients, opportunities, addTask, updateTask } = useDemoData()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [dueDate, setDueDate] = React.useState("")
  const [priority, setPriority] = React.useState<TaskPriority>("medium")
  const [clientId, setClientId] = React.useState(LINK_NONE)
  const [opportunityId, setOpportunityId] = React.useState(LINK_NONE)

  const open = openProp ?? internalOpen
  const setOpen = onOpenChangeProp ?? setInternalOpen

  const scopedClients = React.useMemo(
    () => filterByScope(clients, user),
    [clients, user],
  )

  const scopedOpportunities = React.useMemo(
    () => filterByScope(opportunities, user),
    [opportunities, user],
  )

  const opportunitiesForClient = React.useMemo(() => {
    if (clientId === LINK_NONE) {
      return scopedOpportunities
    }
    return scopedOpportunities.filter((opp) => opp.clientId === clientId)
  }, [scopedOpportunities, clientId])

  React.useEffect(() => {
    if (!open) return
    if (task) {
      const state = taskToFormState(task)
      setTitle(state.title)
      setDueDate(state.dueDate)
      setPriority(state.priority)
      setClientId(state.clientId)
      setOpportunityId(state.opportunityId)
    } else {
      resetForm()
    }
  }, [open, task, defaultClientId, defaultTitle])

  function resetForm() {
    setTitle(defaultTitle ?? "")
    setDueDate("")
    setPriority("medium")
    setClientId(defaultClientId ?? LINK_NONE)
    setOpportunityId(LINK_NONE)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next && !isEdit) {
      resetForm()
    }
  }

  function handleClientChange(value: string) {
    setClientId(value)
    if (value === LINK_NONE) {
      return
    }
    if (
      opportunityId !== LINK_NONE &&
      !scopedOpportunities.some(
        (opp) => opp.id === opportunityId && opp.clientId === value,
      )
    ) {
      setOpportunityId(LINK_NONE)
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle || !dueDate) {
      return
    }

    const selectedClient =
      clientId !== LINK_NONE
        ? scopedClients.find((c) => c.id === clientId)
        : undefined
    const selectedOpportunity =
      opportunityId !== LINK_NONE
        ? scopedOpportunities.find((opp) => opp.id === opportunityId)
        : undefined

    const scope = resolveTaskScope(user, selectedClient, selectedOpportunity)
    const links = {
      clientId: clientId === LINK_NONE ? null : clientId,
      opportunityId: opportunityId === LINK_NONE ? null : opportunityId,
    }

    if (task) {
      updateTask(task.id, {
        title: trimmedTitle,
        dueDate,
        priority,
        ...links,
        ...scope,
      })
      toast.success("Zadanie zostało zaktualizowane")
    } else {
      const newTask: Task = {
        id: createNextTaskId(tasks),
        title: trimmedTitle,
        dueDate,
        priority,
        completed: false,
        ...links,
        ...scope,
      }
      addTask(newTask)
      toast.success("Zadanie zostało dodane")
    }

    handleOpenChange(false)
  }

  const canSubmit = title.trim().length > 0 && dueDate.length > 0

  const dialog = (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger !== undefined ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : !isEdit && openProp === undefined ? (
        <DialogTrigger asChild>
          <Button>
            <PlusIcon data-icon="inline-start" />
            Nowe zadanie
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edytuj zadanie" : "Nowe zadanie"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Zmień tytuł, termin, priorytet lub powiązania z klientem i dealem."
              : "Tytuł, termin, priorytet i opcjonalne powiązanie z klientem lub dealem."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="task-title">Tytuł</FieldLabel>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="np. Przygotować ofertę"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="task-due">Termin</FieldLabel>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="task-priority">Priorytet</FieldLabel>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as TaskPriority)}
              >
                <SelectTrigger id="task-priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {TASK_PRIORITY_OPTIONS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {TASK_PRIORITY_LABELS[p]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="task-client">Klient</FieldLabel>
              <Select value={clientId} onValueChange={handleClientChange}>
                <SelectTrigger id="task-client" className="w-full">
                  <SelectValue placeholder="Bez powiązania" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={LINK_NONE}>Bez powiązania</SelectItem>
                    {scopedClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="task-opportunity">Deal</FieldLabel>
              <Select
                value={opportunityId}
                onValueChange={setOpportunityId}
                disabled={opportunitiesForClient.length === 0}
              >
                <SelectTrigger id="task-opportunity" className="w-full">
                  <SelectValue placeholder="Bez powiązania" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={LINK_NONE}>Bez powiązania</SelectItem>
                    {opportunitiesForClient.map((opp) => (
                      <SelectItem key={opp.id} value={opp.id}>
                        {opp.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              Zapisz
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  return dialog
}

export function TaskEditButton({
  user,
  task,
}: {
  user: DemoUser
  task: Task
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <TaskFormDialog
      user={user}
      task={task}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Edytuj zadanie „${task.title}”`}
        >
          <PencilIcon />
        </Button>
      }
    />
  )
}
