import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Zap,
  Car,
  DollarSign,
  Users,
  Radio,
  CreditCard,
  Settings,
  Menu,
  X,
  Bell,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";
import C from "../../styles/colors";
import { Badge } from "../../components/shared";
import DashboardScreen from "./screens/DashboardScreen";
import UsersScreen from "./screens/UsersScreen";
import RolesScreen from "./screens/RolesScreen";
import ScreenEndpointsScreen from "./screens/ScreenEndpointsScreen";
import TenantsManagementScreen from "./screens/TenantsManagementScreen";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "merchants", label: "Merchants", icon: Building2 },
  { id: "sites", label: "Sites", icon: MapPin },
  { id: "chargers", label: "Chargers", icon: Zap },
  { id: "vehicles", label: "Vehicles", icon: Car },
  { id: "tariffs", label: "Tariffs", icon: DollarSign },
  { id: "users", label: "Users", icon: Users },
  { id: "roles", label: "Roles & Access", icon: Shield },
  { id: "endpoints", label: "Screen Endpoints", icon: Layers },
  { id: "tenants", label: "Tenants", icon: Building2 },
  { id: "systems", label: "Systems", icon: Radio },
  { id: "revenue", label: "Revenue", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminPortal() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 flex flex-col border-r`}
        style={{ backgroundColor: C.sidebar, borderColor: C.border }}
      >
        {/* Logo */}
        <div className="p-4 border-b" style={{ borderColor: C.borderLight }}>
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: C.brand }}
            >
              <Zap size={24} className="text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">Vdrive</span>
                <Badge color="teal">ADMIN</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? "bg-teal-600 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
                title={item.label}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Act as Merchant Link */}
        <div className="p-3 border-t" style={{ borderColor: C.borderLight }}>
          <button
            onClick={() => navigate("/merchant")}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors group"
            title="Switch to Merchant Portal"
          >
            <ChevronRight size={20} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            {sidebarOpen && (
              <span className="text-sm font-medium truncate">Act as Merchant →</span>
            )}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="p-3 border-t" style={{ borderColor: C.borderLight }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className="h-16 border-b flex items-center justify-between px-6"
          style={{ backgroundColor: C.white, borderColor: C.border }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Admin</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-medium text-slate-900 capitalize">
              {currentPage}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: C.red }}
              ></span>
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: C.brand }}
              >
                HB
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900">Hany</span>
                <span className="text-xs text-slate-500">CTO</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentPage === "dashboard" && <DashboardScreen />}
          {currentPage === "users" && <UsersScreen />}
          {currentPage === "roles" && <RolesScreen />}
          {currentPage === "endpoints" && <ScreenEndpointsScreen />}
          {currentPage === "tenants" && <TenantsManagementScreen />}
          {currentPage === "merchants" && (
            <div className="text-slate-600">Merchants screen coming soon...</div>
          )}
          {currentPage === "sites" && (
            <div className="text-slate-600">Sites screen coming soon...</div>
          )}
          {currentPage === "chargers" && (
            <div className="text-slate-600">Chargers screen coming soon...</div>
          )}
          {currentPage === "vehicles" && (
            <div className="text-slate-600">Vehicles screen coming soon...</div>
          )}
          {currentPage === "tariffs" && (
            <div className="text-slate-600">Tariffs screen coming soon...</div>
          )}
          {currentPage === "systems" && (
            <div className="text-slate-600">Systems screen coming soon...</div>
          )}
          {currentPage === "revenue" && (
            <div className="text-slate-600">Revenue screen coming soon...</div>
          )}
          {currentPage === "settings" && (
            <div className="text-slate-600">Settings screen coming soon...</div>
          )}
        </div>
      </div>
    </div>
  );
}
