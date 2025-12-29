import { useState } from "react"
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

export default function VeiculosPage() {
  const [formData, setFormData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.marca || !formData.modelo || !formData.ano || !formData.placa) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    // Aqui você pode adicionar a lógica para enviar os dados para a API
    console.log("Dados do veículo:", formData)
    toast.success("Veículo adicionado com sucesso!")
    
    // Limpar formulário
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
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Veículo</CardTitle>
          <CardDescription>
            Preencha os dados do veículo para adicioná-lo ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
        </CardContent>
      </Card>
    </div>
  )
}

