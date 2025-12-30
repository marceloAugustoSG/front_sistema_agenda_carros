import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
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
import { IconSearch, IconBolt, IconUser, IconCar } from "@tabler/icons-react"

import { getClientes, getVeiculos, getInteresses, addInteresse, updateInteresse, type Cliente, type Veiculo, type Interesse } from "@/utils/storage"

export default function InteressesPage() {
  const location = useLocation()
  const preenchimentoAutomatico = location.state as {
    clienteNome?: string
    clienteTelefone?: string
    veiculo?: string
  } | null

  const [formData, setFormData] = useState({
    clienteId: "",
    marca: "",
    modelo: "",
    ano: "",
    cor: "",
    valorMaximo: "",
    observacoes: "",
  })

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [interesses, setInteresses] = useState<Interesse[]>([])
  const [modoRapido, setModoRapido] = useState(false)
  const [buscaCliente, setBuscaCliente] = useState("")
  const [veiculoCompleto, setVeiculoCompleto] = useState("")
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([])
  const [sugestoesVisiveis, setSugestoesVisiveis] = useState(false)
  const [veiculoBuscado, setVeiculoBuscado] = useState<{ marca: string; modelo: string; ano: string } | null>(null)

  // Carregar dados do localStorage
  useEffect(() => {
    setClientes(getClientes())
    setVeiculos(getVeiculos())
    setInteresses(getInteresses())
  }, [])

  // Atualizar clientes filtrados quando clientes ou busca mudar
  useEffect(() => {
    if (buscaCliente.trim() === "") {
      setClientesFiltrados(clientes)
    } else {
      const termo = buscaCliente.toLowerCase()
      setClientesFiltrados(
        clientes.filter(
          (c) =>
            c.nome.toLowerCase().includes(termo) ||
            c.telefone.includes(termo)
        )
      )
    }
  }, [buscaCliente, clientes])

  // Função para extrair marca, modelo e ano do veículo
  const parsearVeiculo = (veiculoString: string) => {
    // Formato esperado: "Toyota Corolla 2024" ou "Honda Civic 2023"
    const partes = veiculoString.trim().split(" ")
    if (partes.length >= 3) {
      const ano = partes[partes.length - 1]
      const marca = partes[0]
      const modelo = partes.slice(1, -1).join(" ")
      return { marca, modelo, ano }
    }
    return { marca: "", modelo: "", ano: "" }
  }

  // Encontrar cliente pelo nome ou telefone
  const encontrarCliente = (nome?: string, telefone?: string) => {
    if (!nome && !telefone) return null
    return clientes.find(
      (c) =>
        (nome && c.nome.toLowerCase().includes(nome.toLowerCase())) ||
        (telefone && c.telefone === telefone)
    )
  }

  // Preencher veículo completo
  const handleVeiculoCompleto = (valor: string) => {
    setVeiculoCompleto(valor)
    if (valor.trim() !== "") {
      const { marca, modelo, ano } = parsearVeiculo(valor)
      setFormData((prev) => ({
        ...prev,
        marca: marca || prev.marca,
        modelo: modelo || prev.modelo,
        ano: ano || prev.ano,
      }))
    }
  }

  // Cadastro rápido - só com dados essenciais
  const handleCadastroRapido = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.clienteId || !formData.marca || !formData.modelo || !formData.ano) {
      toast.error("Preencha pelo menos: Cliente, Marca, Modelo e Ano")
      return
    }

    const cliente = clientes.find((c) => c.id === formData.clienteId)
    if (!cliente) {
      toast.error("Cliente não encontrado")
      return
    }

    const emEstoque = verificarEstoque(formData.marca, formData.modelo, formData.ano)

    const novoInteresse: Interesse = {
      id: Date.now().toString(),
      clienteId: formData.clienteId,
      clienteNome: cliente.nome,
      clienteTelefone: cliente.telefone,
      marca: formData.marca,
      modelo: formData.modelo,
      ano: formData.ano,
      cor: formData.cor || "",
      valorMaximo: formData.valorMaximo || "",
      observacoes: formData.observacoes || "",
      dataCadastro: new Date().toLocaleDateString("pt-BR"),
      status: emEstoque ? "atendido" : "pendente",
    }

    // Salvar no localStorage
    addInteresse(novoInteresse)
    
    // Atualizar estado
    setInteresses((prev) => [novoInteresse, ...prev])

    if (emEstoque) {
      toast.success(`Veículo encontrado! Cliente ${cliente.nome} será notificado.`, {
        duration: 5000,
      })
      setSugestoesVisiveis(false)
    } else {
      toast.info(`Interesse cadastrado! Cliente ${cliente.nome} será notificado quando chegar.`, {
        duration: 5000,
      })
      setVeiculoBuscado({ marca: formData.marca, modelo: formData.modelo, ano: formData.ano })
      setSugestoesVisiveis(true)
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
    setVeiculoCompleto("")
    setBuscaCliente("")
    
    // Mostrar sugestões se não estiver em estoque
    if (!emEstoque) {
      setVeiculoBuscado({ marca: formData.marca, modelo: formData.modelo, ano: formData.ano })
      setSugestoesVisiveis(true)
    } else {
      setSugestoesVisiveis(false)
    }
  }

  // Preencher formulário automaticamente se vier da Home
  useEffect(() => {
    if (preenchimentoAutomatico) {
      const cliente = encontrarCliente(
        preenchimentoAutomatico.clienteNome,
        preenchimentoAutomatico.clienteTelefone
      )

      if (preenchimentoAutomatico.veiculo && cliente) {
        const { marca, modelo, ano } = parsearVeiculo(preenchimentoAutomatico.veiculo)
        setFormData({
          clienteId: cliente.id,
          marca: marca,
          modelo: modelo,
          ano: ano,
          cor: "",
          valorMaximo: "",
          observacoes: "",
        })
      } else if (cliente) {
        setFormData((prev) => ({
          ...prev,
          clienteId: cliente.id,
        }))
      } else if (preenchimentoAutomatico.clienteNome) {
        // Se o cliente não foi encontrado, mas temos o nome, tentar buscar de forma mais flexível
        const clienteAlternativo = clientes.find((c) =>
          c.nome.toLowerCase().includes(preenchimentoAutomatico.clienteNome!.toLowerCase())
        )
        if (clienteAlternativo && preenchimentoAutomatico.veiculo) {
          const { marca, modelo, ano } = parsearVeiculo(preenchimentoAutomatico.veiculo)
          setFormData({
            clienteId: clienteAlternativo.id,
            marca: marca,
            modelo: modelo,
            ano: ano,
            cor: "",
            valorMaximo: "",
            observacoes: "",
          })
        } else if (clienteAlternativo) {
          setFormData((prev) => ({
            ...prev,
            clienteId: clienteAlternativo.id,
          }))
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const verificarEstoque = (marca: string, modelo: string, ano: string) => {
    return veiculos.some(
      (veiculo) =>
        veiculo.marca.toLowerCase() === marca.toLowerCase() &&
        veiculo.modelo.toLowerCase() === modelo.toLowerCase() &&
        veiculo.ano === ano &&
        veiculo.status === "disponivel"
    )
  }

  // Buscar veículos similares disponíveis
  const buscarVeiculosSimilares = (marca: string, modelo: string, ano: string) => {
    const veiculosDisponiveis = veiculos.filter((v) => v.status === "disponivel")
    
    // Prioridade: Mesma marca, modelo similar, ano próximo
    const anoNum = parseInt(ano)
    const veiculosSimilares = veiculosDisponiveis
      .filter((v) => {
        // Não incluir o próprio veículo
        if (
          v.marca.toLowerCase() === marca.toLowerCase() &&
          v.modelo.toLowerCase() === modelo.toLowerCase() &&
          v.ano === ano
        ) {
          return false
        }
        return true
      })
      .map((v) => {
        let score = 0
        // Mesma marca = +3 pontos
        if (v.marca.toLowerCase() === marca.toLowerCase()) score += 3
        // Mesmo modelo (ano diferente) = +2 pontos
        if (v.modelo.toLowerCase() === modelo.toLowerCase()) score += 2
        // Ano próximo = +1 ponto
        const anoV = parseInt(v.ano)
        if (Math.abs(anoV - anoNum) <= 1) score += 1
        
        return { ...v, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) // Top 3 sugestões

    return veiculosSimilares
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.clienteId || !formData.marca || !formData.modelo || !formData.ano) {
      toast.error("Por favor, preencha cliente, marca, modelo e ano")
      return
    }

    const cliente = clientes.find((c) => c.id === formData.clienteId)
    if (!cliente) {
      toast.error("Cliente não encontrado")
      return
    }

    // Verificar se o veículo está em estoque
    const emEstoque = verificarEstoque(formData.marca, formData.modelo, formData.ano)

    const novoInteresse: Interesse = {
      id: Date.now().toString(),
      clienteId: formData.clienteId,
      clienteNome: cliente.nome,
      clienteTelefone: cliente.telefone,
      marca: formData.marca,
      modelo: formData.modelo,
      ano: formData.ano,
      cor: formData.cor || "",
      valorMaximo: formData.valorMaximo || "",
      observacoes: formData.observacoes || "",
      dataCadastro: new Date().toLocaleDateString("pt-BR"),
      status: emEstoque ? "atendido" : "pendente",
    }

    // Salvar no localStorage
    addInteresse(novoInteresse)
    
    // Atualizar estado
    setInteresses((prev) => [novoInteresse, ...prev])

    if (emEstoque) {
      // Veículo está em estoque - notificar cliente
      toast.success(
        `Veículo encontrado em estoque! Cliente ${cliente.nome} será notificado.`,
        {
          duration: 5000,
        }
      )
      setSugestoesVisiveis(false)
    } else {
      // Veículo não está em estoque - cadastrar interesse e mostrar sugestões
      toast.info(
        `Interesse cadastrado! Cliente ${cliente.nome} será notificado quando o veículo chegar ao estoque.`,
        {
          duration: 5000,
        }
      )
      setVeiculoBuscado({ marca: formData.marca, modelo: formData.modelo, ano: formData.ano })
      setSugestoesVisiveis(true)
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
      // Atualizar no localStorage
      updateInteresse(interesseId, { status: "atendido" })
      
      // Atualizar estado
      setInteresses((prev) =>
        prev.map((i) => (i.id === interesseId ? { ...i, status: "atendido" } : i))
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cadastrar Interesse do Cliente</CardTitle>
              <CardDescription>
                Cadastre o veículo que o cliente deseja. Se estiver em estoque, o cliente será notificado automaticamente.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant={modoRapido ? "default" : "outline"}
              size="sm"
              onClick={() => setModoRapido(!modoRapido)}
            >
              <IconBolt className="size-4 mr-2" />
              {modoRapido ? "Modo Completo" : "Modo Rápido"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {modoRapido ? (
            // Formulário Rápido
            <form onSubmit={handleCadastroRapido} className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  <IconBolt className="size-4 inline mr-1" />
                  Modo Rápido - Apenas dados essenciais
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Preencha apenas o necessário para cadastrar o interesse rapidamente
                </p>
              </div>

              <div className="space-y-4">
                {/* Busca Rápida de Cliente */}
                <div className="space-y-2">
                  <Label htmlFor="buscaCliente">
                    Buscar Cliente <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="buscaCliente"
                      value={buscaCliente}
                      onChange={(e) => setBuscaCliente(e.target.value)}
                      placeholder="Digite nome ou telefone do cliente..."
                      className="pl-9"
                    />
                  </div>
                  {buscaCliente.trim() !== "" && clientesFiltrados.length > 0 && (
                    <div className="border rounded-lg mt-2 max-h-40 overflow-y-auto">
                      {clientesFiltrados.map((cliente) => (
                        <button
                          key={cliente.id}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, clienteId: cliente.id }))
                            setBuscaCliente(cliente.nome)
                            setClientesFiltrados([])
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-accent transition-colors flex items-center gap-2"
                        >
                          <IconUser className="size-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{cliente.nome}</p>
                            <p className="text-xs text-muted-foreground">{cliente.telefone}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {buscaCliente.trim() !== "" && clientesFiltrados.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Cliente não encontrado. Cadastre primeiro em{" "}
                      <Link to="/dashboard/clientes" className="text-primary underline">
                        Clientes
                      </Link>
                    </p>
                  )}
                </div>

                {/* Veículo Completo */}
                <div className="space-y-2">
                  <Label htmlFor="veiculoCompleto">
                    Veículo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="veiculoCompleto"
                    value={veiculoCompleto}
                    onChange={(e) => handleVeiculoCompleto(e.target.value)}
                    placeholder="Ex: Toyota Corolla 2024 (ou digite marca, modelo e ano separadamente)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Digite tudo junto ou preencha os campos abaixo
                  </p>
                </div>

                {/* Campos Separados (opcionais se preencheu o campo completo) */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marca-rapido">Marca</Label>
                    <Input
                      id="marca-rapido"
                      name="marca"
                      value={formData.marca}
                      onChange={handleChange}
                      placeholder="Toyota"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelo-rapido">Modelo</Label>
                    <Input
                      id="modelo-rapido"
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleChange}
                      placeholder="Corolla"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ano-rapido">Ano</Label>
                    <Input
                      id="ano-rapido"
                      name="ano"
                      type="number"
                      value={formData.ano}
                      onChange={handleChange}
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
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
                    setVeiculoCompleto("")
                    setBuscaCliente("")
                  }}
                >
                  Limpar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <IconBolt className="size-4 mr-2" />
                  Cadastrar Rápido
                </Button>
              </div>
            </form>
          ) : (
            // Formulário Completo
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
                      {clientes.map((cliente) => (
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
          )}

          {/* Sugestões Inteligentes */}
          {sugestoesVisiveis && veiculoBuscado && (
            <Card className="mt-6 border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconCar className="size-5 text-blue-600" />
                  Sugestões de Veículos Similares
                </CardTitle>
                <CardDescription>
                  O veículo {veiculoBuscado.marca} {veiculoBuscado.modelo} {veiculoBuscado.ano} não está disponível,
                  mas temos estas opções similares em estoque:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {buscarVeiculosSimilares(veiculoBuscado.marca, veiculoBuscado.modelo, veiculoBuscado.ano).length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum veículo similar encontrado no momento.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {buscarVeiculosSimilares(veiculoBuscado.marca, veiculoBuscado.modelo, veiculoBuscado.ano).map(
                      (veiculo) => (
                        <Card key={veiculo.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">
                                  {veiculo.marca} {veiculo.modelo}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  {veiculo.ano} • {veiculo.cor}
                                </CardDescription>
                              </div>
                              <Badge className="bg-green-600">Disponível</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <p className="text-2xl font-bold text-primary">
                                R$ {parseFloat(veiculo.valor).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                            <Button
                              className="w-full"
                              size="sm"
                              onClick={() => {
                                // Preencher formulário com o veículo sugerido
                                setFormData((prev) => ({
                                  ...prev,
                                  marca: veiculo.marca,
                                  modelo: veiculo.modelo,
                                  ano: veiculo.ano,
                                }))
                                setVeiculoCompleto(`${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}`)
                                setSugestoesVisiveis(false)
                                toast.success(
                                  `Veículo ${veiculo.marca} ${veiculo.modelo} ${veiculo.ano} selecionado! Preencha o cliente e cadastre.`
                                )
                              }}
                            >
                              Usar Este Veículo
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSugestoesVisiveis(false)}
                    className="w-full"
                  >
                    Ocultar Sugestões
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
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
                          {interesse.status === "atendido" && (
                            <Badge variant="default">Notificado</Badge>
                          )}
                          {emEstoque && interesse.status !== "atendido" && (
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

