
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardHome() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Página Home</CardTitle>
          <CardDescription>
            Página home aqui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Conteúdo da página Home será implementado aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

