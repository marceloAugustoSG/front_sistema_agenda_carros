import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  IconUser,
  IconPhone,
  IconMail,
  IconSearch,
  IconClock,
  IconCar,
  IconBell,
  IconCheck,
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
import {
  getClientes,
  addCliente,
  getInteresses,
  getPropostas,
  getLembretes,
  type Cliente,
} from "@/utils/storage"

type HistoricoItem = {
  id: string
  tipo: "interesse" | "contato" | "venda" | "notificacao" | "cadastro" | "followup" | "reuniao" | "outro"
  descricao: string
  data: string
  detalhes?: string
}

type FormDataCliente = {
  nome: string
  telefone: string
  email: string
  cpf: string
  endereco: string
  observacoes: string
}

export default function ClientesPage() {
  const [formData, setFormData] = useState<FormDataCliente>({
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
    endereco: "",
    observacoes: "",
  })

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busca, setBusca] = useState<string>("")
  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(null)
  const [modalAberto, setModalAberto] = useState<boolean>(false)

  // Carregar clientes do localStorage ao montar o componente
  useEffect(() => {
    const clientesCarregados = getClientes()
    setClientes(clientesCarregados)
  }, [])

  // Função para buscar histórico do cliente
  const getHistoricoCliente = (clienteId: string): HistoricoItem[] => {
    const historico: HistoricoItem[] = []
    const interesses = getInteresses()
    const propostas = getPropostas()
    const lembretes = getLembretes()
    const cliente = clientes.find((c) => c.id === clienteId)

    if (!cliente) return historico

    // 1. Cadastro do cliente
    historico.push({
      id: `cadastro-${cliente.id}`,
      tipo: "cadastro",
      descricao: "Cliente cadastrado no sistema",
      data: cliente.dataCadastro,
      detalhes: `Telefone: ${cliente.telefone}${cliente.email ? ` | Email: ${cliente.email}` : ""}`,
    })

    // 2. Interesses do cliente
    interesses
      .filter((i) => i.clienteId === clienteId)
      .forEach((interesse) => {
        historico.push({
          id: `interesse-${interesse.id}`,
          tipo: "interesse",
          descricao: `Interesse em ${interesse.marca} ${interesse.modelo} ${interesse.ano}`,
          data: interesse.dataCadastro,
          detalhes: interesse.observacoes || undefined,
        })
      })

    // 3. Propostas do cliente
    propostas
      .filter((p) => p.clienteId === clienteId)
      .forEach((proposta) => {
        const tipo = proposta.status === "aceita" ? "venda" : "contato"
        historico.push({
          id: `proposta-${proposta.id}`,
          tipo,
          descricao: `Proposta ${proposta.numero} - ${proposta.veiculoDescricao}`,
          data: proposta.dataCriacao,
          detalhes: `Valor: R$ ${parseFloat(proposta.valorFinal).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} | Status: ${proposta.status}`,
        })
      })

    // 4. Lembretes do cliente
    lembretes
      .filter((l) => l.clienteId === clienteId)
      .forEach((lembrete) => {
        historico.push({
          id: `lembrete-${lembrete.id}`,
          tipo: lembrete.tipo,
          descricao: lembrete.titulo,
          data: lembrete.dataCriacao,
          detalhes: lembrete.descricao || undefined,
        })
      })

    // Ordenar por data (mais recente primeiro)
    return historico.sort((a, b) => {
      // Converter datas no formato brasileiro (dd/mm/yyyy) ou ISO (yyyy-mm-dd)
      const parseDate = (dateStr: string): Date => {
        if (dateStr.includes("/")) {
          // Formato brasileiro: dd/mm/yyyy
          const [dia, mes, ano] = dateStr.split("/")
          return new Date(`${ano}-${mes}-${dia}`)
        } else {
          // Formato ISO: yyyy-mm-dd
          return new Date(dateStr)
        }
      }
      
      const dataA = parseDate(a.data)
      const dataB = parseDate(b.data)
      return dataB.getTime() - dataA.getTime()
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.telefone) {
      toast.error("Por favor, preencha pelo menos nome e telefone")
      return
    }

    // Verificar se o telefone já existe
    const telefoneExiste = clientes.some(
      (c) => c.telefone === formData.telefone
    )
    if (telefoneExiste) {
      toast.error("Já existe um cliente cadastrado com este telefone")
      return
    }

    const novoCliente: Cliente = {
      id: Date.now().toString(),
      nome: formData.nome,
      telefone: formData.telefone,
      email: formData.email,
      cpf: formData.cpf,
      endereco: formData.endereco,
      observacoes: formData.observacoes,
      dataCadastro: new Date().toLocaleDateString("pt-BR"),
    }

    // Salvar no localStorage
    addCliente(novoCliente)

    // Atualizar estado
    setClientes((prev) => [novoCliente, ...prev])
    toast.success("Cliente cadastrado com sucesso!")

    setFormData({
      nome: "",
      telefone: "",
      email: "",
      cpf: "",
      endereco: "",
      observacoes: "",
    })
    setModalAberto(false)
  }

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.telefone.includes(busca) ||
      cliente.email.toLowerCase().includes(busca.toLowerCase())
  )

  const clienteAtual = clienteSelecionado
    ? clientes.find((c) => c.id === clienteSelecionado)
    : null

  const historicoCliente = clienteSelecionado ? getHistoricoCliente(clienteSelecionado) : []

  const getIconTipo = (tipo: string) => {
    switch (tipo) {
      case "interesse":
        return <IconCar className="size-4 text-blue-600" />
      case "contato":
        return <IconPhone className="size-4 text-green-600" />
      case "venda":
        return <IconCheck className="size-4 text-green-600" />
      case "notificacao":
        return <IconBell className="size-4 text-yellow-600" />
      case "cadastro":
        return <IconUser className="size-4 text-purple-600" />
      case "followup":
        return <IconPhone className="size-4 text-blue-600" />
      case "reuniao":
        return <IconCheck className="size-4 text-indigo-600" />
      case "outro":
        return <IconClock className="size-4 text-gray-600" />
      default:
        return <IconClock className="size-4 text-gray-600" />
    }
  }

  const getBadgeTipo = (tipo: string) => {
    switch (tipo) {
      case "interesse":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Interesse</Badge>
      case "contato":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Contato</Badge>
      case "venda":
        return <Badge className="bg-green-600 text-white">Venda</Badge>
      case "notificacao":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Notificação</Badge>
      case "cadastro":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Cadastro</Badge>
      case "followup":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Follow-up</Badge>
      case "reuniao":
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700">Reunião</Badge>
      case "outro":
        return <Badge variant="outline">Outro</Badge>
      default:
        return <Badge variant="outline">Outro</Badge>
    }
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Clientes Cadastrados</CardTitle>
              <CardDescription>Visualize e gerencie seus clientes</CardDescription>
            </div>
            <Dialog open={modalAberto} onOpenChange={setModalAberto}>
              <DialogTrigger asChild>
                <Button>
                  <IconPlus className="size-4 mr-2" />
                  Cadastrar Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Cliente</DialogTitle>
                  <DialogDescription>
                    Cadastre informações de possíveis compradores
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nome */}
                    <div className="space-y-2">
                      <Label htmlFor="nome">
                        Nome Completo <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Ex: João Silva"
                        required
                      />
                    </div>

                    {/* Telefone */}
                    <div className="space-y-2">
                      <Label htmlFor="telefone">
                        Telefone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        value={formData.telefone}
                        onChange={handleChange}
                        placeholder="Ex: (11) 99999-9999"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ex: joao@email.com"
                      />
                    </div>

                    {/* CPF */}
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        placeholder="Ex: 000.000.000-00"
                        maxLength={14}
                      />
                    </div>

                    {/* Endereço */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        placeholder="Ex: Rua Exemplo, 123 - Bairro - Cidade/UF"
                      />
                    </div>

                    {/* Observações */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="observacoes">Observações</Label>
                      <textarea
                        id="observacoes"
                        name="observacoes"
                        value={formData.observacoes}
                        onChange={handleChange}
                        placeholder="Anotações sobre o cliente, preferências, etc."
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          nome: "",
                          telefone: "",
                          email: "",
                          cpf: "",
                          endereco: "",
                          observacoes: "",
                        })
                      }}
                    >
                      Limpar
                    </Button>
                    <Button type="submit">Cadastrar Cliente</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
            <CardContent>
              {/* Busca */}
              <div className="relative mb-6">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, telefone ou email..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Lista de Clientes */}
              {clientesFiltrados.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {busca ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado ainda"}
                </div>
              ) : (
                <div className="space-y-3">
                  {clientesFiltrados.map((cliente) => (
                    <div
                      key={cliente.id}
                      className={`border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer ${
                        clienteSelecionado === cliente.id ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() =>
                        setClienteSelecionado(
                          clienteSelecionado === cliente.id ? null : cliente.id
                        )
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <IconUser className="size-5 text-primary" />
                            <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <IconPhone className="size-4" />
                              <span>{cliente.telefone}</span>
                            </div>
                            {cliente.email && (
                              <div className="flex items-center gap-2">
                                <IconMail className="size-4" />
                                <span>{cliente.email}</span>
                              </div>
                            )}
                          </div>
                          {cliente.observacoes && (
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              {cliente.observacoes}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Cadastrado em: {cliente.dataCadastro}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setClienteSelecionado(
                              clienteSelecionado === cliente.id ? null : cliente.id
                            )
                          }}
                        >
                          {clienteSelecionado === cliente.id ? "Ocultar" : "Ver Histórico"}
                        </Button>
                      </div>

                      {/* Histórico Expandido */}
                      {clienteSelecionado === cliente.id && (
                        <div className="mt-4 pt-4 border-t space-y-3">
                          <h4 className="font-semibold mb-3">Histórico de Interações</h4>
                          {historicoCliente.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              Nenhuma interação registrada ainda
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {historicoCliente.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                                >
                                  <div className="mt-1">{getIconTipo(item.tipo)}</div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      {getBadgeTipo(item.tipo)}
                                      <span className="text-xs text-muted-foreground">
                                        {item.data}
                                      </span>
                                    </div>
                                    <p className="text-sm font-medium">{item.descricao}</p>
                                    {item.detalhes && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {item.detalhes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Informações do Cliente */}
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold mb-3">Informações Completas</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {cliente.cpf && (
                                <div>
                                  <span className="text-muted-foreground">CPF: </span>
                                  <span className="font-medium">{cliente.cpf}</span>
                                </div>
                              )}
                              {cliente.endereco && (
                                <div className="md:col-span-2">
                                  <span className="text-muted-foreground">Endereço: </span>
                                  <span className="font-medium">{cliente.endereco}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
    </div>
  )
}
