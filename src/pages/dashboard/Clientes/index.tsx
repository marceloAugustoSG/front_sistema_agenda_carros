import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  IconUser,
  IconPhone,
  IconMail,
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
import {
  getClientes,
  addCliente,
  type Cliente,
} from "@/utils/storage"
import { aplicarMascaraTelefone, aplicarMascaraCPF } from "@/utils/formatters"
import { validarCPF, validarTelefone, validarEmail } from "@/utils/validators"
import { useClienteHistorico } from "@/hooks/useClienteHistorico"
import { ClienteForm } from "@/components/cliente/ClienteForm"
import { HistoricoIcon } from "@/components/cliente/HistoricoIcon"
import { HistoricoBadge } from "@/components/cliente/HistoricoBadge"
import type { FormDataCliente } from "@/components/cliente/types"
import { FORM_INITIAL_STATE } from "@/constants/clientes"

export default function ClientesPage() {
  const [formData, setFormData] = useState<FormDataCliente>(FORM_INITIAL_STATE)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busca, setBusca] = useState<string>("")
  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(null)
  const [modalAberto, setModalAberto] = useState<boolean>(false)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormDataCliente, string>>>({})

  useEffect(() => {
    const clientesCarregados = getClientes()
    setClientes(clientesCarregados)
  }, [])

  const historicoCliente = useClienteHistorico(clienteSelecionado, clientes)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const errors = { ...formErrors }

    if (name === "telefone") {
      const valorComMascara = aplicarMascaraTelefone(value)
      setFormData((prev) => ({ ...prev, [name]: valorComMascara }))

      if (valorComMascara && !validarTelefone(valorComMascara)) {
        errors.telefone = "Telefone inválido"
      } else {
        delete errors.telefone
      }
    } else if (name === "cpf") {
      const valorComMascara = aplicarMascaraCPF(value)
      setFormData((prev) => ({ ...prev, [name]: valorComMascara }))

      if (valorComMascara && !validarCPF(valorComMascara)) {
        errors.cpf = "CPF inválido"
      } else {
        delete errors.cpf
      }
    } else if (name === "email") {
      setFormData((prev) => ({ ...prev, [name]: value }))

      if (value && !validarEmail(value)) {
        errors.email = "Email inválido"
      } else {
        delete errors.email
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    setFormErrors(errors)
  }, [formErrors])

  const validarFormulario = useCallback((): boolean => {
    const errors: Partial<Record<keyof FormDataCliente, string>> = {}

    if (!formData.nome.trim()) {
      errors.nome = "Nome é obrigatório"
    }

    if (!formData.telefone.trim()) {
      errors.telefone = "Telefone é obrigatório"
    } else if (!validarTelefone(formData.telefone)) {
      errors.telefone = "Telefone inválido"
    }

    if (formData.email && !validarEmail(formData.email)) {
      errors.email = "Email inválido"
    }

    if (formData.cpf && !validarCPF(formData.cpf)) {
      errors.cpf = "CPF inválido"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }, [formData])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      toast.error("Por favor, corrija os erros no formulário")
      return
    }

    const telefoneExiste = clientes.some(
      (c) => c.telefone === formData.telefone
    )
    if (telefoneExiste) {
      toast.error("Já existe um cliente cadastrado com este telefone")
      setFormErrors({ telefone: "Este telefone já está cadastrado" })
      return
    }

    try {
      const novoCliente: Cliente = {
        id: Date.now().toString(),
        nome: formData.nome.trim(),
        telefone: formData.telefone,
        email: formData.email.trim(),
        cpf: formData.cpf,
        endereco: formData.endereco.trim(),
        observacoes: formData.observacoes.trim(),
        dataCadastro: new Date().toLocaleDateString("pt-BR"),
      }

      addCliente(novoCliente)
      setClientes((prev) => [novoCliente, ...prev])
      toast.success("Cliente cadastrado com sucesso!")

      setFormData(FORM_INITIAL_STATE)
      setFormErrors({})
      setModalAberto(false)
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error)
      toast.error("Erro ao cadastrar cliente. Tente novamente.")
    }
  }, [formData, clientes, validarFormulario])

  const clientesFiltrados = useMemo(() => {
    if (!busca.trim()) return clientes

    const buscaLower = busca.toLowerCase()
    return clientes.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(buscaLower) ||
        cliente.telefone.includes(busca) ||
        cliente.email.toLowerCase().includes(buscaLower)
    )
  }, [clientes, busca])

  const handleLimparFormulario = useCallback(() => {
    setFormData(FORM_INITIAL_STATE)
    setFormErrors({})
  }, [])

  const handleToggleHistorico = useCallback((clienteId: string) => {
    setClienteSelecionado((prev) => (prev === clienteId ? null : clienteId))
  }, [])

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
                  <ClienteForm
                    formData={formData}
                    onChange={handleChange}
                    errors={formErrors}
                  />

                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLimparFormulario}
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
          <div className="relative mb-6">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone ou email..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9"
            />
          </div>

          {clientesFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {busca ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado ainda"}
            </div>
          ) : (
            <div className="space-y-3">
              {clientesFiltrados.map((cliente) => (
                <div
                  key={cliente.id}
                  className={`border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer ${clienteSelecionado === cliente.id ? "border-primary bg-primary/5" : ""
                    }`}
                  onClick={() => handleToggleHistorico(cliente.id)}
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
                        handleToggleHistorico(cliente.id)
                      }}
                    >
                      {clienteSelecionado === cliente.id ? "Ocultar" : "Ver Histórico"}
                    </Button>
                  </div>

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
                              <HistoricoIcon tipo={item.tipo} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <HistoricoBadge tipo={item.tipo} />
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
