"use client"

import * as React from "react"
import {
  CalendarIcon,
  ChevronDownIcon,
  MailIcon,
  PhoneIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react"
import { toast } from "sonner"
import {
  ActivityParticipantsField,
  ActivityResponsibleUserField,
} from "@/components/crm/activity-people-fields"
import { CompanyActivityPrioritySelect } from "@/components/crm/company-activity-priority"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ACTIVITY_CHANNEL_TYPE_OPTIONS,
  type ActivityChannelType,
} from "@/lib/crm/activity-channel-types"
import {
  activityTitlePlaceholder,
  applyActivityType,
  emptyActivityFormState,
  toAddCompanyActivityInput,
  type CompanyActivityFormState,
} from "@/lib/crm/company-activity-types"
import { toLocalDateKey } from "@/lib/crm/local-date"
import { createNextTaskId } from "@/lib/crm/task-id"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Deal, Task } from "@/types/crm"
import type { LucideIcon } from "lucide-react"

const TYPE_ICONS: Record<ActivityChannelType, LucideIcon> = {
  activity: ZapIcon,
  phone: PhoneIcon,
  meeting: CalendarIcon,
  video_call: VideoIcon,
  email: MailIcon,
}

type DealActivityFormProps = {
  deal: Deal
}

const FOLLOW_UP_OFFSET_DAYS = 3

function addDaysToDateKey(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T12:00:00`)
  date.setDate(date.getDate() + days)
  return toLocalDateKey(date)
}

function ActivityOutlinedField({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="rounded-md border border-input bg-background px-3 pb-2.5 pt-3">
        <span className="absolute -top-2.5 left-2.5 bg-background px-1 text-xs text-muted-foreground">
          {label}
        </span>
        {children}
      </div>
    </div>
  )
}

function ActivityCollapsibleSection({
  title,
  count,
  open,
  onOpenChange,
  children,
}: {
  title: string
  count: number
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-border pt-3">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 rounded-md px-1 py-1 text-left text-sm font-medium hover:bg-muted/60"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          {title}
          <Badge
            variant="secondary"
            className="size-5 justify-center rounded-full px-0 text-[10px] tabular-nums"
          >
            {count}
          </Badge>
        </span>
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open ? children : null}
    </div>
  )
}

export function DealActivityForm({ deal }: DealActivityFormProps) {
  const { user } = useSession()
  const { users, contacts, tasks, addDealChannelActivity, addTask } =
    useDemoData()
  const [state, setState] = React.useState<CompanyActivityFormState>(() =>
    emptyActivityFormState(user?.id ?? null),
  )
  const [peopleOpen, setPeopleOpen] = React.useState(true)
  const [createFollowUp, setCreateFollowUp] = React.useState(true)
  const isMeeting = state.type === "meeting"

  React.useEffect(() => {
    if (user && !state.responsibleUserId) {
      setState((prev) => ({ ...prev, responsibleUserId: user.id }))
    }
  }, [user, state.responsibleUserId])

  const preferredContactIds = deal.contactId ? [deal.contactId] : []

  const peopleCount =
    (state.responsibleUserId ? 1 : 0) +
    state.participantUserIds.length +
    state.participantContactIds.length

  function patch(partial: Partial<CompanyActivityFormState>) {
    setState((prev) => ({ ...prev, ...partial }))
  }

  function handleReset() {
    setState(emptyActivityFormState(user?.id ?? null))
    setPeopleOpen(true)
    setCreateFollowUp(true)
  }

  function handleSave() {
    if (!user) return
    const input = toAddCompanyActivityInput(state, { users, contacts })
    addDealChannelActivity(deal.id, input, user)

    if (isMeeting && createFollowUp) {
      const task: Task = {
        id: createNextTaskId(tasks),
        title: `Follow-up: ${input.title}`,
        dueDate: addDaysToDateKey(state.startDate, FOLLOW_UP_OFFSET_DAYS),
        priority: "medium",
        completed: false,
        clientId: deal.clientId,
        opportunityId: deal.id,
        ownerId: state.responsibleUserId ?? user.id,
        regionId: deal.regionId,
      }
      addTask(task)
    }

    handleReset()
    toast.success(
      isMeeting
        ? createFollowUp
          ? "Spotkanie zapisane w kalendarzu. Utworzono zadanie follow-up."
          : "Spotkanie zapisane w kalendarzu"
        : "Aktywność została zapisana",
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="deal-activity-title">Nazwa</FieldLabel>
          <Input
            id="deal-activity-title"
            placeholder={activityTitlePlaceholder(state.type)}
            value={state.title}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </Field>

        <div className="flex flex-wrap gap-1">
          {ACTIVITY_CHANNEL_TYPE_OPTIONS.map((option) => {
            const Icon = TYPE_ICONS[option.id]
            const selected = state.type === option.id
            return (
              <Button
                key={option.id}
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 gap-1.5 px-2",
                  selected
                    ? "text-primary hover:text-primary"
                    : "text-muted-foreground",
                )}
                onClick={() =>
                  setState((prev) => applyActivityType(prev, option.id))
                }
                aria-pressed={selected}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="text-sm font-normal">{option.label}</span>
              </Button>
            )
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field>
            <FieldLabel htmlFor="deal-activity-start-date">
              Data rozpoczęcia
            </FieldLabel>
            <Input
              id="deal-activity-start-date"
              type="date"
              value={state.startDate}
              onChange={(e) => patch({ startDate: e.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="deal-activity-end-date">
              Data zakończenia
            </FieldLabel>
            <Input
              id="deal-activity-end-date"
              type="date"
              value={state.endDate}
              onChange={(e) => patch({ endDate: e.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="deal-activity-start-time">Godzina od</FieldLabel>
            <Input
              id="deal-activity-start-time"
              type="time"
              value={state.startTime}
              disabled={state.allDay}
              onChange={(e) => patch({ startTime: e.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="deal-activity-end-time">Godzina do</FieldLabel>
            <Input
              id="deal-activity-end-time"
              type="time"
              value={state.endTime}
              disabled={state.allDay}
              onChange={(e) => patch({ endTime: e.target.value })}
            />
          </Field>
        </div>

        <Field orientation="horizontal" className="items-center">
          <Checkbox
            id="deal-activity-all-day"
            checked={state.allDay}
            onCheckedChange={(checked) =>
              patch({ allDay: checked === true })
            }
          />
          <FieldLabel htmlFor="deal-activity-all-day" className="font-normal">
            Na cały dzień
          </FieldLabel>
        </Field>

        {isMeeting ? (
          <Field orientation="horizontal" className="items-center">
            <Checkbox
              id="deal-activity-follow-up"
              checked={createFollowUp}
              onCheckedChange={(checked) => setCreateFollowUp(checked === true)}
            />
            <FieldLabel
              htmlFor="deal-activity-follow-up"
              className="font-normal"
            >
              Utwórz zadanie follow-up (termin +{FOLLOW_UP_OFFSET_DAYS} dni)
            </FieldLabel>
          </Field>
        ) : null}

        <CompanyActivityPrioritySelect
          value={state.priority}
          onValueChange={(priority) => patch({ priority })}
        />

        <Field>
          <FieldLabel htmlFor="deal-activity-note">Notatka</FieldLabel>
          <Textarea
            id="deal-activity-note"
            placeholder="Dodaj notatkę"
            value={state.note}
            onChange={(e) => patch({ note: e.target.value })}
          />
        </Field>

        <ActivityCollapsibleSection
          title="Ludzie"
          count={peopleCount}
          open={peopleOpen}
          onOpenChange={setPeopleOpen}
        >
          <div className="flex flex-col gap-3">
            <ActivityOutlinedField label="Osoba odpowiedzialna">
              <ActivityResponsibleUserField
                value={state.responsibleUserId}
                onChange={(responsibleUserId) => patch({ responsibleUserId })}
              />
            </ActivityOutlinedField>

            <ActivityOutlinedField label="Uczestnicy">
              <ActivityParticipantsField
                participantUserIds={state.participantUserIds}
                participantContactIds={state.participantContactIds}
                preferredContactIds={preferredContactIds}
                onChange={({ participantUserIds, participantContactIds }) =>
                  patch({ participantUserIds, participantContactIds })
                }
              />
            </ActivityOutlinedField>
          </div>
        </ActivityCollapsibleSection>
      </FieldGroup>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleReset}>
          Anuluj
        </Button>
        <Button type="button" onClick={handleSave}>
          Zapisz
        </Button>
      </div>
    </div>
  )
}
