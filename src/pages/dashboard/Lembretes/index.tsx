import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  IconBell,
  IconPhone,
  IconCalendar,
  IconClock,
  IconCheck,
  IconX,
  IconUser,
  IconAlertCircle,
} from "@tabler/icons-react"
import { Link } from "react-router-dom"

// Dados mockados de clientes
const clientesMock = [
  { id: "1", nome: "João Silva", telefone: "(11) 99999-9999" },
  { id: "2", nome: "Maria Santos", telefone: "(11) 88888-8888" },
  { id: "3", nome: "Pedro Costa", telefone: "(11) 77777-7777" },
  { id: "4", nome: "Ana Oliveira", telefone: "(11) 66666-6666" },
  { id: "5", nome: "Carlos Souza", telefone: "(11) 55555-5555" },
]

// Lembretes mockados
const lembretesMock = [
  {
    id: "1",
    clienteId: "1",
    clienteNome: "João Silva",
    clienteTelefone: "(11) 99999-9999",
    titulo: "Ligar sobre proposta",
    descricao: "Cliente quer ver proposta do Corolla 2024",
    dataLembrete: "2024-02-15",
    hora: "14:00",
    tipo: "ligar",
    prioridade: "alta",
    concluido: false,
    veiculoRelacionado: "Toyota Corolla 2024",
  },
  {
    id: "2",
    clienteId: "2",
    clienteNome: "Maria Santos",
    clienteTelefone: "(11) 88888-8888",
    titulo: "Follow-up - 3 dias",
    descricao: "Fazer follow-up após interesse no Civic",
    dataLembrete: "2024-02-14",
    hora: "10:00",
    tipo: "followup",
    prioridade: "media",
    concluido: false,
    veiculoRelacionado: "Honda Civic 2023",
  },
  {
    id: "3",
    clienteId: "3",
    clienteNome: "Pedro Costa",
    clienteTelefone: "(11) 77777-7777",
    titulo: "Enviar informações",
    descricao: "Enviar ficha técnica do Fiesta",
    dataLembrete: "2024-02-13",
    hora: "16:00",
    tipo: "lembrete",
    prioridade: "baixa",
    concluido: true,
    veiculoRelacionado: "Ford Fiesta 2022",
  },
]

export default function LembretesPage() {
  const [lembretes, setLembretes] = useState(lembretesMock)
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "pendentes" | "concluidos">("todos")
  const [filtroPrioridade, setFiltroPrioridade] = useState<"todas" | "alta" | "media" | "baixa">("todas")

  const [formData, setFormData] = useState({
    clienteId: "",
    titulo: "",
    descricao: "",
    dataLembrete: "",
    hora: "",
    tipo: "ligar",
    prioridade: "media",
    veiculoRelacionado: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.clienteId || !formData.titulo || !formData.dataLembrete || !formData.hora) {
      toast.error("Preencha pelo menos: Cliente, Título, Data e Hora")
      return
    }

    const cliente = clientesMock.find((c) => c.id === formData.clienteId)
    if (!cliente) {
      toast.error("Cliente não encontrado")
      return
    }

    const novoLembrete = {
      id: Date.now().toString(),
      clienteId: formData.clienteId,
      clienteNome: cliente.nome,
      clienteTelefone: cliente.telefone,
      titulo: formData.titulo,
      descricao: formData.descricao,
      dataLembrete: formData.dataLembrete,
      hora: formData.hora,
      tipo: formData.tipo as "ligar" | "followup" | "lembrete",
      prioridade: formData.prioridade as "alta" | "media" | "baixa",
      concluido: false,
      veiculoRelacionado: formData.veiculoRelacionado,
    }

    setLembretes((prev) => [novoLembrete, ...prev])
    toast.success("Lembrete criado com sucesso!")

    setFormData({
      clienteId: "",
      titulo: "",
      descricao: "",
      dataLembrete: "",
      hora: "",
      tipo: "ligar",
      prioridade: "media",
      veiculoRelacionado: "",
    })
  }

  const handleConcluir = (id: string) => {
    setLembretes((prev) =>
      prev.map((l) => (l.id === id ? { ...l, concluido: true } : l))
    )
    toast.success("Lembrete marcado como concluído!")
  }

  const handleExcluir = (id: string) => {
    setLembretes((prev) => prev.filter((l) => l.id !== id))
    toast.success("Lembrete removido!")
  }

  const lembretesFiltrados = lembretes.filter((lembrete) => {
    const matchStatus =
      filtroStatus === "todos" ||
      (filtroStatus === "pendentes" && !lembrete.concluido) ||
      (filtroStatus === "concluidos" && lembrete.concluido)

    const matchPrioridade =
      filtroPrioridade === "todas" || lembrete.prioridade === filtroPrioridade

    return matchStatus && matchPrioridade
  })

  const lembretesHoje = lembretes.filter((l) => {
    if (l.concluido) return false
    const hoje = new Date().toISOString().split("T")[0]
    return l.dataLembrete === hoje
  })

  const lembretesAtrasados = lembretes.filter((l) => {
    if (l.concluido) return false
    const hoje = new Date().toISOString().split("T")[0]
    return l.dataLembrete < hoje
  })

  const getIconTipo = (tipo: string) => {
    switch (tipo) {
      case "ligar":
        return <IconPhone className="size-4 text-green-600" />
      case "followup":
        return <IconClock className="size-4 text-blue-600" />
      case "lembrete":
        return <IconBell className="size-4 text-yellow-600" />
      default:
        return <IconAlertCircle className="size-4" />
    }
  }

  const getBadgePrioridade = (prioridade: string) => {
    switch (prioridade) {
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

  const formatarData = (data: string) => {
    const date = new Date(data + "T00:00:00")
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusData = (data: string) => {
    const hoje = new Date().toISOString().split("T")[0]
    if (data < hoje) return "atrasado"
    if (data === hoje) return "hoje"
    return "futuro"
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Resumo de Lembretes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lembretes Hoje</CardDescription>
            <CardTitle className="text-3xl font-bold">{lembretesHoje.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconCalendar className="size-4 text-blue-600" />
              <span>Para hoje</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lembretes Atrasados</CardDescription>
            <CardTitle className="text-3xl font-bold text-red-600">
              {lembretesAtrasados.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconAlertCircle className="size-4 text-red-600" />
              <span>Precisam atenção</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Lembretes</CardDescription>
            <CardTitle className="text-3xl font-bold">{lembretes.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconBell className="size-4 text-yellow-600" />
              <span>
                {lembretes.filter((l) => !l.concluido).length} pendentes
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Criar Lembrete */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Criar Lembrete</CardTitle>
            <CardDescription>Agende um lembrete para contatar o cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="clienteId">
                  Cliente <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.clienteId}
                  onValueChange={(value) => handleSelectChange("clienteId", value)}
                >
                  <SelectTrigger id="clienteId">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientesMock.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome} - {cliente.telefone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo">
                  Título <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ex: Ligar sobre proposta"
                  required
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Detalhes do lembrete..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  rows={3}
                />
              </div>

              {/* Data e Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataLembrete">
                    Data <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="dataLembrete"
                    name="dataLembrete"
                    type="date"
                    value={formData.dataLembrete}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hora">
                    Hora <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="hora"
                    name="hora"
                    type="time"
                    value={formData.hora}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Tipo */}
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => handleSelectChange("tipo", value)}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ligar">Ligar</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                    <SelectItem value="lembrete">Lembrete</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prioridade */}
              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select
                  value={formData.prioridade}
                  onValueChange={(value) => handleSelectChange("prioridade", value)}
                >
                  <SelectTrigger id="prioridade">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Veículo Relacionado */}
              <div className="space-y-2">
                <Label htmlFor="veiculoRelacionado">Veículo Relacionado (opcional)</Label>
                <Input
                  id="veiculoRelacionado"
                  name="veiculoRelacionado"
                  value={formData.veiculoRelacionado}
                  onChange={handleChange}
                  placeholder="Ex: Toyota Corolla 2024"
                />
              </div>

              <Button type="submit" className="w-full">
                Criar Lembrete
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Lembretes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Meus Lembretes</CardTitle>
                <CardDescription>Lembretes e follow-ups agendados</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={filtroStatus} onValueChange={(v: any) => setFiltroStatus(v)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendentes">Pendentes</SelectItem>
                    <SelectItem value="concluidos">Concluídos</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filtroPrioridade}
                  onValueChange={(v: any) => setFiltroPrioridade(v)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {lembretesFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum lembrete encontrado com os filtros aplicados.
              </div>
            ) : (
              <div className="space-y-3">
                {lembretesFiltrados.map((lembrete) => {
                  const statusData = getStatusData(lembrete.dataLembrete)
                  return (
                    <div
                      key={lembrete.id}
                      className={`border-2 rounded-lg p-4 space-y-3 ${
                        lembrete.concluido
                          ? "bg-muted/50 opacity-60"
                          : statusData === "atrasado"
                            ? "border-red-300 bg-red-50/50 dark:bg-red-950/10"
                            : statusData === "hoje"
                              ? "border-yellow-300 bg-yellow-50/50 dark:bg-yellow-950/10"
                              : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">{getIconTipo(lembrete.tipo)}</div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3
                                className={`font-semibold ${lembrete.concluido ? "line-through" : ""}`}
                              >
                                {lembrete.titulo}
                              </h3>
                              {getBadgePrioridade(lembrete.prioridade)}
                              {lembrete.concluido && (
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                  Concluído
                                </Badge>
                              )}
                              {!lembrete.concluido && statusData === "atrasado" && (
                                <Badge className="bg-red-600 text-white">Atrasado</Badge>
                              )}
                              {!lembrete.concluido && statusData === "hoje" && (
                                <Badge className="bg-yellow-600 text-white">Hoje</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <IconUser className="size-4 text-muted-foreground" />
                              <span className="font-medium">{lembrete.clienteNome}</span>
                              <span className="text-muted-foreground">
                                • {lembrete.clienteTelefone}
                              </span>
                            </div>
                            {lembrete.descricao && (
                              <p className="text-sm text-muted-foreground">{lembrete.descricao}</p>
                            )}
                            {lembrete.veiculoRelacionado && (
                              <p className="text-sm text-muted-foreground">
                                Veículo: {lembrete.veiculoRelacionado}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <IconCalendar className="size-3" />
                                <span>{formatarData(lembrete.dataLembrete)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <IconClock className="size-3" />
                                <span>{lembrete.hora}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {!lembrete.concluido && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConcluir(lembrete.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <IconCheck className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExcluir(lembrete.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <IconX className="size-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

