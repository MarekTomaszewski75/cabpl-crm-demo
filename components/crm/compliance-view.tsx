"use client"

import type { ComponentType, SVGProps } from "react"
import {
  Building2Icon,
  GitBranchIcon,
  HeadphonesIcon,
  InfoIcon,
  LayersIcon,
  LockIcon,
  ServerIcon,
  ShieldCheckIcon,
  UserCheckIcon,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ROADMAP_PHASES = [
  {
    phase: "Etap 1",
    label: "Quick Win (demo)",
    status: "active" as const,
    items: [
      "Lejek sprzedażowy i forecast",
      "Klienci, leady, zadania, kalendarz",
      "RBAC na danych (symulacja ról)",
      "Panel zarządczy (KPI)",
    ],
  },
  {
    phase: "Etap 2",
    label: "Enterprise CRM",
    status: "planned" as const,
    items: [
      "Client 360° — pełny widok relacji i produktów",
      "Case Management — obsługa spraw i eskalacji",
      "Integracje kanałów (e-mail, telefonia, spotkania)",
    ],
  },
] as const

const VARIANT_ROWS = [
  {
    aspect: "Prototyp UI",
    variantA: "Ten sam prototyp",
    variantB: "Ten sam prototyp",
  },
  {
    aspect: "Narracja",
    variantA: "Najszybszy time-to-market, niższy koszt startu",
    variantB: "Wyższy koszt startu, ten sam kod bazy pod CRM Enterprise",
  },
  {
    aspect: "Etap 2",
    variantA: "Możliwa wymiana warstwy integracyjnej",
    variantB: "Rozbudowa bez „zaorania” — preferowany kierunek",
  },
  {
    aspect: "Technologia",
    variantA: "Nakładka na istniejące procesy",
    variantB: "Fundament pod AI i pełną rozbudowę",
  },
] as const

function ComplianceSectionCard({
  icon: Icon,
  title,
  description,
  bullets,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
  bullets: readonly string[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex list-disc flex-col gap-1.5 pl-4 text-sm text-foreground">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function ComplianceView() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-lg font-medium">Zgodność i roadmapa</h1>
        <p className="text-sm text-muted-foreground">
          Plan zgodności KNF oraz ścieżka rozwoju do Etapu 2 — treść
          prezentacyjna (statyczna).
        </p>
      </div>

      <Tabs defaultValue="compliance">
        <TabsList>
          <TabsTrigger value="compliance">Zgodność KNF</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmapa Etap 2</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="flex flex-col gap-4">
          <Alert>
            <ShieldCheckIcon />
            <AlertTitle>Quick Win projektowany pod wymogi KNF od początku</AlertTitle>
            <AlertDescription>
              Poniższe obszary opisują plan wdrożenia produkcyjnego — nie są
              certyfikatem tego prototypu. Demo działa lokalnie (
              <code className="rounded bg-muted px-1">npm run dev</code>
              ); produkcja wymaga pełnego IAM/SSO i audytu banku.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            <ComplianceSectionCard
              icon={UserCheckIcon}
              title="KYC i identyfikacja klienta"
              description="Zgodność z procesami bankowymi i nadzorem KNF."
              bullets={[
                "Weryfikacja kontrahentów korporacyjnych (beneficjenci, struktura)",
                "Aktualizacja danych KYC w cyklu relacji",
                "Powiązanie z systemami bankowymi w produkcji (Etap 2)",
              ]}
            />
            <ComplianceSectionCard
              icon={LockIcon}
              title="Tajemnica bankowa i dane"
              description="Ochrona informacji poufnych i danych osobowych."
              bullets={[
                "Klasyfikacja dostępu do danych klienta i szans",
                "Szyfrowanie w tranzycie i w spoczynku (produkcja)",
                "Rejestr audytowy operacji na danych CRM",
              ]}
            />
            <ComplianceSectionCard
              icon={LayersIcon}
              title="RBAC — plan produkcyjny"
              description="Kontrola dostępu oparta na rolach (demo = symulacja)."
              bullets={[
                "Demo: wybór roli na logowaniu (doradca / menedżer / zarząd)",
                "Produkcja: IAM/SSO banku, mapowanie grup AD",
                "Zakres danych: region, właściciel, widoczność modułów",
              ]}
            />
            <ComplianceSectionCard
              icon={ServerIcon}
              title="Hosting i infrastruktura"
              description="Ogólny kierunek — bez obietnic wdrożenia tego demo."
              bullets={[
                "Docelowo: środowisko banku (on-prem lub private cloud)",
                "Wysoka dostępność, backup, plan odtwarzania po awarii",
                "Ten prototyp: wyłącznie lokalnie, bez deploy produkcyjnego",
              ]}
            />
          </div>

          <Alert>
            <InfoIcon />
            <AlertTitle>Symulacja bezpieczeństwa w demo</AlertTitle>
            <AlertDescription>
              Przełączenie roli na ekranie logowania pokazuje różne widoki
              danych (RBAC). To nie zastępuje audytu KNF ani certyfikacji
              środowiska produkcyjnego.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="roadmap" className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranchIcon />
                Oś rozwoju produktu
              </CardTitle>
              <CardDescription>
                Etap 1 dostarcza wartość operacyjną w 3–6 miesięcy; Etap 2
                rozszerza CRM o widok 360° i obsługę spraw.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {ROADMAP_PHASES.map((phase, index) => (
                <div key={phase.phase} className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        phase.status === "active" ? "default" : "secondary"
                      }
                    >
                      {phase.phase}
                    </Badge>
                    <span className="text-sm font-medium">{phase.label}</span>
                    {phase.status === "active" ? (
                      <Badge variant="outline">Bieżący zakres demo</Badge>
                    ) : null}
                  </div>
                  <ul className="flex list-disc flex-col gap-1.5 pl-4 text-sm">
                    {phase.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {index < ROADMAP_PHASES.length - 1 ? <Separator /> : null}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2Icon />
                  Client 360°
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Pełny widok relacji: produkty, szanse, kontakty, dokumenty i
                historia we wszystkich kanałach — poza zakresem Etapu 1.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeadphonesIcon />
                  Case Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Obsługa spraw klienta, eskalacje, SLA i workflow zespołów
                wsparcia — zapowiedź Enterprise CRM.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranchIcon />
                  Integracje kanałów
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                E-mail, telefonia, systemy spotkań i core bankowy — Etap 1:
                import / ręczne wpisy; Etap 2: pełna synchronizacja.
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Wariant wdrożenia — A vs B</CardTitle>
              <CardDescription>
                Ten sam prototyp UI; różnica w narracji sprzedażowej (
                requirements §7). Rekomendowany kierunek: wariant B.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aspekt</TableHead>
                    <TableHead>Wariant A — nakładka</TableHead>
                    <TableHead>Wariant B — fundament</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {VARIANT_ROWS.map((row) => (
                    <TableRow key={row.aspect}>
                      <TableCell className="font-medium">{row.aspect}</TableCell>
                      <TableCell>{row.variantA}</TableCell>
                      <TableCell>{row.variantB}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
