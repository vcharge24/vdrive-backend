import { useState } from "react";
import { Search, RefreshCw, Camera, CheckCircle2, AlertTriangle, Ban, Video } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge, StatCard, TabBar } from "../../../components/shared";

const C = {
  green: "#10b981", blue: "#3b82f6", amber: "#f59e0b", red: "#ef4444", textLight: "#94a3b8"
};

export default function AnprScreen({ anprEvents, gates, vehicles }) {
  const [tab, setTab] = useState("Live Feed");
  const [matchFilter, setMatchFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredEvents = anprEvents.filter(e => {
    const ms = e.plate.toLowerCase().includes(search.toLowerCase()) ||
      (e.driver || "").toLowerCase().includes(search.toLowerCase()) ||
      e.gate.toLowerCase().includes(search.toLowerCase());
    const mm = matchFilter === "All" || e.match === matchFilter;
    return ms && mm;
  });

  const totalReads = anprEvents.length;
  const successReads = anprEvents.filter(e => e.confidence > 90).length;
  const unmatched = anprEvents.filter(e => e.match === "unregistered" || e.match === "unreadable").length;
  const denied = anprEvents.filter(e => e.action === "Denied").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">ANPR Camera System</h1>
          <p className="text-sm text-slate-500 mt-1">Automatic Number Plate Recognition — {gates.length} cameras active</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="green">System Online</Badge>
          <button className="inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors px-4 py-2 text-sm bg-slate-200 text-slate-700 hover:bg-slate-300">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <TabBar tabs={["Live Feed", "Camera Grid", "Analytics"]} active={tab} onChange={setTab} />

      {tab === "Live Feed" && (
        <div>
          <div className="grid grid-cols-4 gap-3 mb-5">
            <StatCard icon={Camera} value={totalReads} label="Total Reads Today" />
            <StatCard icon={CheckCircle2} value={`${Math.round(successReads / totalReads * 100)}%`} label="Read Accuracy" sub={`${successReads}/${totalReads} reads`} />
            <StatCard icon={AlertTriangle} value={unmatched} label="Unmatched / Unreadable" />
            <StatCard icon={Ban} value={denied} label="Access Denied" />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by plate, driver, or gate..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
              {["All", "registered", "visitor", "unregistered", "blocked", "unreadable"].map(f => (
                <button key={f} onClick={() => setMatchFilter(f)}
                  className={`px-3 py-1.5 text-xs capitalize ${matchFilter === f ? "bg-teal-50 text-teal-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Time</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Plate</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Action</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Gate</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Camera</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Confidence</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Match</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Tenant / Driver</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Level</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(ev => (
                  <tr key={ev.id} className={`border-b border-slate-100 hover:bg-slate-50 ${
                    ev.match === "blocked" ? "bg-red-50/40" : ev.match === "unregistered" || ev.match === "unreadable" ? "bg-amber-50/40" : ""
                  }`}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{ev.time}</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-sm ${
                        ev.match === "blocked" ? "bg-red-100 text-red-800" :
                        ev.match === "unreadable" ? "bg-slate-200 text-slate-500" :
                        "bg-slate-100 text-slate-800"
                      }`}>{ev.plate}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge color={ev.action === "Entry" ? "green" : ev.action === "Exit" ? "blue" : ev.action === "Denied" ? "red" : "amber"}>
                        {ev.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{ev.gate}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{ev.camera}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold ${ev.confidence > 95 ? "text-emerald-600" : ev.confidence > 80 ? "text-amber-600" : "text-red-600"}`}>
                        {ev.confidence}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge color={ev.match === "registered" ? "green" : ev.match === "visitor" ? "blue" : ev.match === "blocked" ? "red" : "amber"}>
                        {ev.match}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-700 text-xs">{ev.tenant || "—"}</div>
                      <div className="text-slate-400 text-xs">{ev.driver || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-xs text-slate-500">{ev.level || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Camera Grid" && (
        <div>
          <div className="grid grid-cols-3 gap-4">
            {gates.map(g => (
              <div key={g.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="relative h-40 bg-slate-900 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/60" />
                  <Video size={32} className="text-slate-600" />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${g.status === "online" ? "bg-emerald-400" : g.status === "degraded" ? "bg-amber-400" : "bg-red-400"}`}
                      style={{ animation: g.status === "online" ? "pulse 2s ease-in-out infinite" : "none" }} />
                    <span className="text-xs text-white/80 font-mono">{g.camera}</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="text-xs text-white/60 font-mono">LIVE</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xs text-white/90 font-medium">{g.name}</div>
                    <div className="text-xs text-white/50">{g.type === "entrance" ? "ENTRANCE" : "EXIT"} · Level {g.level}</div>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge color={g.status === "online" ? "green" : g.status === "degraded" ? "amber" : "red"}>{g.status}</Badge>
                    <span className="text-xs text-slate-500">{g.vehiclesPerHour} v/hr</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Last: {g.lastEvent}</span>
                </div>
              </div>
            ))}
          </div>
          <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
        </div>
      )}

      {tab === "Analytics" && (
        <div>
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Read Confidence Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { range: "< 50%", count: anprEvents.filter(e => e.confidence < 50).length },
                  { range: "50-80%", count: anprEvents.filter(e => e.confidence >= 50 && e.confidence < 80).length },
                  { range: "80-95%", count: anprEvents.filter(e => e.confidence >= 80 && e.confidence < 95).length },
                  { range: "95-100%", count: anprEvents.filter(e => e.confidence >= 95).length },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Match Type Breakdown</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={[
                    { name: "Registered", value: anprEvents.filter(e => e.match === "registered").length, fill: C.green },
                    { name: "Visitor", value: anprEvents.filter(e => e.match === "visitor").length, fill: C.blue },
                    { name: "Unregistered", value: anprEvents.filter(e => e.match === "unregistered").length, fill: C.amber },
                    { name: "Blocked", value: anprEvents.filter(e => e.match === "blocked").length, fill: C.red },
                    { name: "Unreadable", value: anprEvents.filter(e => e.match === "unreadable").length, fill: C.textLight },
                  ]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {[
                  { name: "Registered", color: C.green },
                  { name: "Visitor", color: C.blue },
                  { name: "Unregistered", color: C.amber },
                  { name: "Blocked", color: C.red },
                ].map(l => (
                  <span key={l.name} className="flex items-center gap-1 text-xs text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />{l.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
