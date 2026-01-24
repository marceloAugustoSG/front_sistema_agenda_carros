import { useMemo } from "react"
import {
  getInteresses,
  getPropostas,
  getLembretes,
  type Cliente,
} from "@/utils/storage"

export type HistoricoTipo =
  | "interesse"
  | "contato"
  | "venda"
  | "notificacao"
  | "cadastro"
  | "followup"
  | "reuniao"
  | "outro"

export interface HistoricoItem {
  id: string
  tipo: HistoricoTipo
  descricao: string
  data: string
  detalhes?: string
}


export const useClienteHistorico = (
  clienteId: string | null,
  clientes: Cliente[]
): HistoricoItem[] => {
  return useMemo(() => {
    if (!clienteId) return []

    const historico: HistoricoItem[] = []
    const interesses = getInteresses()
    const propostas = getPropostas()
    const lembretes = getLembretes()
    const cliente = clientes.find((c) => c.id === clienteId)

    if (!cliente) return historico

    historico.push({
      id: `cadastro-${cliente.id}`,
      tipo: "cadastro",
      descricao: "Cliente cadastrado no sistema",
      data: cliente.dataCadastro,
      detalhes: `Telefone: ${cliente.telefone}${cliente.email ? ` | Email: ${cliente.email}` : ""}`,
    })

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

    propostas
      .filter((p) => p.clienteId === clienteId)
      .forEach((proposta) => {
        const tipo: HistoricoTipo = proposta.status === "aceita" ? "venda" : "contato"
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

    lembretes
      .filter((l) => l.clienteId === clienteId)
      .forEach((lembrete) => {
        historico.push({
          id: `lembrete-${lembrete.id}`,
          tipo: lembrete.tipo as HistoricoTipo,
          descricao: lembrete.titulo,
          data: lembrete.dataCriacao,
          detalhes: lembrete.descricao || undefined,
        })
      })

    return historico.sort((a, b) => {
      const parseDate = (dateStr: string): Date => {
        if (dateStr.includes("/")) {
          const [dia, mes, ano] = dateStr.split("/")
          return new Date(`${ano}-${mes}-${dia}`)
        }
        return new Date(dateStr)
      }

      const dataA = parseDate(a.data)
      const dataB = parseDate(b.data)
      return dataB.getTime() - dataA.getTime()
    })
  }, [clienteId, clientes])
}
