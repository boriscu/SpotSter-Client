import { Routes, Route } from "react-router-dom";
import LandingPage from "@/components/landing/LandingPage";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/components/admin/Dashboard";
import StoreManager from "@/components/admin/StoreManager";
import MonsterManager from "@/components/admin/MonsterManager";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="stores" element={<StoreManager />} />
        <Route path="monsters" element={<MonsterManager />} />
      </Route>
    </Routes>
  );
}
