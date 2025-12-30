import { useLocation } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

const pageTitles: Record<string, string> = {
  "/dashboard": "Início",
  "/dashboard/estatisticas": "Estatísticas",
  "/dashboard/veiculos": "Veículos",
  "/dashboard/clientes": "Clientes",
  "/dashboard/interesses": "Interesses",
  "/dashboard/lembretes": "Lembretes",
  "/dashboard/propostas": "Propostas",
  "/dashboard/configuracoes": "Configurações",
  "/dashboard/ajuda": "Ajuda",
}

export function SiteHeader() {
  const location = useLocation()
  
  // Encontra o título correspondente à rota atual
  const getPageTitle = () => {
    // Verifica se a rota exata existe
    if (pageTitles[location.pathname]) {
      return pageTitles[location.pathname]
    }
    
    // Se não encontrar, procura por rotas que começam com o pathname
    const matchingRoute = Object.keys(pageTitles).find(route => 
      location.pathname.startsWith(route) && route !== "/dashboard"
    )
    
    return matchingRoute ? pageTitles[matchingRoute] : "Início"
  }

  return (
    <header 
      className="flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear"
      style={{ height: "var(--header-height)" }}
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
