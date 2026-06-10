/**
 * Rozszerza seed dealów piramidą lejka: najwięcej „new”, malejąco w kolejnych
 * etapach, najmniej „won” / „lost”.
 * Uruchom: node scripts/expand-deals-funnel-seed.mjs
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

const PIPELINE_MIDDLE = {
  "pcat-credit": [
    "credit_qualification",
    "credit_analysis",
    "credit_offer",
    "credit_committee",
  ],
  "pcat-leasing-op": [
    "leasing_needs",
    "leasing_offer",
    "leasing_risk",
    "leasing_negotiation",
  ],
  "pcat-factoring": [
    "factoring_buyers",
    "factoring_portfolio",
    "factoring_offer",
    "factoring_signing",
  ],
  "pcat-guarantees": [
    "guarantee_contract",
    "guarantee_pricing",
    "guarantee_approval",
    "guarantee_issuance",
  ],
  "pcat-accounts": [
    "accounts_qualification",
    "accounts_proposal",
    "accounts_onboarding",
    "accounts_activation",
  ],
  "pcat-deposits": [
    "deposit_liquidity",
    "deposit_offer",
    "deposit_acceptance",
    "deposit_opening",
  ],
}

const PRODUCTS_BY_CATEGORY = {
  "pcat-credit": ["prod-001", "prod-002", "prod-014"],
  "pcat-leasing-op": ["prod-003", "prod-015"],
  "pcat-factoring": ["prod-004", "prod-016"],
  "pcat-guarantees": ["prod-005", "prod-006", "prod-017"],
  "pcat-accounts": ["prod-007", "prod-018"],
  "pcat-deposits": ["prod-008", "prod-013"],
}

const DEAL_NAME_PREFIX = {
  "pcat-credit": "Kredyt",
  "pcat-leasing-op": "Leasing",
  "pcat-factoring": "Faktoring",
  "pcat-guarantees": "Gwarancja",
  "pcat-accounts": "Pakiet transakcyjny",
  "pcat-deposits": "Depozyt korporacyjny",
}

/** Liczba dealów per status w każdej kategorii lejka (malejąco). */
const FUNNEL_COUNTS = {
  new: 20,
  middle: [14, 10, 7, 5],
  won: 4,
  lost: 3,
}

const ADVISOR_WEIGHTS = [
  { ownerId: "user-anna", regionId: "mazowsze", weight: 36 },
  { ownerId: "user-piotr", regionId: "mazowsze", weight: 36 },
  { ownerId: "user-kasia", regionId: "malopolska", weight: 14 },
  { ownerId: "user-tomek", regionId: "pomorze", weight: 14 },
]

function stepProbability(categoryId, status) {
  if (status === "won") return 100
  if (status === "lost") return 0
  const workflow = ["new", ...PIPELINE_MIDDLE[categoryId]]
  const index = workflow.indexOf(status)
  if (index < 0) return 10
  const last = workflow.length - 1
  if (last <= 0) return 10
  return Math.round(10 + (index / last) * 70)
}

function pickAdvisor(index) {
  const total = ADVISOR_WEIGHTS.reduce((s, a) => s + a.weight, 0)
  let cursor = index % total
  for (const advisor of ADVISOR_WEIGHTS) {
    if (cursor < advisor.weight) return advisor
    cursor -= advisor.weight
  }
  return ADVISOR_WEIGHTS[0]
}

function pickClient(clients, ownerId, index) {
  const pool = clients.filter((c) => c.ownerId === ownerId)
  if (pool.length === 0) {
    const regionClients = clients.filter(
      (c) =>
        ADVISOR_WEIGHTS.find((a) => a.ownerId === ownerId)?.regionId ===
        c.regionId,
    )
    return regionClients[index % regionClients.length]?.id ?? "client-001"
  }
  return pool[index % pool.length].id
}

function amountForStatus(status, seed) {
  const base = 350000 + (seed % 12) * 275000
  if (status === "new") return base
  if (status === "won") return Math.round(base * 1.1)
  if (status === "lost") return Math.round(base * 0.85)
  return base + (seed % 5) * 180000
}

function createdAtForStatus(status, seq) {
  const day = status === "won" || status === "lost" ? 10 + (seq % 40) : 1 + (seq % 120)
  const month = status === "new" ? 4 + (seq % 2) : 1 + (seq % 4)
  const m = String(month).padStart(2, "0")
  const d = String(Math.min(day, 28)).padStart(2, "0")
  return `2026-${m}-${d}T08:00:00.000Z`
}

function expectedCloseDate(status, seq) {
  if (status === "won" || status === "lost") {
    const d = 1 + (seq % 28)
    return `2026-05-${String(d).padStart(2, "0")}`
  }
  const month = 6 + (seq % 4)
  const d = 1 + (seq % 25)
  return `2026-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

function buildDeal({
  id,
  categoryId,
  status,
  ownerId,
  regionId,
  clientId,
  seq,
}) {
  const products = PRODUCTS_BY_CATEGORY[categoryId]
  const productId = products[seq % products.length]
  const probability = stepProbability(categoryId, status)
  const amount = amountForStatus(status, seq)
  const isWon = status === "won"
  const isLost = status === "lost"
  const prefix = DEAL_NAME_PREFIX[categoryId]

  return {
    id,
    name: `${prefix} — szansa ${seq}`,
    clientId,
    contactId: null,
    productId,
    pipelineCategoryId: categoryId,
    comments: "",
    source: "recommendation",
    dealType: null,
    amount,
    currency: "PLN",
    status,
    lostReason: isLost ? "competitor_chosen" : null,
    finishedByUserId: isWon || isLost ? ownerId : null,
    finishedAt: isWon || isLost ? createdAtForStatus(status, seq + 20) : null,
    firstFinishedByUserId: isWon || isLost ? ownerId : null,
    createdAt: createdAtForStatus(status, seq),
    probability,
    expectedCloseDate: expectedCloseDate(status, seq),
    ownerId,
    regionId,
  }
}

const existing = read("opportunities.json")
const clients = read("clients.json")

let maxNum = 0
for (const deal of existing) {
  const match = /^opp-(\d+)$/.exec(deal.id)
  if (match) maxNum = Math.max(maxNum, Number(match[1]))
}

const generated = []
let seq = 0

for (const categoryId of Object.keys(PIPELINE_MIDDLE)) {
  const statuses = [
    { status: "new", count: FUNNEL_COUNTS.new },
    ...PIPELINE_MIDDLE[categoryId].map((status, i) => ({
      status,
      count: FUNNEL_COUNTS.middle[i],
    })),
    { status: "won", count: FUNNEL_COUNTS.won },
    { status: "lost", count: FUNNEL_COUNTS.lost },
  ]

  for (const { status, count } of statuses) {
    for (let i = 0; i < count; i++) {
      seq += 1
      maxNum += 1
      const advisor = pickAdvisor(seq)
      const clientId = pickClient(clients, advisor.ownerId, seq)
      generated.push(
        buildDeal({
          id: `opp-${String(maxNum).padStart(3, "0")}`,
          categoryId,
          status,
          ownerId: advisor.ownerId,
          regionId: advisor.regionId,
          clientId,
          seq,
        }),
      )
    }
  }
}

const merged = [...existing, ...generated]
write("opportunities.json", merged)

const byStatus = {}
for (const d of merged) {
  byStatus[d.status] = (byStatus[d.status] || 0) + 1
}

console.log(`Dodano ${generated.length} dealów (łącznie ${merged.length}).`)
console.log("Rozkład statusów:", byStatus)
