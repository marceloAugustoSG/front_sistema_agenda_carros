import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ClientesPage() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
    endereco: "",
    observacoes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.nome || !formData.telefone) {
      toast.error("Por favor, preencha pelo menos nome e telefone")
      return
    }

    // Aqui você pode adicionar a lógica para enviar os dados para a API
    console.log("Dados do cliente:", formData)
    toast.success("Cliente cadastrado com sucesso!")

    // Limpar formulário
    setFormData({
      nome: "",
      telefone: "",
      email: "",
      cpf: "",
      endereco: "",
      observacoes: "",
    })
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Cliente</CardTitle>
          <CardDescription>
            Cadastre informações de possíveis compradores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
        </CardContent>
      </Card>
    </div>
  )
}

