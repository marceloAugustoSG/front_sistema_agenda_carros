import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

// Simulação de dados - em produção viria de uma API
const clientesMock = [
  { id: "1", nome: "João Silva", telefone: "(11) 99999-9999" },
  { id: "2", nome: "Maria Santos", telefone: "(11) 88888-8888" },
  { id: "3", nome: "Pedro Costa", telefone: "(11) 77777-7777" },
]

const veiculosEstoqueMock = [
  { id: "1", marca: "Toyota", modelo: "Corolla", ano: "2023", status: "disponivel" },
  { id: "2", marca: "Honda", modelo: "Civic", ano: "2024", status: "disponivel" },
  { id: "3", marca: "Ford", modelo: "Fiesta", ano: "2022", status: "vendido" },
]

export default function InteressesPage() {
  const [formData, setFormData] = useState({
    clienteId: "",
    marca: "",
    modelo: "",
    ano: "",
    cor: "",
    valorMaximo: "",
    observacoes: "",
  })

  const [interesses, setInteresses] = useState<Array<{
    id: string
    clienteId: string
    clienteNome: string
    marca: string
    modelo: string
    ano: string
    cor: string
    valorMaximo: string
    observacoes: string
    dataCadastro: string
    notificado: boolean
  }>>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const verificarEstoque = (marca: string, modelo: string, ano: string) => {
    return veiculosEstoqueMock.some(
      (veiculo) =>
        veiculo.marca.toLowerCase() === marca.toLowerCase() &&
        veiculo.modelo.toLowerCase() === modelo.toLowerCase() &&
        veiculo.ano === ano &&
        veiculo.status === "disponivel"
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.clienteId || !formData.marca || !formData.modelo || !formData.ano) {
      toast.error("Por favor, preencha cliente, marca, modelo e ano")
      return
    }

    const cliente = clientesMock.find((c) => c.id === formData.clienteId)
    if (!cliente) {
      toast.error("Cliente não encontrado")
      return
    }

    // Verificar se o veículo está em estoque
    const emEstoque = verificarEstoque(formData.marca, formData.modelo, formData.ano)

    const novoInteresse = {
      id: Date.now().toString(),
      clienteId: formData.clienteId,
      clienteNome: cliente.nome,
      marca: formData.marca,
      modelo: formData.modelo,
      ano: formData.ano,
      cor: formData.cor,
      valorMaximo: formData.valorMaximo,
      observacoes: formData.observacoes,
      dataCadastro: new Date().toLocaleDateString("pt-BR"),
      notificado: emEstoque,
    }

    setInteresses((prev) => [novoInteresse, ...prev])

    if (emEstoque) {
      // Veículo está em estoque - notificar cliente
      toast.success(
        `Veículo encontrado em estoque! Cliente ${cliente.nome} será notificado.`,
        {
          duration: 5000,
        }
      )
      // Aqui você pode adicionar lógica para enviar SMS, email, WhatsApp, etc.
      console.log(`Notificar cliente ${cliente.nome} sobre veículo disponível`)
    } else {
      // Veículo não está em estoque - cadastrar interesse
      toast.info(
        `Interesse cadastrado! Cliente ${cliente.nome} será notificado quando o veículo chegar ao estoque.`,
        {
          duration: 5000,
        }
      )
    }

    // Limpar formulário
    setFormData({
      clienteId: "",
      marca: "",
      modelo: "",
      ano: "",
      cor: "",
      valorMaximo: "",
      observacoes: "",
    })
  }

  const handleNotificarCliente = (interesseId: string) => {
    const interesse = interesses.find((i) => i.id === interesseId)
    if (!interesse) return

    // Verificar novamente se está em estoque
    const emEstoque = verificarEstoque(interesse.marca, interesse.modelo, interesse.ano)

    if (emEstoque) {
      setInteresses((prev) =>
        prev.map((i) => (i.id === interesseId ? { ...i, notificado: true } : i))
      )
      toast.success(`Cliente ${interesse.clienteNome} notificado com sucesso!`)
    } else {
      toast.warning("Veículo ainda não está disponível em estoque")
    }
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Interesse do Cliente</CardTitle>
          <CardDescription>
            Cadastre o veículo que o cliente deseja. Se estiver em estoque, o cliente será notificado automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Marca */}
              <div className="space-y-2">
                <Label htmlFor="marca">
                  Marca <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  placeholder="Ex: Toyota, Honda, Ford..."
                  required
                />
              </div>

              {/* Modelo */}
              <div className="space-y-2">
                <Label htmlFor="modelo">
                  Modelo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  placeholder="Ex: Corolla, Civic, Fiesta..."
                  required
                />
              </div>

              {/* Ano */}
              <div className="space-y-2">
                <Label htmlFor="ano">
                  Ano <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ano"
                  name="ano"
                  type="number"
                  value={formData.ano}
                  onChange={handleChange}
                  placeholder="Ex: 2024"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              {/* Cor */}
              <div className="space-y-2">
                <Label htmlFor="cor">Cor</Label>
                <Input
                  id="cor"
                  name="cor"
                  value={formData.cor}
                  onChange={handleChange}
                  placeholder="Ex: Branco, Preto, Prata..."
                />
              </div>

              {/* Valor Máximo */}
              <div className="space-y-2">
                <Label htmlFor="valorMaximo">Valor Máximo (R$)</Label>
                <Input
                  id="valorMaximo"
                  name="valorMaximo"
                  type="number"
                  value={formData.valorMaximo}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
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
                  placeholder="Informações adicionais sobre o interesse do cliente"
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
                    clienteId: "",
                    marca: "",
                    modelo: "",
                    ano: "",
                    cor: "",
                    valorMaximo: "",
                    observacoes: "",
                  })
                }}
              >
                Limpar
              </Button>
              <Button type="submit">Cadastrar Interesse</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Interesses */}
      {interesses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Interesses Cadastrados</CardTitle>
            <CardDescription>
              Lista de veículos que os clientes estão procurando
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interesses.map((interesse) => {
                const emEstoque = verificarEstoque(interesse.marca, interesse.modelo, interesse.ano)
                return (
                  <div
                    key={interesse.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{interesse.clienteNome}</h3>
                          {interesse.notificado && (
                            <Badge variant="default">Notificado</Badge>
                          )}
                          {emEstoque && !interesse.notificado && (
                            <Badge variant="default" className="bg-green-600">
                              Disponível
                            </Badge>
                          )}
                          {!emEstoque && (
                            <Badge variant="outline">Aguardando Estoque</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {interesse.marca} {interesse.modelo} {interesse.ano}
                          {interesse.cor && ` - ${interesse.cor}`}
                        </p>
                        {interesse.valorMaximo && (
                          <p className="text-sm text-muted-foreground">
                            Valor máximo: R$ {parseFloat(interesse.valorMaximo).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Cadastrado em: {interesse.dataCadastro}
                        </p>
                      </div>
                      {emEstoque && !interesse.notificado && (
                        <Button
                          size="sm"
                          onClick={() => handleNotificarCliente(interesse.id)}
                        >
                          Notificar Cliente
                        </Button>
                      )}
                    </div>
                    {interesse.observacoes && (
                      <p className="text-sm text-muted-foreground italic">
                        {interesse.observacoes}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

