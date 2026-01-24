import { Badge } from "@/components/ui/badge"
import type { HistoricoTipo } from "@/hooks/useClienteHistorico"

interface HistoricoBadgeProps {
  tipo: HistoricoTipo
}

export function HistoricoBadge({ tipo }: HistoricoBadgeProps) {
  const badgeMap: Record<HistoricoTipo, React.ReactNode> = {
    interesse: <Badge variant="outline" className="bg-blue-50 text-blue-700">Interesse</Badge>,
    contato: <Badge variant="outline" className="bg-green-50 text-green-700">Contato</Badge>,
    venda: <Badge className="bg-green-600 text-white">Venda</Badge>,
    notificacao: <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Notificação</Badge>,
    cadastro: <Badge variant="outline" className="bg-purple-50 text-purple-700">Cadastro</Badge>,
    followup: <Badge variant="outline" className="bg-blue-50 text-blue-700">Follow-up</Badge>,
    reuniao: <Badge variant="outline" className="bg-indigo-50 text-indigo-700">Reunião</Badge>,
    outro: <Badge variant="outline">Outro</Badge>,
  }

  return <>{badgeMap[tipo] || badgeMap.outro}</>
}
