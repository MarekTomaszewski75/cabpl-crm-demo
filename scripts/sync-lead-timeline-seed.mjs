/**
 * Synchronizuje daty zdarzeń leada w seedzie — nic nie może być przed lead.createdAt.
 * Uruchom: node scripts/sync-lead-timeline-seed.mjs
 */
import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const read = (file) =>
  JSON.parse(fs.readFileSync(path.join(root, "data", file), "utf8"))
const write = (file, data) =>
  fs.writeFileSync(
    path.join(root, "data", file),
    `${JSON.stringify(data, null, 2)}\n`,
  )

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

const leads = read("leads.json")
const leadById = new Map(leads.map((lead) => [lead.id, lead]))

function activityPriority(act) {
  switch (act.type) {
    case "lead_created":
      return 0
    case "lead_note":
      return 10
    case "phone":
    case "email":
    case "meeting":
    case "chat":
    case "activity":
      return 15
    case "lead_status_changed":
      return 30
    case "lead_task_completed":
      return 45
    case "lead_won":
    case "lead_lost":
      return 60
    default:
      return 20
  }
}

function gapAfterActivity(act) {
  if (act.type === "lead_status_changed") return DAY
  if (act.type === "lead_won" || act.type === "lead_lost") return DAY
  if (act.type === "lead_task_completed") return 6 * HOUR
  return 4 * HOUR
}

function syncActivities(activities) {
  for (const lead of leads) {
    const created = new Date(lead.createdAt).getTime()
    const leadActs = activities.filter((a) => a.leadId === lead.id)

    for (const act of leadActs) {
      if (act.type === "lead_created") {
        act.occurredAt = lead.createdAt
      }
    }

    const rest = leadActs
      .filter((a) => a.type !== "lead_created")
      .sort((a, b) => {
        const order = activityPriority(a) - activityPriority(b)
        if (order !== 0) return order
        return new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
      })

    let cursor = created + HOUR
    for (const act of rest) {
      act.occurredAt = new Date(cursor).toISOString()
      cursor += gapAfterActivity(act)
    }
  }
  return activities
}

function syncDocuments(documents, activities) {
  for (const lead of leads) {
    const created = new Date(lead.createdAt).getTime()
    const leadDocs = documents
      .filter((d) => d.leadId === lead.id)
      .sort((a, b) => a.id.localeCompare(b.id))

    const maxActivity = activities
      .filter((a) => a.leadId === lead.id)
      .reduce((max, a) => Math.max(max, new Date(a.occurredAt).getTime()), created)

    let cursor = Math.max(created + DAY, maxActivity + 2 * HOUR)
    for (const doc of leadDocs) {
      doc.uploadedAt = new Date(cursor).toISOString()
      cursor += 6 * HOUR
    }
  }
  return documents
}

function syncTasks(tasks, activities) {
  for (const lead of leads) {
    const created = new Date(lead.createdAt)
    const minDue = new Date(created)
    minDue.setUTCDate(minDue.getUTCDate() + 3)

    const leadTasks = tasks.filter((t) => t.leadId === lead.id)
    for (const task of leadTasks) {
      const due = new Date(`${task.dueDate}T12:00:00.000Z`)
      if (due.getTime() < minDue.getTime()) {
        task.dueDate = minDue.toISOString().slice(0, 10)
      }
    }

    for (const act of activities) {
      if (
        act.leadId !== lead.id ||
        act.type !== "lead_task_completed"
      ) {
        continue
      }
      const task = leadTasks.find((t) => t.title === act.note && t.completed)
      if (!task) continue
      const due = new Date(`${task.dueDate}T16:00:00.000Z`).getTime()
      const createdTask = new Date(created.getTime() + 2 * DAY).getTime()
      act.occurredAt = new Date(
        Math.max(createdTask, Math.min(due, Date.now())),
      ).toISOString()
    }
  }
  return tasks
}

function validate(activities, documents, tasks) {
  const issues = []
  for (const lead of leads) {
    const created = new Date(lead.createdAt).getTime()
    const check = (label, iso) => {
      if (new Date(iso).getTime() < created) {
        issues.push(`${lead.id}: ${label} ${iso} < ${lead.createdAt}`)
      }
    }
    for (const a of activities.filter((x) => x.leadId === lead.id)) {
      check(a.type, a.occurredAt)
    }
    for (const d of documents.filter((x) => x.leadId === lead.id)) {
      check("document", d.uploadedAt)
    }
    for (const t of tasks.filter((x) => x.leadId === lead.id)) {
      const taskCreated = new Date(`${t.dueDate}T12:00:00.000Z`)
      taskCreated.setUTCDate(taskCreated.getUTCDate() - 2)
      check(`task-${t.id}`, taskCreated.toISOString())
    }
  }
  return issues
}

const activities = syncActivities(read("lead-activities.json"))
const documents = syncDocuments(read("lead-documents.json"), activities)
const tasks = syncTasks(read("tasks.json"), activities)

const issues = validate(activities, documents, tasks)
if (issues.length > 0) {
  console.error("Pozostałe naruszenia chronologii:")
  for (const issue of issues) console.error(" -", issue)
  process.exit(1)
}

write("lead-activities.json", activities)
write("lead-documents.json", documents)
write("tasks.json", tasks)
console.log("Zsynchronizowano lead-activities, lead-documents, tasks — OK")
