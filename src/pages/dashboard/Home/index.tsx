import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconTrendingUp, IconTrendingDown, IconBell, IconClock, IconCheck } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

// Dados mockados
const resumoHoje = {
  vendas: 3,
  clientesCadastrados: 5,
  interessesCadastrados: 8,
  veiculosAdicionados: 2,
}

const totais = {
  clientesAtivos: 127,
  veiculosDisponiveis: 45,
  interessesAbertos: 23,
  taxaConversao: 18.5,
}

const interessesPendentes = [
  {
    id: "1",
    clienteNome: "João Silva",
    veiculo: "Toyota Corolla 2024",
    telefone: "(11) 99999-9999",
    dataCadastro: "Hoje, 14:30",
    disponivel: true,
  },
  {
    id: "2",
    clienteNome: "Maria Santos",
    veiculo: "Honda Civic 2023",
    telefone: "(11) 88888-8888",
    dataCadastro: "Hoje, 10:15",
    disponivel: true,
  },
  {
    id: "3",
    clienteNome: "Pedro Costa",
    veiculo: "Ford Fiesta 2022",
    telefone: "(11) 77777-7777",
    dataCadastro: "Ontem, 16:45",
    disponivel: false,
  },
]

const atividadesRecentes = [
  {
    tipo: "cliente",
    descricao: "Novo cliente cadastrado: Ana Oliveira",
    tempo: "há 15 minutos",
  },
  {
    tipo: "interesse",
    descricao: "Interesse registrado: Volkswagen Gol 2023",
    tempo: "há 32 minutos",
  },
  {
    tipo: "venda",
    descricao: "Venda realizada: Toyota Corolla 2023",
    tempo: "há 1 hora",
  },
  {
    tipo: "notificacao",
    descricao: "Cliente notificado: João Silva - Honda Civic disponível",
    tempo: "há 2 horas",
  },
  {
    tipo: "veiculo",
    descricao: "Novo veículo adicionado: Ford Ranger 2024",
    tempo: "há 3 horas",
  },
]

const vendasUltimos7Dias = [
  { dia: "Seg", vendas: 2 },
  { dia: "Ter", vendas: 4 },
  { dia: "Qua", vendas: 3 },
  { dia: "Qui", vendas: 5 },
  { dia: "Sex", vendas: 6 },
  { dia: "Sáb", vendas: 4 },
  { dia: "Dom", vendas: 3 },
]

export default function DashboardHome() {
  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Resumo do Dia */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vendas Hoje</CardDescription>
            <CardTitle className="text-3xl font-bold">{resumoHoje.vendas}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <IconTrendingUp className="size-3" />
                +25%
              </Badge>
              <span className="text-muted-foreground">vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Clientes Cadastrados</CardDescription>
            <CardTitle className="text-3xl font-bold">{resumoHoje.clientesCadastrados}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <IconTrendingUp className="size-3" />
                +2
              </Badge>
              <span className="text-muted-foreground">novos hoje</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Interesses Registrados</CardDescription>
            <CardTitle className="text-3xl font-bold">{resumoHoje.interessesCadastrados}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <IconTrendingUp className="size-3" />
                +3
              </Badge>
              <span className="text-muted-foreground">novos hoje</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Veículos Adicionados</CardDescription>
            <CardTitle className="text-3xl font-bold">{resumoHoje.veiculosAdicionados}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">
                <IconTrendingDown className="size-3" />
                -1
              </Badge>
              <span className="text-muted-foreground">vs ontem</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interesses Pendentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Interesses Pendentes</CardTitle>
                <CardDescription>
                  Clientes aguardando notificação sobre veículos
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                <IconBell className="size-3 mr-1" />
                {interessesPendentes.filter((i) => i.disponivel).length} disponíveis
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {interessesPendentes.map((interesse) => (
              <div
                key={interesse.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{interesse.clienteNome}</p>
                    {interesse.disponivel && (
                      <Badge className="bg-green-600 text-white">Disponível</Badge>
                    )}
                    {!interesse.disponivel && (
                      <Badge variant="outline">Aguardando</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{interesse.veiculo}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {interesse.telefone} • {interesse.dataCadastro}
                  </p>
                </div>
                {interesse.disponivel && (
                  <Button size="sm" asChild>
                    <Link to="/dashboard/interesses">Notificar</Link>
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2" asChild>
              <Link to="/dashboard/interesses">Ver todos os interesses</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Cards Informativos */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardDescription>Total de Clientes</CardDescription>
              <CardTitle className="text-2xl font-bold">{totais.clientesAtivos}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconTrendingUp className="size-4 text-green-600" />
                <span>+12 este mês</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Veículos Disponíveis</CardDescription>
              <CardTitle className="text-2xl font-bold">{totais.veiculosDisponiveis}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCheck className="size-4 text-green-600" />
                <span>Em estoque</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Taxa de Conversão</CardDescription>
              <CardTitle className="text-2xl font-bold">{totais.taxaConversao}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconTrendingUp className="size-4 text-green-600" />
                <span>+2.5% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Interesses em Aberto</CardDescription>
              <CardTitle className="text-2xl font-bold">{totais.interessesAbertos}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconClock className="size-4 text-yellow-600" />
                <span>Aguardando estoque</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas dos Últimos 7 Dias</CardTitle>
            <CardDescription>Performance de vendas na semana</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={vendasUltimos7Dias}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="dia"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Area
                  type="monotone"
                  dataKey="vendas"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorVendas)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {atividadesRecentes.map((atividade, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="mt-1">
                    {atividade.tipo === "venda" && (
                      <div className="size-2 rounded-full bg-green-500" />
                    )}
                    {atividade.tipo === "cliente" && (
                      <div className="size-2 rounded-full bg-blue-500" />
                    )}
                    {atividade.tipo === "interesse" && (
                      <div className="size-2 rounded-full bg-purple-500" />
                    )}
                    {atividade.tipo === "notificacao" && (
                      <div className="size-2 rounded-full bg-yellow-500" />
                    )}
                    {atividade.tipo === "veiculo" && (
                      <div className="size-2 rounded-full bg-orange-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{atividade.descricao}</p>
                    <p className="text-xs text-muted-foreground mt-1">{atividade.tempo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
