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
  IconFileText,
  IconCheck,
  IconX,
  IconClock,
  IconCalendar,
  IconUser,
  IconCar,
  IconSearch,
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
import { getClientes, getVeiculos, getPropostas, addProposta, updateProposta, type Cliente, type Veiculo, type Proposta } from "@/utils/storage"

export default function PropostasPage() {
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [filtroStatus, setFiltroStatus] = useState<"todas" | "pendente" | "aceita" | "recusada" | "vencida">("todas")
  const [busca, setBusca] = useState("")
  const [modalAberto, setModalAberto] = useState(false)

  // Carregar dados do localStorage
  useEffect(() => {
    setPropostas(getPropostas())
    setClientes(getClientes())
    setVeiculos(getVeiculos())
  }, [])

  const [formData, setFormData] = useState({
    clienteId: "",
    veiculoId: "",
    valorVeiculo: "",
    desconto: "",
    formaPagamento: "Financiamento",
    entrada: "",
    numeroParcelas: "",
    valorParcela: "",
    validade: "",
    observacoes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Calcular valor final quando veículo ou desconto mudar
  const calcularValorFinal = () => {
    const valorVeiculo = parseFloat(formData.valorVeiculo) || 0
    const desconto = parseFloat(formData.desconto) || 0
    return Math.max(0, valorVeiculo - desconto)
  }

  // Quando selecionar veículo, preencher valor automaticamente
  const handleVeiculoChange = (veiculoId: string) => {
    const veiculo = veiculos.find((v) => v.id === veiculoId)
    if (veiculo) {
      setFormData((prev) => ({
        ...prev,
        veiculoId,
        valorVeiculo: veiculo.valor,
      }))
    } else {
      setFormData((prev) => ({ ...prev, veiculoId, valorVeiculo: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.clienteId || !formData.veiculoId || !formData.valorVeiculo || !formData.validade) {
      toast.error("Preencha pelo menos: Cliente, Veículo, Valor e Validade")
      return
    }

    const cliente = clientes.find((c) => c.id === formData.clienteId)
    const veiculo = veiculos.find((v) => v.id === formData.veiculoId)
    
    if (!cliente || !veiculo) {
      toast.error("Cliente ou veículo não encontrado")
      return
    }

    const valorFinal = calcularValorFinal()
    const numeroProposta = `PROP-${String(propostas.length + 1).padStart(3, "0")}`

    let parcelas = "-"
    if (formData.formaPagamento === "Financiamento" && formData.numeroParcelas && formData.valorParcela) {
      parcelas = `${formData.numeroParcelas}x R$ ${parseFloat(formData.valorParcela).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const novaProposta: Proposta = {
      id: Date.now().toString(),
      numero: numeroProposta,
      clienteId: formData.clienteId,
      clienteNome: cliente.nome,
      clienteTelefone: cliente.telefone,
      veiculoId: formData.veiculoId,
      veiculoDescricao: `${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}`,
      valorVeiculo: formData.valorVeiculo,
      desconto: formData.desconto || "0",
      valorFinal: valorFinal.toString(),
      formaPagamento: formData.formaPagamento,
      entrada: formData.entrada || "0",
      numeroParcelas: formData.numeroParcelas || "",
      valorParcela: formData.valorParcela || "",
      parcelas,
      validade: formData.validade,
      status: "pendente",
      observacoes: formData.observacoes,
      dataCriacao: new Date().toISOString().split("T")[0],
    }

    // Salvar no localStorage
    addProposta(novaProposta)

    // Atualizar estado
    setPropostas((prev) => [novaProposta, ...prev])
    toast.success("Proposta criada com sucesso!")

    setFormData({
      clienteId: "",
      veiculoId: "",
      valorVeiculo: "",
      desconto: "",
      formaPagamento: "Financiamento",
      entrada: "",
      numeroParcelas: "",
      valorParcela: "",
      validade: "",
      observacoes: "",
    })
    
    setModalAberto(false)
  }

  const handleStatusChange = (id: string, novoStatus: "pendente" | "aceita" | "recusada") => {
    // Atualizar no localStorage
    updateProposta(id, { status: novoStatus })
    
    // Atualizar estado
    setPropostas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: novoStatus } : p))
    )
    toast.success(`Status da proposta atualizado para ${novoStatus === "aceita" ? "aceita" : novoStatus === "recusada" ? "recusada" : "pendente"}`)
  }

  const propostasFiltradas = propostas.filter((proposta) => {
    const matchStatus = filtroStatus === "todas" || proposta.status === filtroStatus
    const matchBusca =
      busca === "" ||
      proposta.numero.toLowerCase().includes(busca.toLowerCase()) ||
      proposta.clienteNome.toLowerCase().includes(busca.toLowerCase()) ||
      proposta.veiculoDescricao.toLowerCase().includes(busca.toLowerCase())
    return matchStatus && matchBusca
  })

  const getStatusBadge = (status: string, validade: string) => {
    const hoje = new Date().toISOString().split("T")[0]
    const vencida = validade < hoje && status === "pendente"

    if (vencida) {
      return <Badge className="bg-red-600 text-white">Vencida</Badge>
    }

    switch (status) {
      case "aceita":
        return <Badge className="bg-green-600 text-white">Aceita</Badge>
      case "recusada":
        return <Badge className="bg-gray-600 text-white">Recusada</Badge>
      case "pendente":
        return <Badge className="bg-yellow-600 text-white">Pendente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatarData = (data: string) => {
    return new Date(data + "T00:00:00").toLocaleDateString("pt-BR")
  }

  const propostasPendentes = propostas.filter((p) => p.status === "pendente")
  const propostasAceitas = propostas.filter((p) => p.status === "aceita")
  const propostasVencidas = propostas.filter((p) => {
    const hoje = new Date().toISOString().split("T")[0]
    return p.validade < hoje && p.status === "pendente"
  })

  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Resumo de Propostas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs sm:text-sm">Total de Propostas</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold">{propostas.length}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <IconFileText className="size-3 sm:size-4 text-blue-600" />
              <span className="hidden sm:inline">Todas as propostas</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs sm:text-sm">Pendentes</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-yellow-600">
              {propostasPendentes.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <IconClock className="size-3 sm:size-4 text-yellow-600" />
              <span className="hidden sm:inline">Aguardando resposta</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs sm:text-sm">Aceitas</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-green-600">
              {propostasAceitas.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <IconCheck className="size-3 sm:size-4 text-green-600" />
              <span className="hidden sm:inline">Propostas aceitas</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs sm:text-sm">Vencidas</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-red-600">
              {propostasVencidas.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <IconX className="size-3 sm:size-4 text-red-600" />
              <span className="hidden sm:inline">Precisam atenção</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Propostas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Propostas</CardTitle>
              <CardDescription>Histórico de propostas enviadas</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Dialog open={modalAberto} onOpenChange={setModalAberto}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <IconPlus className="size-4 mr-2" />
                    Criar Proposta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Criar Proposta</DialogTitle>
                    <DialogDescription>
                      Gere uma proposta comercial para o cliente
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Cliente e Veículo na mesma linha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cliente */}
                <div className="space-y-2">
                  <Label htmlFor="clienteId">
                    Cliente <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.clienteId}
                    onValueChange={(value) => handleSelectChange("clienteId", value)}
                  >
                    <SelectTrigger id="clienteId" className="w-full">
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

                {/* Veículo */}
                <div className="space-y-2">
                  <Label htmlFor="veiculoId">
                    Veículo <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.veiculoId}
                    onValueChange={handleVeiculoChange}
                  >
                    <SelectTrigger id="veiculoId" className="w-full">
                      <SelectValue placeholder="Selecione o veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {veiculos.filter(v => v.status === "disponivel").map((veiculo) => (
                        <SelectItem key={veiculo.id} value={veiculo.id}>
                          {veiculo.marca} {veiculo.modelo} {veiculo.ano} - R$ {parseFloat(veiculo.valor || "0").toLocaleString("pt-BR")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Valor do Veículo */}
              <div className="space-y-2">
                <Label htmlFor="valorVeiculo">
                  Valor do Veículo (R$) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="valorVeiculo"
                  name="valorVeiculo"
                  type="number"
                  value={formData.valorVeiculo}
                  onChange={handleChange}
                  placeholder="150000"
                  required
                />
              </div>

              {/* Desconto */}
              <div className="space-y-2">
                <Label htmlFor="desconto">Desconto (R$)</Label>
                <Input
                  id="desconto"
                  name="desconto"
                  type="number"
                  value={formData.desconto}
                  onChange={handleChange}
                  placeholder="5000"
                />
              </div>

              {/* Valor Final (calculado) */}
              {formData.valorVeiculo && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Valor Final:</span>
                    <span className="text-lg font-bold text-primary">
                      R$ {calcularValorFinal().toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              )}

              {/* Forma de Pagamento */}
              <div className="space-y-2">
                <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                <Select
                  value={formData.formaPagamento}
                  onValueChange={(value) => handleSelectChange("formaPagamento", value)}
                >
                  <SelectTrigger id="formaPagamento">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="À vista">À vista</SelectItem>
                    <SelectItem value="Financiamento">Financiamento</SelectItem>
                    <SelectItem value="Consórcio">Consórcio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Entrada */}
              <div className="space-y-2">
                <Label htmlFor="entrada">Entrada (R$)</Label>
                <Input
                  id="entrada"
                  name="entrada"
                  type="number"
                  value={formData.entrada}
                  onChange={handleChange}
                  placeholder="30000"
                />
              </div>

              {/* Parcelas (se financiamento) */}
              {formData.formaPagamento === "Financiamento" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="numeroParcelas">Nº Parcelas</Label>
                    <Input
                      id="numeroParcelas"
                      name="numeroParcelas"
                      type="number"
                      value={formData.numeroParcelas}
                      onChange={handleChange}
                      placeholder="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valorParcela">Valor Parcela (R$)</Label>
                    <Input
                      id="valorParcela"
                      name="valorParcela"
                      type="number"
                      value={formData.valorParcela}
                      onChange={handleChange}
                      placeholder="2500"
                    />
                  </div>
                </div>
              )}

              {/* Validade */}
              <div className="space-y-2">
                <Label htmlFor="validade">
                  Validade <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="validade"
                  name="validade"
                  type="date"
                  value={formData.validade}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  placeholder="Observações sobre a proposta..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  rows={3}
                />
              </div>

                    <Button type="submit" className="w-full">
                      Criar Proposta
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <div className="relative w-full sm:w-[200px]">
                <IconSearch className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-8"
                />
              </div>
              <Select value={filtroStatus} onValueChange={(v: any) => setFiltroStatus(v)}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="aceita">Aceitas</SelectItem>
                  <SelectItem value="recusada">Recusadas</SelectItem>
                  <SelectItem value="vencida">Vencidas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            {propostasFiltradas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma proposta encontrada com os filtros aplicados.
              </div>
            ) : (
              <div className="space-y-4">
                {propostasFiltradas.map((proposta) => {
                  const hoje = new Date().toISOString().split("T")[0]
                  const vencida = proposta.validade < hoje && proposta.status === "pendente"
                  
                  return (
                    <div
                      key={proposta.id}
                      className={`border-2 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 ${
                        vencida
                          ? "border-red-300 bg-red-50/50 dark:bg-red-950/10"
                          : proposta.status === "pendente"
                            ? "border-yellow-200 bg-yellow-50/30 dark:bg-yellow-950/10"
                            : proposta.status === "aceita"
                              ? "border-green-200 bg-green-50/30 dark:bg-green-950/10"
                              : "border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-base sm:text-lg">{proposta.numero}</h3>
                            {getStatusBadge(proposta.status, proposta.validade)}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <IconUser className="size-3 sm:size-4 text-muted-foreground" />
                              <span className="font-medium">{proposta.clienteNome}</span>
                            </div>
                            <span className="text-muted-foreground hidden sm:inline">•</span>
                            <span className="text-muted-foreground text-xs sm:text-sm">{proposta.clienteTelefone}</span>
                          </div>

                          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            <IconCar className="size-3 sm:size-4 text-muted-foreground" />
                            <span className="break-words">{proposta.veiculoDescricao}</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 pt-2 border-t">
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Valor Veículo</p>
                              <p className="font-semibold text-xs sm:text-sm">
                                R$ {parseFloat(proposta.valorVeiculo).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                            {parseFloat(proposta.desconto) > 0 && (
                              <div>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">Desconto</p>
                                <p className="font-semibold text-green-600 text-xs sm:text-sm">
                                  - R$ {parseFloat(proposta.desconto).toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Valor Final</p>
                              <p className="font-semibold text-primary text-sm sm:text-lg">
                                R$ {parseFloat(proposta.valorFinal).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Forma Pagamento</p>
                              <p className="font-semibold text-xs sm:text-sm break-words">{proposta.formaPagamento}</p>
                            </div>
                          </div>

                          {proposta.formaPagamento === "Financiamento" && proposta.parcelas !== "-" && (
                            <div className="text-xs sm:text-sm">
                              <span className="text-muted-foreground">Entrada: </span>
                              <span className="font-medium">
                                R$ {parseFloat(proposta.entrada).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                              <span className="text-muted-foreground"> • Parcelas: </span>
                              <span className="font-medium break-words">{proposta.parcelas}</span>
                            </div>
                          )}

                          {proposta.observacoes && (
                            <p className="text-xs sm:text-sm text-muted-foreground italic break-words">
                              {proposta.observacoes}
                            </p>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <IconCalendar className="size-3" />
                              <span>Criada: {formatarData(proposta.dataCriacao)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <IconClock className="size-3" />
                              <span>Válida até: {formatarData(proposta.validade)}</span>
                            </div>
                          </div>
                        </div>

                        {proposta.status === "pendente" && (
                          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(proposta.id, "aceita")}
                              className="text-green-600 hover:text-green-700 flex-1 sm:flex-none text-xs sm:text-sm"
                            >
                              <IconCheck className="size-3 sm:size-4 mr-1" />
                              Aceitar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(proposta.id, "recusada")}
                              className="text-red-600 hover:text-red-700 flex-1 sm:flex-none text-xs sm:text-sm"
                            >
                              <IconX className="size-3 sm:size-4 mr-1" />
                              Recusar
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

