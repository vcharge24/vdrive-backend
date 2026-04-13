import { Shield, Clock, ParkingCircle, Layers, DoorOpen, Users, BatteryCharging, DollarSign, ArrowDown, ArrowUp, Ban, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge, StatCard } from "../../../components/shared";
import { MERCHANT, HOURLY_TRAFFIC } from "../data/merchantData";

const C = {
  brand: "#0d9488", red: "#ef4444", green: "#10b981", amber: "#f59e0b", brandLight: "#ccfbf1"
};

export default function MerchantDashboard({ basements, gates, tenants, vehicles, anprEvents }) {
  const totalSlots = basements.reduce((s, b) => s + b.totalSlots, 0);
  const parkedNow = vehicles.filter(v => v.currentlyParked).length;
  const occupancyPct = totalSlots > 0 ? Math.round((parkedNow / totalSlots) * 100) : 0;
  const evParked = vehicles.filter(v => v.currentlyParked && v.ev).length;
  const unregistered = anprEvents.filter(e => e.match === "unregistered" || e.match === "unreadable").length;
  const entranceGates = gates.filter(g => g.type === "entrance");
  const exitGates = gates.filter(g => g.type === "exit");
  const onlineGates = gates.filter(g => g.status === "online").length;
  const activeTenants = tenants.filter(t => t.status === "active").length;
  const monthlyRev = tenants.reduce((s, t) => s + t.monthlyFee, 0);

  return (
    <div>
      {/* Admin impersonation banner */}
      <div className="mb-5 px-4 py-3 rounded-lg border-2 border-amber-300 bg-amber-50 flex items-center gap-3">
        <Shield size={18} className="text-amber-600" />
        <div className="flex-1">
          <span className="text-sm font-semibold text-amber-800">Vdrive Admin Mode</span>
          <span className="text-sm text-amber-700 ml-2">You are viewing as merchant: <strong>{MERCHANT.fullName}</strong></span>
        </div>
        <Badge color="amber">Impersonating</Badge>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{MERCHANT.name} Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Commercial Building Tower — {MERCHANT.zone}, {MERCHANT.emirate}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={14} /> Live — April 13, 2026 10:25 AM
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        <StatCard icon={ParkingCircle} value={`${parkedNow}/${totalSlots}`} label="Parking Occupancy" sub={`${occupancyPct}% full`} trend={`${occupancyPct}%`} trendUp={occupancyPct < 85} />
        <StatCard icon={Layers} value={basements.length} label="Basement Levels" sub={`${totalSlots} total slots`} />
        <StatCard icon={DoorOpen} value={`${entranceGates.length}E / ${exitGates.length}X`} label="Gates" sub={`${onlineGates}/${gates.length} online`} trend={`${onlineGates}`} trendUp />
        <StatCard icon={Users} value={activeTenants} label="Active Tenants" sub={`${tenants.length} total`} />
        <StatCard icon={BatteryCharging} value={evParked} label="EV Parked Now" sub={`${basements.reduce((s, b) => s + b.chargers, 0)} chargers`} />
        <StatCard icon={DollarSign} value={`${(monthlyRev / 1000).toFixed(0)}K`} label="Monthly Revenue" sub="AED" trend="+8.2%" trendUp />
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Traffic Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Hourly Traffic Today</h3>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: C.brand }} /> Entries</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: C.red }} /> Exits</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={HOURLY_TRAFFIC}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="entries" fill={C.brand} radius={[3, 3, 0, 0]} />
              <Bar dataKey="exits" fill={C.red} radius={[3, 3, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy by Level */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Occupancy by Level</h3>
          {basements.map(b => {
            const pct = b.totalSlots > 0 ? Math.round((b.occupancy / 100) * b.totalSlots) : 0;
            return (
              <div key={b.id} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700">{b.name}</span>
                  <span className="text-xs text-slate-500">{b.occupancy}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${b.occupancy}%`,
                    background: b.occupancy > 85 ? C.red : b.occupancy > 60 ? C.amber : C.green
                  }} />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>{pct}/{b.totalSlots} slots</span>
                  <span>{b.evSlots} EV · {b.chargers} chargers</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live ANPR & Alerts Row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Recent ANPR */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Latest ANPR Events</h3>
            <Badge color="green">Live</Badge>
          </div>
          <div className="space-y-2">
            {anprEvents.slice(0, 6).map(ev => (
              <div key={ev.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  ev.action === "Entry" ? "bg-emerald-50" : ev.action === "Exit" ? "bg-blue-50" : ev.action === "Denied" ? "bg-red-50" : "bg-amber-50"
                }`}>
                  {ev.action === "Entry" ? <ArrowDown size={14} className="text-emerald-600" /> :
                   ev.action === "Exit" ? <ArrowUp size={14} className="text-blue-600" /> :
                   ev.action === "Denied" ? <Ban size={14} className="text-red-600" /> :
                   <AlertTriangle size={14} className="text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-semibold text-slate-800">{ev.plate}</span>
                    <Badge color={ev.match === "registered" ? "green" : ev.match === "visitor" ? "blue" : ev.match === "blocked" ? "red" : "amber"}>
                      {ev.match}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 truncate">{ev.gate} · {ev.camera} · {ev.confidence}% conf</div>
                </div>
                <span className="text-xs text-slate-400 font-mono">{ev.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gate Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Gate Status</h3>
          <div className="space-y-2">
            {gates.map(g => (
              <div key={g.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${g.type === "entrance" ? "bg-emerald-50" : "bg-blue-50"}`}>
                  {g.type === "entrance" ? <DoorOpen size={14} className="text-emerald-600" /> : <ArrowUp size={14} className="text-blue-600" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{g.name}</div>
                  <div className="text-xs text-slate-500">{g.camera} · {g.vehiclesPerHour} vehicles/hr</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge color={g.status === "online" ? "green" : g.status === "degraded" ? "amber" : "red"}>{g.status}</Badge>
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${g.barrier === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {g.barrier === "up" ? "↑" : "↓"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
