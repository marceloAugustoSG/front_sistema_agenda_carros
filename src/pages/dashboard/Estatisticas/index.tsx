import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"

// Dados mockados para vendas
const vendasPorPeriodo = [
  { mes: "Jan", vendas: 12, valor: 1800000 },
  { mes: "Fev", vendas: 15, valor: 2250000 },
  { mes: "Mar", vendas: 18, valor: 2700000 },
  { mes: "Abr", vendas: 22, valor: 3300000 },
  { mes: "Mai", vendas: 20, valor: 3000000 },
  { mes: "Jun", vendas: 25, valor: 3750000 },
]

// Veículos mais procurados
const veiculosMaisProcurados = [
  { nome: "Toyota Corolla", interesses: 45, vendas: 12 },
  { nome: "Honda Civic", interesses: 38, vendas: 10 },
  { nome: "Volkswagen Gol", interesses: 32, vendas: 8 },
  { nome: "Ford Fiesta", interesses: 28, vendas: 7 },
  { nome: "Chevrolet Onix", interesses: 25, vendas: 6 },
]

// Distribuição por marca
const vendasPorMarca = [
  { name: "Toyota", value: 35, color: "#3b82f6" },
  { name: "Honda", value: 28, color: "#10b981" },
  { name: "Volkswagen", value: 22, color: "#f59e0b" },
  { name: "Ford", value: 15, color: "#ef4444" },
]

// Interesses vs Vendas
const interessesVsVendas = [
  { mes: "Jan", interesses: 65, vendas: 12, taxa: 18.5 },
  { mes: "Fev", interesses: 72, vendas: 15, taxa: 20.8 },
  { mes: "Mar", interesses: 85, vendas: 18, taxa: 21.2 },
  { mes: "Abr", interesses: 92, vendas: 22, taxa: 23.9 },
  { mes: "Mai", interesses: 88, vendas: 20, taxa: 22.7 },
  { mes: "Jun", interesses: 105, vendas: 25, taxa: 23.8 },
]

// Métricas principais
const metricas = {
  vendasMes: 25,
  valorTotal: 3750000,
  ticketMedio: 150000,
  taxaConversao: 23.8,
  clientesAtendidos: 105,
  interessesConvertidos: 25,
}

// Clientes mais ativos
const clientesMaisAtivos = [
  { nome: "João Silva", interesses: 5, ultimaInteracao: "2 dias atrás" },
  { nome: "Maria Santos", interesses: 4, ultimaInteracao: "1 dia atrás" },
  { nome: "Pedro Costa", interesses: 3, ultimaInteracao: "3 dias atrás" },
  { nome: "Ana Oliveira", interesses: 3, ultimaInteracao: "Hoje" },
  { nome: "Carlos Souza", interesses: 2, ultimaInteracao: "5 dias atrás" },
]

// Tempo médio no estoque
const tempoMedioEstoque = [
  { marca: "Toyota", dias: 12 },
  { marca: "Honda", dias: 15 },
  { marca: "Volkswagen", dias: 18 },
  { marca: "Ford", dias: 22 },
  { marca: "Chevrolet", dias: 25 },
]

export default function EstatisticasPage() {
  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vendas do Mês</CardDescription>
            <CardTitle className="text-3xl font-bold">{metricas.vendasMes}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <IconTrendingUp className="size-3" />
                +15%
              </Badge>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Valor Total Vendido</CardDescription>
            <CardTitle className="text-3xl font-bold">
              R$ {(metricas.valorTotal / 1000000).toFixed(1)}M
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <IconTrendingUp className="size-3" />
                +20%
              </Badge>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ticket Médio</CardDescription>
            <CardTitle className="text-3xl font-bold">
              R$ {(metricas.ticketMedio / 1000).toFixed(0)}k
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <IconTrendingUp className="size-3" />
                +5%
              </Badge>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taxa de Conversão</CardDescription>
            <CardTitle className="text-3xl font-bold">{metricas.taxaConversao}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <IconTrendingUp className="size-3" />
                +2.5%
              </Badge>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas ao Longo do Tempo */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas ao Longo do Tempo</CardTitle>
            <CardDescription>Evolução de vendas nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: "300px", minHeight: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={vendasPorPeriodo}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  style={{ cursor: "default" }}
                >
                  <defs>
                    <linearGradient id="colorVendasEstatisticas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--muted))"
                    strokeOpacity={0.3}
                  />
                  <XAxis
                    dataKey="mes"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                    cursor={{ fill: "transparent" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="vendas"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVendasEstatisticas)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Marca */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Marca</CardTitle>
            <CardDescription>Distribuição percentual de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: "300px", minHeight: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart style={{ cursor: "default" }}>
                  <Pie
                    data={vendasPorMarca}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vendasPorMarca.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                    cursor={{ fill: "transparent" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interesses vs Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Interesses vs Vendas</CardTitle>
          <CardDescription>Comparativo de interesses registrados e vendas realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: "100%", height: "300px", minHeight: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={interessesVsVendas}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                style={{ cursor: "default" }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis
                  dataKey="mes"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend />
                <Bar dataKey="interesses" fill="#8b5cf6" name="Interesses" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vendas" fill="#3b82f6" name="Vendas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Veículos Mais Procurados */}
        <Card>
          <CardHeader>
            <CardTitle>Veículos Mais Procurados</CardTitle>
            <CardDescription>Top 5 modelos com mais interesses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {veiculosMaisProcurados.map((veiculo, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{veiculo.nome}</p>
                    <Badge variant="outline">{veiculo.interesses} interesses</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{veiculo.vendas} vendas realizadas</span>
                    <span className="text-green-600 font-medium">
                      {((veiculo.vendas / veiculo.interesses) * 100).toFixed(1)}% conversão
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(veiculo.vendas / veiculo.interesses) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Clientes Mais Ativos */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes Mais Ativos</CardTitle>
            <CardDescription>Clientes com mais interesses registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientesMaisAtivos.map((cliente, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{cliente.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {cliente.interesses} interesses • {cliente.ultimaInteracao}
                    </p>
                  </div>
                  <Badge variant="outline">{cliente.interesses}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tempo Médio no Estoque */}
      <Card>
        <CardHeader>
          <CardTitle>Tempo Médio no Estoque</CardTitle>
          <CardDescription>Dias médios que veículos ficam em estoque por marca</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: "100%", height: "300px", minHeight: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tempoMedioEstoque}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                style={{ cursor: "default" }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--muted))"
                  strokeOpacity={0.3}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  dataKey="marca"
                  type="category"
                  width={80}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="dias" fill="#f59e0b" name="Dias" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights e Recomendações</CardTitle>
          <CardDescription>Análises automáticas para melhorar suas vendas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
              <IconTrendingUp className="size-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  Taxa de conversão em alta
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Sua taxa de conversão aumentou 2.5% este mês. Continue o bom trabalho!
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <IconTrendingUp className="size-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  Toyota Corolla é o mais procurado
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Este modelo tem 45 interesses e 12 vendas. Considere aumentar o estoque.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
              <IconTrendingDown className="size-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Chevrolet tem maior tempo no estoque
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Veículos Chevrolet ficam em média 25 dias no estoque. Revise estratégia de preço ou
                  marketing.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
