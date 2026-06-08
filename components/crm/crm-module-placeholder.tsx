import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type CrmModulePlaceholderProps = {
  title: string
  description: string
}

export function CrmModulePlaceholder({
  title,
  description,
}: CrmModulePlaceholderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Moduł w przygotowaniu — pełna funkcjonalność w kolejnych user stories.
        </p>
      </CardContent>
    </Card>
  )
}
