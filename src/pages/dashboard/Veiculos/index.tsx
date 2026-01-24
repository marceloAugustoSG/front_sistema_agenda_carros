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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { IconSearch, IconPlus } from "@tabler/icons-react"
import { getVeiculos, addVeiculo, type Veiculo } from "@/utils/storage"

type FormDataVeiculo = {
  marca: string
  modelo: string
  ano: string
  placa: string
  cor: string
  chassi: string
  valor: string
  combustivel: string
  quilometragem: string
  status: Veiculo["status"]
}

export default function VeiculosPage() {
  const [formData, setFormData] = useState<FormDataVeiculo>({
    marca: "",
    modelo: "",
    ano: "",
    placa: "",
    cor: "",
    chassi: "",
    valor: "",
    combustivel: "",
    quilometragem: "",
    status: "disponivel",
  })

  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [busca, setBusca] = useState<string>("")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [modalAberto, setModalAberto] = useState<boolean>(false)

  useEffect(() => {
    const veiculosCarregados = getVeiculos()
    setVeiculos(veiculosCarregados)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.marca || !formData.modelo || !formData.ano || !formData.placa) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    const placaExiste = veiculos.some(
      (v) => v.placa.toLowerCase() === formData.placa.toLowerCase()
    )
    if (placaExiste) {
      toast.error("Já existe um veículo cadastrado com esta placa")
      return
    }

    const novoVeiculo: Veiculo = {
      id: Date.now().toString(),
      marca: formData.marca,
      modelo: formData.modelo,
      ano: formData.ano,
      placa: formData.placa,
      cor: formData.cor,
      chassi: formData.chassi,
      valor: formData.valor,
      combustivel: formData.combustivel,
      quilometragem: formData.quilometragem,
      status: formData.status,
    }

    addVeiculo(novoVeiculo)

    setVeiculos((prev) => [novoVeiculo, ...prev])
    toast.success("Veículo cadastrado com sucesso!")

    setFormData({
      marca: "",
      modelo: "",
      ano: "",
      placa: "",
      cor: "",
      chassi: "",
      valor: "",
      combustivel: "",
      quilometragem: "",
      status: "disponivel",
    })
    setModalAberto(false)
  }

  const veiculosFiltrados = veiculos.filter((veiculo) => {
    const matchStatus = filtroStatus === "todos" || veiculo.status === filtroStatus
    const matchBusca =
      !busca ||
      veiculo.marca.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.modelo.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.placa.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.cor.toLowerCase().includes(busca.toLowerCase())

    return matchStatus && matchBusca
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Veículos Cadastrados</CardTitle>
              <CardDescription>Visualize e gerencie seus veículos</CardDescription>
            </div>
            <Dialog open={modalAberto} onOpenChange={setModalAberto}>
              <DialogTrigger asChild>
                <Button>
                  <IconPlus className="size-4 mr-2" />
                  Cadastrar Veículo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Veículo</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do veículo para adicioná-lo ao sistema
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    {/* Placa */}
                    <div className="space-y-2">
                      <Label htmlFor="placa">
                        Placa <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="placa"
                        name="placa"
                        value={formData.placa}
                        onChange={handleChange}
                        placeholder="Ex: ABC-1234"
                        maxLength={8}
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

                    {/* Chassi */}
                    <div className="space-y-2">
                      <Label htmlFor="chassi">Chassi</Label>
                      <Input
                        id="chassi"
                        name="chassi"
                        value={formData.chassi}
                        onChange={handleChange}
                        placeholder="Número do chassi"
                        maxLength={17}
                      />
                    </div>

                    {/* Valor */}
                    <div className="space-y-2">
                      <Label htmlFor="valor">Valor (R$)</Label>
                      <Input
                        id="valor"
                        name="valor"
                        type="number"
                        value={formData.valor}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* Combustível */}
                    <div className="space-y-2">
                      <Label htmlFor="combustivel">Tipo de Combustível</Label>
                      <Select
                        value={formData.combustivel}
                        onValueChange={(value) => handleSelectChange("combustivel", value)}
                      >
                        <SelectTrigger id="combustivel">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flex">Flex</SelectItem>
                          <SelectItem value="gasolina">Gasolina</SelectItem>
                          <SelectItem value="etanol">Etanol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="eletrico">Elétrico</SelectItem>
                          <SelectItem value="hibrido">Híbrido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quilometragem */}
                    <div className="space-y-2">
                      <Label htmlFor="quilometragem">Quilometragem</Label>
                      <Input
                        id="quilometragem"
                        name="quilometragem"
                        type="number"
                        value={formData.quilometragem}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange("status", value)}
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="disponivel">Disponível</SelectItem>
                          <SelectItem value="reservado">Reservado</SelectItem>
                          <SelectItem value="vendido">Vendido</SelectItem>
                          <SelectItem value="manutencao">Em Manutenção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          marca: "",
                          modelo: "",
                          ano: "",
                          placa: "",
                          cor: "",
                          chassi: "",
                          valor: "",
                          combustivel: "",
                          quilometragem: "",
                          status: "disponivel",
                        })
                      }}
                    >
                      Limpar
                    </Button>
                    <Button type="submit">Adicionar Veículo</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por marca, modelo, placa ou cor..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {veiculos.filter((v) => v.status === "disponivel").length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Disponíveis</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {veiculos.filter((v) => v.status === "reservado").length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Reservados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {veiculos.filter((v) => v.status === "vendido").length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Vendidos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{veiculos.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
            </div>
          </div>

          {veiculosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {busca || filtroStatus !== "todos"
                ? "Nenhum veículo encontrado com os filtros aplicados"
                : "Nenhum veículo cadastrado ainda"}
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
                          {parseInt(veiculo.quilometragem || "0").toLocaleString("pt-BR")} km
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Valor:</span>
                        <p className="font-medium text-lg text-primary">
                          R$ {parseFloat(veiculo.valor || "0").toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                    {veiculo.chassi && (
                      <div className="pt-2 border-t text-xs text-muted-foreground">
                        <span>Chassi: </span>
                        <span className="font-mono">{veiculo.chassi}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
