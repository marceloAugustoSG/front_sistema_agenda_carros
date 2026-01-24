import { useState, useEffect } from "react"
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
  IconPlus,
} from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { getClientes, getLembretes, addLembrete, updateLembrete, deleteLembrete, type Cliente, type Lembrete } from "@/utils/storage"

export default function LembretesPage() {
  const [lembretes, setLembretes] = useState<Lembrete[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "pendentes" | "concluidos">("todos")
  const [filtroPrioridade, setFiltroPrioridade] = useState<"todas" | "alta" | "media" | "baixa">("todas")
  const [modalAberto, setModalAberto] = useState<boolean>(false)

  useEffect(() => {
    setLembretes(getLembretes())
    setClientes(getClientes())
  }, [])

  const [formData, setFormData] = useState({
    clienteId: "",
    titulo: "",
    descricao: "",
    data: "",
    tipo: "contato" as Lembrete["tipo"],
    prioridade: "media" as Lembrete["prioridade"],
    veiculoId: "",
    veiculoDescricao: "",
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

    if (!formData.clienteId || !formData.titulo || !formData.data) {
      toast.error("Preencha pelo menos: Cliente, Título e Data")
      return
    }

    const cliente = clientes.find((c) => c.id === formData.clienteId)
    if (!cliente) {
      toast.error("Cliente não encontrado")
      return
    }

    const novoLembrete: Lembrete = {
      id: Date.now().toString(),
      clienteId: formData.clienteId,
      clienteNome: cliente.nome,
      titulo: formData.titulo,
      descricao: formData.descricao,
      data: formData.data,
      tipo: formData.tipo,
      prioridade: formData.prioridade,
      concluido: false,
      dataCriacao: new Date().toISOString().split("T")[0],
      veiculoId: formData.veiculoId || undefined,
      veiculoDescricao: formData.veiculoDescricao || undefined,
    }

    addLembrete(novoLembrete)

    setLembretes((prev) => [novoLembrete, ...prev])
    toast.success("Lembrete criado com sucesso!")

    setFormData({
      clienteId: "",
      titulo: "",
      descricao: "",
      data: "",
      tipo: "contato",
      prioridade: "media",
      veiculoId: "",
      veiculoDescricao: "",
    })

    setModalAberto(false)
  }

  const handleConcluir = (id: string) => {
    updateLembrete(id, { concluido: true })

    setLembretes((prev) =>
      prev.map((l) => (l.id === id ? { ...l, concluido: true } : l))
    )
    toast.success("Lembrete marcado como concluído!")
  }

  const handleExcluir = (id: string) => {
    deleteLembrete(id)

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
    return l.data === hoje
  })

  const lembretesAtrasados = lembretes.filter((l) => {
    if (l.concluido) return false
    const hoje = new Date().toISOString().split("T")[0]
    return l.data < hoje
  })

  const getIconTipo = (tipo: string) => {
    switch (tipo) {
      case "contato":
        return <IconPhone className="size-4 text-green-600" />
      case "followup":
        return <IconClock className="size-4 text-blue-600" />
      case "reuniao":
        return <IconCalendar className="size-4 text-purple-600" />
      case "outro":
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
    return new Date(data + "T00:00:00").toLocaleDateString("pt-BR")
  }

  const getStatusData = (data: string) => {
    const hoje = new Date().toISOString().split("T")[0]
    if (data < hoje) return "atrasado"
    if (data === hoje) return "hoje"
    return "futuro"
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Meus Lembretes</CardTitle>
              <CardDescription>Lembretes e follow-ups agendados</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={modalAberto} onOpenChange={setModalAberto}>
                <DialogTrigger asChild>
                  <Button>
                    <IconPlus className="size-4 mr-2" />
                    Criar Lembrete
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Criar Lembrete</DialogTitle>
                    <DialogDescription>
                      Agende um lembrete para contatar o cliente
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
                          {clientes.map((cliente) => (
                            <SelectItem key={cliente.id} value={cliente.id}>
                              {cliente.nome} - {cliente.telefone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

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

                    <div className="space-y-2">
                      <Label htmlFor="data">
                        Data <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="data"
                        name="data"
                        type="date"
                        value={formData.data}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>

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
                          <SelectItem value="contato">Contato</SelectItem>
                          <SelectItem value="followup">Follow-up</SelectItem>
                          <SelectItem value="reuniao">Reunião</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

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

                    <div className="space-y-2">
                      <Label htmlFor="veiculoDescricao">Veículo Relacionado (opcional)</Label>
                      <Input
                        id="veiculoDescricao"
                        name="veiculoDescricao"
                        value={formData.veiculoDescricao}
                        onChange={handleChange}
                        placeholder="Ex: Toyota Corolla 2024"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Criar Lembrete
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
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
                const statusData = getStatusData(lembrete.data)
                return (
                  <div
                    key={lembrete.id}
                    className={`border-2 rounded-lg p-4 space-y-3 ${lembrete.concluido
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
                          </div>
                          {lembrete.descricao && (
                            <p className="text-sm text-muted-foreground">{lembrete.descricao}</p>
                          )}
                          {lembrete.veiculoDescricao && (
                            <p className="text-sm text-muted-foreground">
                              Veículo: {lembrete.veiculoDescricao}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <IconCalendar className="size-3" />
                              <span>{formatarData(lembrete.data)}</span>
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
  )
}

