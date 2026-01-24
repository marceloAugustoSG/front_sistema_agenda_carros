
export interface Veiculo {
  id: string
  marca: string
  modelo: string
  ano: string
  placa: string
  cor: string
  chassi: string
  valor: string
  combustivel: string
  quilometragem: string
  status: "disponivel" | "reservado" | "vendido" | "manutencao"
}

export interface Cliente {
  id: string
  nome: string
  telefone: string
  email: string
  cpf: string
  endereco: string
  observacoes: string
  dataCadastro: string
}

export interface Interesse {
  id: string
  clienteId: string
  clienteNome: string
  clienteTelefone: string
  marca: string
  modelo: string
  ano: string
  cor: string
  valorMaximo: string
  observacoes: string
  dataCadastro: string
  status: "pendente" | "atendido" | "cancelado"
  notificado?: boolean
}

export interface Lembrete {
  id: string
  clienteId: string
  clienteNome: string
  titulo: string
  descricao: string
  data: string
  tipo: "contato" | "followup" | "reuniao" | "outro"
  prioridade: "baixa" | "media" | "alta"
  veiculoId?: string
  veiculoDescricao?: string
  concluido: boolean
  dataCriacao: string
}

export interface Proposta {
  id: string
  numero: string
  clienteId: string
  clienteNome: string
  clienteTelefone: string
  veiculoId: string
  veiculoDescricao: string
  valorVeiculo: string
  desconto: string
  valorFinal: string
  formaPagamento: string
  entrada: string
  numeroParcelas: string
  valorParcela: string
  parcelas: string
  validade: string
  observacoes: string
  status: "pendente" | "aceita" | "recusada"
  dataCriacao: string
}

const STORAGE_KEYS = {
  VEICULOS: "agenda_veiculos",
  CLIENTES: "agenda_clientes",
  INTERESSES: "agenda_interesses",
  LEMBRETES: "agenda_lembretes",
  PROPOSTAS: "agenda_propostas",
}

function getFromStorage<T>(key: string, defaultValue: T[]): T[] {
  try {
    if (typeof window === "undefined") return defaultValue
    const item = localStorage.getItem(key)
    if (item) {
      return JSON.parse(item)
    }
    setToStorage(key, defaultValue)
    return defaultValue
  } catch (error) {
    console.error(`Erro ao ler ${key} do localStorage:`, error)
    return defaultValue
  }
}

function setToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error)
  }
}

export function getVeiculos(): Veiculo[] {
  return getFromStorage<Veiculo>(STORAGE_KEYS.VEICULOS, [])
}

export function saveVeiculos(veiculos: Veiculo[]): void {
  setToStorage(STORAGE_KEYS.VEICULOS, veiculos)
}

export function addVeiculo(veiculo: Veiculo): void {
  const veiculos = getVeiculos()
  veiculos.push(veiculo)
  saveVeiculos(veiculos)
}

export function updateVeiculo(id: string, veiculoAtualizado: Partial<Veiculo>): void {
  const veiculos = getVeiculos()
  const index = veiculos.findIndex((v) => v.id === id)
  if (index !== -1) {
    veiculos[index] = { ...veiculos[index], ...veiculoAtualizado }
    saveVeiculos(veiculos)
  }
}

export function deleteVeiculo(id: string): void {
  const veiculos = getVeiculos()
  const filtrados = veiculos.filter((v) => v.id !== id)
  saveVeiculos(filtrados)
}

export function getClientes(): Cliente[] {
  return getFromStorage<Cliente>(STORAGE_KEYS.CLIENTES, [])
}

export function saveClientes(clientes: Cliente[]): void {
  setToStorage(STORAGE_KEYS.CLIENTES, clientes)
}

export function addCliente(cliente: Cliente): void {
  const clientes = getClientes()
  clientes.push(cliente)
  saveClientes(clientes)
}

export function updateCliente(id: string, clienteAtualizado: Partial<Cliente>): void {
  const clientes = getClientes()
  const index = clientes.findIndex((c) => c.id === id)
  if (index !== -1) {
    clientes[index] = { ...clientes[index], ...clienteAtualizado }
    saveClientes(clientes)
  }
}

export function deleteCliente(id: string): void {
  const clientes = getClientes()
  const filtrados = clientes.filter((c) => c.id !== id)
  saveClientes(filtrados)
}

export function getInteresses(): Interesse[] {
  return getFromStorage<Interesse>(STORAGE_KEYS.INTERESSES, [])
}

export function saveInteresses(interesses: Interesse[]): void {
  setToStorage(STORAGE_KEYS.INTERESSES, interesses)
}

export function addInteresse(interesse: Interesse): void {
  const interesses = getInteresses()
  interesses.push(interesse)
  saveInteresses(interesses)
}

export function updateInteresse(id: string, interesseAtualizado: Partial<Interesse>): void {
  const interesses = getInteresses()
  const index = interesses.findIndex((i) => i.id === id)
  if (index !== -1) {
    interesses[index] = { ...interesses[index], ...interesseAtualizado }
    saveInteresses(interesses)
  }
}

export function getLembretes(): Lembrete[] {
  return getFromStorage<Lembrete>(STORAGE_KEYS.LEMBRETES, [])
}

export function saveLembretes(lembretes: Lembrete[]): void {
  setToStorage(STORAGE_KEYS.LEMBRETES, lembretes)
}

export function addLembrete(lembrete: Lembrete): void {
  const lembretes = getLembretes()
  lembretes.push(lembrete)
  saveLembretes(lembretes)
}

export function updateLembrete(id: string, lembreteAtualizado: Partial<Lembrete>): void {
  const lembretes = getLembretes()
  const index = lembretes.findIndex((l) => l.id === id)
  if (index !== -1) {
    lembretes[index] = { ...lembretes[index], ...lembreteAtualizado }
    saveLembretes(lembretes)
  }
}

export function deleteLembrete(id: string): void {
  const lembretes = getLembretes()
  const filtrados = lembretes.filter((l) => l.id !== id)
  saveLembretes(filtrados)
}

export function getPropostas(): Proposta[] {
  return getFromStorage<Proposta>(STORAGE_KEYS.PROPOSTAS, [])
}

export function savePropostas(propostas: Proposta[]): void {
  setToStorage(STORAGE_KEYS.PROPOSTAS, propostas)
}

export function addProposta(proposta: Proposta): void {
  const propostas = getPropostas()
  propostas.push(proposta)
  savePropostas(propostas)
}

export function updateProposta(id: string, propostaAtualizada: Partial<Proposta>): void {
  const propostas = getPropostas()
  const index = propostas.findIndex((p) => p.id === id)
  if (index !== -1) {
    propostas[index] = { ...propostas[index], ...propostaAtualizada }
    savePropostas(propostas)
  }
}

