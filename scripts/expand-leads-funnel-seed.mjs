/**
 * Rozszerza seed leadów piramidą: najwięcej „new”, potem in_progress, won, lost.
 * Uruchom: node scripts/expand-leads-funnel-seed.mjs
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

const FUNNEL = [
  { status: "new", count: 28 },
  { status: "in_progress", count: 18 },
  { status: "won", count: 8 },
  { status: "lost", count: 6 },
]

const ADVISORS = [
  { ownerId: "user-anna", regionId: "mazowsze" },
  { ownerId: "user-piotr", regionId: "mazowsze" },
  { ownerId: "user-kasia", regionId: "malopolska" },
  { ownerId: "user-tomek", regionId: "pomorze" },
]

const COMPANY_NAMES = [
  "Alpine Components",
  "Baltic Trade Hub",
  "Carpathia Foods",
  "Delta Manufacturing",
  "EcoPack Solutions",
  "FreshPort Logistics",
  "Granite Build",
  "Helios Energy",
  "InterModal Spedycja",
  "Jura MedTech",
  "Karpaty Retail",
  "Lumen Software",
  "MarineTech Export",
  "Nordic Wind Ops",
  "Optima Pharma",
  "Pomerania Steel",
  "QuickServe Catering",
  "Rubin Hotels",
  "Solaris Farms",
  "TransBaltic Cargo",
  "Urban Development",
  "Vistula Print",
  "WestPomerania Fish",
  "Xenon Robotics",
  "Yacht Service Gdańsk",
  "Zakład Meblarski",
]

const LEAD_TOPICS = [
  "Kredyt obrotowy na sezon",
  "Leasing maszyn produkcyjnych",
  "Faktoring przy ekspansji",
  "Gwarancja przetargowa",
  "Pakiet transakcyjny korporacyjny",
  "Depozyt na kapitał obrotowy",
  "Linia kredytowa — rozszerzenie limitu",
  "Terminal płatniczy — nowe lokalizacje",
  "Finansowanie inwestycji ESG",
  "Akredytywa importowa",
]

const existing = read("leads.json")
const clients = read("clients.json")

let maxNum = 0
for (const lead of existing) {
  const match = /^lead-(\d+)$/.exec(lead.id)
  if (match) maxNum = Math.max(maxNum, Number(match[1]))
}

const generated = []
let seq = 0

for (const { status, count } of FUNNEL) {
  for (let i = 0; i < count; i++) {
    seq += 1
    maxNum += 1
    const advisor = ADVISORS[seq % ADVISORS.length]
    const pool = clients.filter((c) => c.ownerId === advisor.ownerId)
    const client = pool[seq % pool.length]
    const company = COMPANY_NAMES[seq % COMPANY_NAMES.length]
    const topic = LEAD_TOPICS[seq % LEAD_TOPICS.length]

    generated.push({
      id: `lead-${String(maxNum).padStart(3, "0")}`,
      name: `${topic} — ${company}`,
      status,
      contactId: null,
      comments: "",
      source: ["recommendation", "partner", "link", "phone_call"][seq % 4],
      leadType: ["hot", "warm", "cold", null][seq % 4],
      companyName: company,
      position: "",
      phones: [],
      emails: [],
      socialMedia: "",
      lostReason: status === "lost" ? "competitor_chosen" : null,
      opportunityId: null,
      clientId: client?.id ?? null,
      createdAt: `2026-0${1 + (seq % 5)}-${String(5 + (seq % 20)).padStart(2, "0")}T10:00:00.000Z`,
      ownerId: advisor.ownerId,
      regionId: advisor.regionId,
    })
  }
}

write("leads.json", [...existing, ...generated])
console.log(`Dodano ${generated.length} leadów (łącznie ${existing.length + generated.length}).`)
