import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfiguracoesPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
          <CardDescription>
            Página de configurações aqui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Conteúdo da página configurações será implementado aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

