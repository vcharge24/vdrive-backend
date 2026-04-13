import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Building2, Briefcase, Car, Camera, CreditCard,
  Zap, ChevronRight, ChevronLeft, Bell, LogOut, Shield
} from "lucide-react";
import { Badge } from "../../components/shared";
import { MERCHANT, initBasementLevels, initGates, initTenants, initVehicles, initAnprEvents } from "./data/merchantData";
import MerchantDashboard from "./screens/MerchantDashboard";
import BuildingSetupScreen from "./screens/BuildingSetupScreen";
import TenantsScreen from "./screens/TenantsScreen";
import VehiclesScreen from "./screens/VehiclesScreen";
import AnprScreen from "./screens/AnprScreen";
import RevenueScreen from "./screens/RevenueScreen";

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "building", label: "Building Setup", icon: Building2 },
  { key: "tenants", label: "Tenants", icon: Briefcase },
  { key: "vehicles", label: "Vehicles", icon: Car },
  { key: "anpr", label: "ANPR Cameras", icon: Camera },
  { key: "revenue", label: "Revenue & Reports", icon: CreditCard },
];

export default function MerchantPortal() {
  const navigate = useNavigate();
  const [page, setPage] = useState("dashboard");
  const [sideCollapsed, setSideCollapsed] = useState(false);

  // Stateful data
  const [basements, setBasements] = useState(initBasementLevels);
  const [gates, setGates] = useState(initGates);
  const [tenants, setTenants] = useState(initTenants);
  const [vehicles, setVehicles] = useState(initVehicles);
  const [anprEvents] = useState(initAnprEvents);

  const renderScreen = () => {
    switch (page) {
      case "dashboard":
        return <MerchantDashboard basements={basements} gates={gates} tenants={tenants} vehicles={vehicles} anprEvents={anprEvents} />;
      case "building":
        return <BuildingSetupScreen basements={basements} setBasements={setBasements} gates={gates} setGates={setGates} />;
      case "tenants":
        return <TenantsScreen tenants={tenants} setTenants={setTenants} vehicles={vehicles} />;
      case "vehicles":
        return <VehiclesScreen vehicles={vehicles} setVehicles={setVehicles} tenants={tenants} />;
      case "anpr":
        return <AnprScreen anprEvents={anprEvents} gates={gates} vehicles={vehicles} />;
      case "revenue":
        return <RevenueScreen tenants={tenants} />;
      default:
        return <MerchantDashboard basements={basements} gates={gates} tenants={tenants} vehicles={vehicles} anprEvents={anprEvents} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Sidebar */}
      <aside className={`${sideCollapsed ? "w-16" : "w-56"} bg-slate-900 flex flex-col transition-all duration-200 shrink-0`}>
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-slate-800">
          {!sideCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center"><Zap size={16} className="text-white" /></div>
              <span className="text-base font-bold text-white tracking-tight">Vdrive</span>
              <span className="text-[10px] font-medium text-amber-400 bg-amber-900/50 px-1.5 py-0.5 rounded ml-1">MERCHANT</span>
            </div>
          )}
          {sideCollapsed && <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center mx-auto"><Zap size={16} className="text-white" /></div>}
        </div>

        {/* Merchant Info */}
        {!sideCollapsed && (
          <div className="px-3 py-3 border-b border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Acting as Merchant</div>
            <div className="text-sm font-medium text-white truncate">{MERCHANT.fullName}</div>
            <div className="text-xs text-teal-400">{MERCHANT.subType}</div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {NAV.map(n => {
            const active = page === n.key;
            return (
              <button key={n.key} onClick={() => setPage(n.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-slate-700/60 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}>
                <n.icon size={18} className={active ? "text-teal-400" : ""} />
                {!sideCollapsed && <span>{n.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Back to Admin */}
        {!sideCollapsed && (
          <div className="px-2 pb-2">
            <button onClick={() => navigate("/admin")} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-amber-400 hover:bg-slate-800 transition-colors">
              <LogOut size={16} />
              <span>Back to Admin Portal</span>
            </button>
          </div>
        )}

        <button onClick={() => setSideCollapsed(!sideCollapsed)}
          className="flex items-center justify-center py-3 border-t border-slate-800 text-slate-500 hover:text-slate-300">
          {sideCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Vdrive Merchant Portal</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-sm font-medium text-slate-800">{NAV.find(n => n.key === page)?.label}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
              <Shield size={12} className="text-amber-600" />
              <span className="text-xs font-medium text-amber-700">Admin Impersonation</span>
            </div>
            <button className="relative p-2 rounded-lg hover:bg-slate-100">
              <Bell size={18} className="text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-medium">HB</div>
              <span className="text-sm text-slate-700">Hany</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}
