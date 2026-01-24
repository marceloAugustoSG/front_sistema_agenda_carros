import {
  IconUser,
  IconPhone,
  IconCar,
  IconBell,
  IconCheck,
  IconClock,
} from "@tabler/icons-react"
import type { HistoricoTipo } from "@/hooks/useClienteHistorico"

interface HistoricoIconProps {
  tipo: HistoricoTipo
}

export function HistoricoIcon({ tipo }: HistoricoIconProps) {
  const iconMap: Record<HistoricoTipo, React.ReactNode> = {
    interesse: <IconCar className="size-4 text-blue-600" />,
    contato: <IconPhone className="size-4 text-green-600" />,
    venda: <IconCheck className="size-4 text-green-600" />,
    notificacao: <IconBell className="size-4 text-yellow-600" />,
    cadastro: <IconUser className="size-4 text-purple-600" />,
    followup: <IconPhone className="size-4 text-blue-600" />,
    reuniao: <IconCheck className="size-4 text-indigo-600" />,
    outro: <IconClock className="size-4 text-gray-600" />,
  }

  return <div className="mt-1">{iconMap[tipo] || iconMap.outro}</div>
}
