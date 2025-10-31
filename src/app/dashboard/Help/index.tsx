import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HelpPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajuda</CardTitle>
          <CardDescription>
          Página de Ajuda aqui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Conteúdo da página Ajuda será implementado aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

