import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Simulação de dados - em produção viria de uma API
const veiculosMock = [
  {
    id: "1",
    marca: "Toyota",
    modelo: "Corolla",
    ano: "2023",
    placa: "ABC-1234",
    cor: "Branco",
    valor: "150000",
    combustivel: "flex",
    quilometragem: "15000",
    status: "disponivel",
  },
  {
    id: "2",
    marca: "Honda",
    modelo: "Civic",
    ano: "2024",
    placa: "DEF-5678",
    cor: "Preto",
    valor: "180000",
    combustivel: "flex",
    quilometragem: "5000",
    status: "disponivel",
  },
  {
    id: "3",
    marca: "Ford",
    modelo: "Fiesta",
    ano: "2022",
    placa: "GHI-9012",
    cor: "Prata",
    valor: "80000",
    combustivel: "flex",
    quilometragem: "30000",
    status: "vendido",
  },
  {
    id: "4",
    marca: "Volkswagen",
    modelo: "Gol",
    ano: "2023",
    placa: "JKL-3456",
    cor: "Vermelho",
    valor: "70000",
    combustivel: "flex",
    quilometragem: "20000",
    status: "disponivel",
  },
]

export default function EstoquePage() {
  const [filtroMarca, setFiltroMarca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [busca, setBusca] = useState("")

  const veiculosFiltrados = veiculosMock.filter((veiculo) => {
    const matchMarca = !filtroMarca || veiculo.marca.toLowerCase().includes(filtroMarca.toLowerCase())
    const matchStatus = filtroStatus === "todos" || veiculo.status === filtroStatus
    const matchBusca =
      !busca ||
      veiculo.marca.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.modelo.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.placa.toLowerCase().includes(busca.toLowerCase())

    return matchMarca && matchStatus && matchBusca
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disponivel":
        return <Badge className="bg-green-600">Disponível</Badge>
      case "reservado":
        return <Badge className="bg-yellow-600">Reservado</Badge>
      case "vendido":
        return <Badge variant="outline">Vendido</Badge>
      case "manutencao":
        return <Badge className="bg-orange-600">Em Manutenção</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCombustivelLabel = (combustivel: string) => {
    const labels: Record<string, string> = {
      flex: "Flex",
      gasolina: "Gasolina",
      etanol: "Etanol",
      diesel: "Diesel",
      eletrico: "Elétrico",
      hibrido: "Híbrido",
    }
    return labels[combustivel] || combustivel
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estoque de Veículos</CardTitle>
          <CardDescription>
            Visualize e gerencie os veículos disponíveis no estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Buscar por marca, modelo ou placa..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <Input
              placeholder="Filtrar por marca..."
              value={filtroMarca}
              onChange={(e) => setFiltroMarca(e.target.value)}
            />
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="reservado">Reservado</SelectItem>
                <SelectItem value="vendido">Vendido</SelectItem>
                <SelectItem value="manutencao">Em Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Veículos */}
          {veiculosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum veículo encontrado com os filtros aplicados.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {veiculosFiltrados.map((veiculo) => (
                <Card key={veiculo.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {veiculo.marca} {veiculo.modelo}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {veiculo.ano} • {veiculo.cor}
                        </CardDescription>
                      </div>
                      {getStatusBadge(veiculo.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Placa:</span>
                        <p className="font-medium">{veiculo.placa}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Combustível:</span>
                        <p className="font-medium">{getCombustivelLabel(veiculo.combustivel)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quilometragem:</span>
                        <p className="font-medium">
                          {parseInt(veiculo.quilometragem).toLocaleString("pt-BR")} km
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Valor:</span>
                        <p className="font-medium text-lg text-primary">
                          R$ {parseFloat(veiculo.valor).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Estatísticas */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {veiculosMock.filter((v) => v.status === "disponivel").length}
                </p>
                <p className="text-sm text-muted-foreground">Disponíveis</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {veiculosMock.filter((v) => v.status === "reservado").length}
                </p>
                <p className="text-sm text-muted-foreground">Reservados</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {veiculosMock.filter((v) => v.status === "vendido").length}
                </p>
                <p className="text-sm text-muted-foreground">Vendidos</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{veiculosMock.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

