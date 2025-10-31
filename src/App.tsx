import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./app/dashboard/layout";
import DashboardHome from "./app/dashboard/Home";
import LoginPage from "./app/login";
import { Toaster } from "./components/ui/sonner";
import SettingsPage from "./app/dashboard/Settings";
import LogistasPage from "./app/dashboard/Logistas";
import HelpPage from "./app/dashboard/Help";
import AnalyticsPage from "./app/dashboard/Estatisticas";

export function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="estatisticas" element={<AnalyticsPage />} />
          <Route path="logistas" element={<LogistasPage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
          <Route path="ajuda" element={<HelpPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}