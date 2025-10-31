import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>
            Visualize e gere relatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Conteúdo da página Reports será implementado aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

