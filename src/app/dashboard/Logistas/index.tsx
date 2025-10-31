import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LogistasPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Logistas</CardTitle>
          <CardDescription>
            Gerencie sua equipe e membros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Conteúdo da página Team será implementado aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

