/**
 * Synchronizuje daty zdarzeń deala w seedzie — nic nie może być przed deal.createdAt.
 * Uruchom: node scripts/sync-deal-timeline-seed.mjs
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

const deals = read("opportunities.json")

function activityPriority(act) {
  switch (act.type) {
    case "deal_created":
      return 0
    case "deal_note":
      return 10
    case "phone":
    case "email":
    case "meeting":
    case "chat":
    case "activity":
      return 15
    case "deal_status_changed":
      return 30
    case "deal_task_completed":
      return 45
    case "deal_won":
    case "deal_lost":
      return 60
    default:
      return 20
  }
}

function gapAfterActivity(act) {
  if (act.type === "deal_status_changed") return DAY
  if (act.type === "deal_won" || act.type === "deal_lost") return DAY
  if (act.type === "deal_task_completed") return 6 * HOUR
  return 4 * HOUR
}

function syncActivities(activities) {
  for (const deal of deals) {
    const created = new Date(deal.createdAt).getTime()
    const dealActs = activities.filter((a) => a.dealId === deal.id)

    for (const act of dealActs) {
      if (act.type === "deal_created") {
        act.occurredAt = deal.createdAt
      }
    }

    const rest = dealActs
      .filter((a) => a.type !== "deal_created")
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
  for (const deal of deals) {
    const created = new Date(deal.createdAt).getTime()
    const dealDocs = documents
      .filter((d) => d.dealId === deal.id)
      .sort((a, b) => a.id.localeCompare(b.id))

    const maxActivity = activities
      .filter((a) => a.dealId === deal.id)
      .reduce((max, a) => Math.max(max, new Date(a.occurredAt).getTime()), created)

    let cursor = Math.max(created + DAY, maxActivity + 2 * HOUR)
    for (const doc of dealDocs) {
      doc.uploadedAt = new Date(cursor).toISOString()
      cursor += 6 * HOUR
    }
  }
  return documents
}

function syncTasks(tasks, activities) {
  for (const deal of deals) {
    const created = new Date(deal.createdAt)
    const minDue = new Date(created)
    minDue.setUTCDate(minDue.getUTCDate() + 3)

    const dealTasks = tasks.filter((t) => t.opportunityId === deal.id)
    for (const task of dealTasks) {
      const due = new Date(`${task.dueDate}T12:00:00.000Z`)
      if (due.getTime() < minDue.getTime()) {
        task.dueDate = minDue.toISOString().slice(0, 10)
      }
    }

    for (const act of activities) {
      if (
        act.dealId !== deal.id ||
        act.type !== "deal_task_completed"
      ) {
        continue
      }
      const task = dealTasks.find((t) => t.title === act.note && t.completed)
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
  for (const deal of deals) {
    const created = new Date(deal.createdAt).getTime()
    const check = (label, iso) => {
      if (new Date(iso).getTime() < created) {
        issues.push(`${deal.id}: ${label} ${iso} < ${deal.createdAt}`)
      }
    }
    for (const a of activities.filter((x) => x.dealId === deal.id)) {
      check(a.type, a.occurredAt)
    }
    for (const d of documents.filter((x) => x.dealId === deal.id)) {
      check("document", d.uploadedAt)
    }
    for (const t of tasks.filter((x) => x.opportunityId === deal.id)) {
      const taskCreated = new Date(`${t.dueDate}T12:00:00.000Z`)
      taskCreated.setUTCDate(taskCreated.getUTCDate() - 2)
      check(`task-${t.id}`, taskCreated.toISOString())
    }
  }
  return issues
}

const activities = syncActivities(read("deal-activities.json"))
const documents = syncDocuments(read("deal-documents.json"), activities)
const tasks = syncTasks(read("tasks.json"), activities)

const issues = validate(activities, documents, tasks)
if (issues.length > 0) {
  console.error("Pozostałe naruszenia chronologii:")
  for (const issue of issues) console.error(" -", issue)
  process.exit(1)
}

write("deal-activities.json", activities)
write("deal-documents.json", documents)
write("tasks.json", tasks)
console.log("Zsynchronizowano deal-activities, deal-documents, tasks — OK")
