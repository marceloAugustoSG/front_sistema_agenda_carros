import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconTrendingUp, IconTrendingDown, IconBell, IconClock, IconCheck, IconSearch, IconCar, IconPhone, IconAlertCircle, IconChecklist } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { getVeiculos, getClientes, getInteresses, getPropostas, getLembretes, type Veiculo, type Lembrete, type Cliente, type Interesse, type Proposta } from "@/utils/storage"

export default function HomePage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [interesses, setInteresses] = useState<Interesse[]>([])
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [lembretes, setLembretes] = useState<Lembrete[]>([])

  useEffect(() => {
    setVeiculos(getVeiculos())
    setClientes(getClientes())
    setInteresses(getInteresses())
    setPropostas(getPropostas())
    setLembretes(getLembretes())
  }, [])

  const resumoHoje = {
    vendas: propostas.filter((p) => p.status === "aceita").length,
    clientesCadastrados: clientes.length,
    interessesCadastrados: interesses.length,
    veiculosAdicionados: veiculos.length,
  }

  const totais = {
    clientesAtivos: clientes.length,
    veiculosDisponiveis: veiculos.filter((v) => v.status === "disponivel").length,
    interessesAbertos: interesses.filter((i) => i.status === "pendente").length,
    taxaConversao: interesses.length > 0 ? ((propostas.filter((p) => p.status === "aceita").length / interesses.length) * 100).toFixed(1) : "0",
  }

  const interessesPendentes = interesses
    .filter((i) => i.status === "pendente")
    .slice(0, 5)
    .map((i) => ({
      id: i.id,
      clienteNome: i.clienteNome,
      veiculo: `${i.marca} ${i.modelo} ${i.ano}`,
      telefone: i.clienteTelefone,
      dataCadastro: i.dataCadastro,
      disponivel: veiculos.some(
        (v) =>
          v.marca.toLowerCase() === i.marca.toLowerCase() &&
          v.modelo.toLowerCase() === i.modelo.toLowerCase() &&
          v.ano === i.ano &&
          v.status === "disponivel"
      ),
    }))

  const atividadesRecentes: any[] = []

  const vendasUltimos7Dias: any[] = []

  // Ações do dia - tarefas prioritárias para o vendedor
  const hoje = new Date().toISOString().split("T")[0]
  
  // Adicionar interesses disponíveis às ações do dia
  const acoesInteresses = interessesPendentes
    .filter((i) => i.disponivel)
    .map((interesse) => ({
      id: `interesse-${interesse.id}`,
      tipo: "notificar",
      titulo: `Veículo disponível: ${interesse.veiculo}`,
      descricao: `Cliente ${interesse.clienteNome} demonstrou interesse e o veículo está disponível`,
      cliente: interesse.clienteNome,
      telefone: interesse.telefone,
      veiculo: interesse.veiculo,
      tempo: "Agora",
      prioridade: "alta" as const,
      acao: "notificar" as const,
      data: interesse.dataCadastro,
    }))
  
  const acoesLembretes = lembretes
    .filter((lembrete) => !lembrete.concluido)
    .map((lembrete) => {
      const dataLembrete = new Date(lembrete.data)
      const hojeDate = new Date(hoje)
      const diffTime = dataLembrete.getTime() - hojeDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      let tempo = ""
      let acao = "lembrete"
      
      if (diffDays < 0) {
        tempo = `${Math.abs(diffDays)} dia(s) atrás`
        acao = "lembrete" // Atrasado
      } else if (diffDays === 0) {
        tempo = "Hoje"
        acao = "lembrete"
      } else if (diffDays === 1) {
        tempo = "Amanhã"
        acao = "lembrete"
      } else {
        tempo = `Em ${diffDays} dias`
        acao = "lembrete"
      }

      // Buscar telefone do cliente
      const cliente = clientes.find((c) => c.id === lembrete.clienteId)
      const telefone = cliente ? cliente.telefone : ""

      return {
        id: lembrete.id,
        tipo: lembrete.tipo,
        titulo: lembrete.titulo,
        descricao: lembrete.descricao || "",
        cliente: lembrete.clienteNome,
        telefone: telefone,
        veiculo: lembrete.veiculoDescricao || "N/A",
        tempo: tempo,
        prioridade: lembrete.prioridade,
        acao: acao,
        data: lembrete.data,
      }
    })
    .filter((acao) => {
      // Mostrar apenas lembretes de hoje, atrasados ou próximos 3 dias
      const dataLembrete = new Date(acao.data)
      const hojeDate = new Date(hoje)
      const diffTime = dataLembrete.getTime() - hojeDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 3 || diffDays < 0
    })
    .sort((a, b) => {
      // Ordenar por: atrasados primeiro, depois por prioridade, depois por data
      const dataA = new Date(a.data)
      const dataB = new Date(b.data)
      const hojeDate = new Date(hoje)
      
      const atrasadoA = dataA < hojeDate
      const atrasadoB = dataB < hojeDate
      
      if (atrasadoA && !atrasadoB) return -1
      if (!atrasadoA && atrasadoB) return 1
      
      const prioridadeOrder = { alta: 3, media: 2, baixa: 1 }
      const prioridadeDiff = prioridadeOrder[b.prioridade as keyof typeof prioridadeOrder] - 
                            prioridadeOrder[a.prioridade as keyof typeof prioridadeOrder]
      
      if (prioridadeDiff !== 0) return prioridadeDiff
      
      return dataA.getTime() - dataB.getTime()
    })

  const acoesDoDia = [
    ...acoesInteresses,
    ...acoesLembretes,
  ]
    .sort((a, b) => {
      // Ordenar todas as ações: interesses primeiro (prioridade alta), depois lembretes
      if (a.acao === "notificar" && b.acao !== "notificar") return -1
      if (a.acao !== "notificar" && b.acao === "notificar") return 1
      
      // Se ambos são lembretes, manter ordenação anterior
      if (a.acao === "lembrete" && b.acao === "lembrete") {
        const dataA = new Date(a.data)
        const dataB = new Date(b.data)
        const hojeDate = new Date(hoje)
        
        const atrasadoA = dataA < hojeDate
        const atrasadoB = dataB < hojeDate
        
        if (atrasadoA && !atrasadoB) return -1
        if (!atrasadoA && atrasadoB) return 1
        
        const prioridadeOrder = { alta: 3, media: 2, baixa: 1 }
        const prioridadeDiff = prioridadeOrder[b.prioridade as keyof typeof prioridadeOrder] - 
                              prioridadeOrder[a.prioridade as keyof typeof prioridadeOrder]
        
        if (prioridadeDiff !== 0) return prioridadeDiff
        
        return dataA.getTime() - dataB.getTime()
      }
      
      return 0
    })
    .slice(0, 10) // Limitar a 10 ações

  const [buscaRapida, setBuscaRapida] = useState("")
  const [resultadosBusca, setResultadosBusca] = useState<Veiculo[]>([])

  const handleBusca = (valor: string) => {
    setBuscaRapida(valor)
    
    if (valor.trim() === "") {
      setResultadosBusca([])
      return
    }

    const termo = valor.toLowerCase().trim()
    const resultados = veiculos.filter(
      (veiculo) =>
        veiculo.marca.toLowerCase().includes(termo) ||
        veiculo.modelo.toLowerCase().includes(termo) ||
        `${veiculo.marca} ${veiculo.modelo}`.toLowerCase().includes(termo) ||
        veiculo.ano.includes(termo)
    )
    
    setResultadosBusca(resultados)
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Busca Rápida */}
      <Card className="border-2 border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <IconSearch className="size-5 text-primary" />
              <h2 className="text-lg font-semibold">Busca Rápida de Veículos</h2>
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Digite marca, modelo ou ano (ex: Corolla, Honda Civic, 2024)..."
                value={buscaRapida}
                onChange={(e) => handleBusca(e.target.value)}
                className="h-12 text-base pr-12"
              />
              <IconSearch className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            </div>

            {/* Resultados da Busca */}
            {buscaRapida.trim() !== "" && (
              <div className="space-y-2">
                {resultadosBusca.length > 0 ? (
                  <>
                    <p className="text-sm font-medium text-muted-foreground">
                      {resultadosBusca.length} veículo(s) encontrado(s):
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {resultadosBusca.map((veiculo) => (
                        <div
                          key={veiculo.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <IconCar className="size-4 text-primary" />
                              <p className="font-semibold">
                                {veiculo.marca} {veiculo.modelo} {veiculo.ano}
                              </p>
                              {veiculo.status === "disponivel" ? (
                                <Badge className="bg-green-600 text-white">Disponível</Badge>
                              ) : (
                                <Badge variant="outline">Indisponível</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>
                                {veiculo.cor} • Placa: {veiculo.placa}
                              </p>
                              <p className="font-medium text-primary">
                                R$ {parseFloat(veiculo.valor).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          </div>
                          {veiculo.status === "disponivel" && (
                            <Button size="sm" variant="outline" asChild className="ml-2">
                              <Link to="/dashboard/veiculos">Ver Detalhes</Link>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-4 border border-dashed rounded-lg text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Nenhum veículo encontrado com "{buscaRapida}"
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/dashboard/interesses">
                        Cliente quer este veículo? Cadastrar interesse
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações do Dia */}
      <Card className="border-2 border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconChecklist className="size-5 text-yellow-600" />
              <CardTitle>Ações do Dia</CardTitle>
            </div>
            <Badge className="bg-yellow-600 text-white">
              {acoesDoDia.length} ações pendentes
            </Badge>
          </div>
          <CardDescription>
            Tarefas prioritárias que precisam da sua atenção hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {acoesDoDia.map((acao) => {
              const getIcon = () => {
                switch (acao.tipo) {
                  case "notificar":
                    return <IconBell className="size-4" />
                  case "ligar":
                    return <IconPhone className="size-4" />
                  case "followup":
                    return <IconClock className="size-4" />
                  case "lembrete":
                    return <IconAlertCircle className="size-4" />
                  default:
                    return <IconChecklist className="size-4" />
                }
              }

              const getPrioridadeColor = () => {
                switch (acao.prioridade) {
                  case "alta":
                    return "border-red-300 bg-red-50 dark:bg-red-950/20"
                  case "media":
                    return "border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20"
                  case "baixa":
                    return "border-blue-300 bg-blue-50 dark:bg-blue-950/20"
                  default:
                    return "border-gray-300"
                }
              }

              const getPrioridadeBadge = () => {
                switch (acao.prioridade) {
                  case "alta":
                    return <Badge className="bg-red-600 text-white">Alta</Badge>
                  case "media":
                    return <Badge className="bg-yellow-600 text-white">Média</Badge>
                  case "baixa":
                    return <Badge variant="outline">Baixa</Badge>
                  default:
                    return null
                }
              }

              return (
                <div
                  key={acao.id}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg ${getPrioridadeColor()} hover:shadow-md transition-all`}
                >
                  <div className="mt-1 text-primary">{getIcon()}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{acao.titulo}</p>
                          {getPrioridadeBadge()}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{acao.descricao}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-medium">{acao.cliente}</span>
                          <span>•</span>
                          <span>{acao.telefone}</span>
                          <span>•</span>
                          <span>{acao.veiculo}</span>
                          <span>•</span>
                          <span className="font-medium text-primary">{acao.tempo}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {acao.acao === "notificar" && (
                        <Button
                          size="sm"
                          asChild
                        >
                          <Link
                            to="/dashboard/interesses"
                            state={{
                              clienteNome: acao.cliente,
                              clienteTelefone: acao.telefone,
                              veiculo: acao.veiculo,
                            }}
                          >
                            Notificar Cliente
                          </Link>
                        </Button>
                      )}
                      {acao.acao === "ligar" && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={`tel:${acao.telefone.replace(/\D/g, "")}`}>
                            Ligar Agora
                          </a>
                        </Button>
                      )}
                      {acao.acao === "followup" && (
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/dashboard/clientes`}>Ver Cliente</Link>
                        </Button>
                      )}
                      {acao.acao === "lembrete" && (
                        <>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/dashboard/lembretes`}>Ver Lembretes</Link>
                          </Button>
                          {acao.telefone && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={`tel:${acao.telefone.replace(/\D/g, "")}`}>
                                Ligar
                              </a>
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {acoesDoDia.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma ação pendente para hoje</p>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/dashboard/lembretes">Ver todos os lembretes</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
            {interessesPendentes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum interesse pendente no momento</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/dashboard/interesses">Cadastrar Interesse</Link>
                </Button>
              </div>
            ) : (
              <>
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
                      <Button
                        size="sm"
                        asChild
                      >
                        <Link
                          to="/dashboard/interesses"
                          state={{
                            clienteNome: interesse.clienteNome,
                            clienteTelefone: interesse.telefone,
                            veiculo: interesse.veiculo,
                          }}
                        >
                          Notificar
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2" asChild>
                  <Link to="/dashboard/interesses">Ver todos os interesses</Link>
                </Button>
              </>
            )}
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
