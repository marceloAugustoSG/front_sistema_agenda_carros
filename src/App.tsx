import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./app/dashboard/layout";
import DashboardHome from "./app/dashboard/Home";
import LoginPage from "./app/login";
import { Toaster } from "./components/ui/sonner";
import LogistasPage from "./app/dashboard/Logistas";
import EstatisticasPage from "./app/dashboard/Estatisticas";
import ConfiguracoesPage from "./app/dashboard/Configuracoes";
import AjudaPage from "./app/dashboard/Ajuda";

export function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="estatisticas" element={<EstatisticasPage />} />
          <Route path="logistas" element={<LogistasPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route path="ajuda" element={<AjudaPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}