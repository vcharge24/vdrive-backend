import { useState } from "react";
import { Plus, Search, Upload, Eye, Ban, Edit3, CheckCircle2, Car, ParkingCircle, BatteryCharging, Users, AlertTriangle, Camera, Check } from "lucide-react";
import { Badge, StatCard, Modal, InputField, Btn } from "../../../components/shared";

export default function VehiclesScreen({ vehicles, setVehicles, tenants }) {
  const [search, setSearch] = useState("");
  const [passFilter, setPassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newVeh, setNewVeh] = useState({ plate: "", make: "", model: "", color: "White", year: "2025", ev: false, tenantId: "", driver: "", phone: "", passType: "Monthly" });

  const filtered = vehicles.filter(v => {
    const ms = v.plate.toLowerCase().includes(search.toLowerCase()) ||
      v.driver.toLowerCase().includes(search.toLowerCase()) ||
      `${v.make} ${v.model}`.toLowerCase().includes(search.toLowerCase());
    const mp = passFilter === "All" || v.passType === passFilter;
    const mst = statusFilter === "All" || v.status === statusFilter;
    return ms && mp && mst;
  });

  const addVehicle = () => {
    const nextId = `VH${String(vehicles.length + 1).padStart(3, "0")}`;
    const v = {
      id: nextId, plate: newVeh.plate.toUpperCase(), make: newVeh.make, model: newVeh.model,
      color: newVeh.color, year: parseInt(newVeh.year), ev: newVeh.ev,
      tenantId: newVeh.tenantId || null, driver: newVeh.driver, phone: newVeh.phone,
      passType: newVeh.passType, status: "active", registered: "2026-04-13",
      lastEntry: null, lastExit: null, currentlyParked: false, level: null, slot: null,
    };
    setVehicles([...vehicles, v]);
    setNewVeh({ plate: "", make: "", model: "", color: "White", year: "2025", ev: false, tenantId: "", driver: "", phone: "", passType: "Monthly" });
    setShowAdd(false);
  };

  const toggleBlock = (id) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, status: v.status === "blocked" ? "active" : "blocked" } : v));
  };

  const parkedCount = vehicles.filter(v => v.currentlyParked).length;
  const evCount = vehicles.filter(v => v.ev).length;
  const flaggedCount = vehicles.filter(v => v.status === "flagged" || v.status === "blocked").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Vehicle Registry</h1>
          <p className="text-sm text-slate-500 mt-1">{vehicles.length} vehicles registered · {parkedCount} currently parked</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" icon={Upload}>Bulk Import</Btn>
          <Btn icon={Plus} onClick={() => setShowAdd(true)}>Add Vehicle</Btn>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-5">
        <StatCard icon={Car} value={vehicles.length} label="Total Vehicles" />
        <StatCard icon={ParkingCircle} value={parkedCount} label="Currently Parked" />
        <StatCard icon={BatteryCharging} value={evCount} label="Electric (EV)" />
        <StatCard icon={Users} value={vehicles.filter(v => v.passType === "Monthly").length} label="Monthly Pass" />
        <StatCard icon={AlertTriangle} value={flaggedCount} label="Flagged / Blocked" />
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by plate number, driver, or vehicle..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
        </div>
        <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
          {["All", "Monthly", "Visitor", "Unregistered"].map(f => (
            <button key={f} onClick={() => setPassFilter(f)}
              className={`px-3 py-1.5 text-xs ${passFilter === f ? "bg-teal-50 text-teal-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`}>{f}</button>
          ))}
        </div>
        <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
          {["All", "active", "flagged", "blocked"].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 text-xs capitalize ${statusFilter === f ? "bg-teal-50 text-teal-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium text-slate-600">Plate Number</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Vehicle</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Driver</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Tenant</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Pass</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Parked</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Location</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Status</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => {
              const tenant = tenants.find(t => t.id === v.tenantId);
              return (
                <tr key={v.id} className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${v.status === "flagged" ? "bg-amber-50/50" : v.status === "blocked" ? "bg-red-50/30" : ""}`}
                  onClick={() => setSelected(v)}>
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">{v.plate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-800">{v.make} {v.model}</div>
                    <div className="text-xs text-slate-400">{v.color} · {v.year} {v.ev ? "· EV" : ""}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{v.driver}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{tenant?.name || <span className="text-slate-400 italic">—</span>}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge color={v.passType === "Monthly" ? "teal" : v.passType === "Visitor" ? "blue" : "amber"}>{v.passType}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {v.currentlyParked ?
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium"><CheckCircle2 size={12} /> Yes</span> :
                      <span className="text-xs text-slate-400">No</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-slate-500">
                    {v.currentlyParked ? `${v.level} / ${v.slot}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge color={v.status === "active" ? "green" : v.status === "flagged" ? "amber" : "red"}>{v.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded hover:bg-slate-100" onClick={e => { e.stopPropagation(); }}><Eye size={14} className="text-slate-400" /></button>
                      <button className="p-1.5 rounded hover:bg-red-50" onClick={e => { e.stopPropagation(); toggleBlock(v.id); }}>
                        <Ban size={14} className={v.status === "blocked" ? "text-emerald-500" : "text-red-400"} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Vehicle Modal */}
      {showAdd && (
        <Modal title="Register New Vehicle" onClose={() => setShowAdd(false)} wide>
          <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 mb-5">
            <div className="flex items-center gap-2 text-sm text-teal-700">
              <Camera size={14} />
              Vehicle will be registered with ANPR system — plate number will be auto-recognized at gates
            </div>
          </div>
          <InputField label="Plate Number" value={newVeh.plate} onChange={v => setNewVeh({ ...newVeh, plate: v })} placeholder="e.g. A 12345 DXB" required />
          <div className="grid grid-cols-3 gap-3">
            <InputField label="Make" value={newVeh.make} onChange={v => setNewVeh({ ...newVeh, make: v })} placeholder="e.g. Tesla" required />
            <InputField label="Model" value={newVeh.model} onChange={v => setNewVeh({ ...newVeh, model: v })} placeholder="e.g. Model 3" required />
            <InputField label="Year" value={newVeh.year} onChange={v => setNewVeh({ ...newVeh, year: v })} options={["2026", "2025", "2024", "2023", "2022", "2021"]} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <InputField label="Color" value={newVeh.color} onChange={v => setNewVeh({ ...newVeh, color: v })}
              options={["White", "Black", "Silver", "Grey", "Blue", "Red", "Green", "Pearl"]} />
            <InputField label="Pass Type" value={newVeh.passType} onChange={v => setNewVeh({ ...newVeh, passType: v })}
              options={["Monthly", "Visitor", "Temporary"]} />
            <InputField label="Assign to Tenant" value={newVeh.tenantId} onChange={v => setNewVeh({ ...newVeh, tenantId: v })}
              options={[{ value: "", label: "— No Tenant —" }, ...tenants.map(t => ({ value: t.id, label: t.name }))]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Driver Name" value={newVeh.driver} onChange={v => setNewVeh({ ...newVeh, driver: v })} placeholder="Full name" required />
            <InputField label="Driver Phone" value={newVeh.phone} onChange={v => setNewVeh({ ...newVeh, phone: v })} placeholder="+971 XX XXX XXXX" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" checked={newVeh.ev} onChange={e => setNewVeh({ ...newVeh, ev: e.target.checked })}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
            <label className="text-sm text-slate-700">This is an Electric Vehicle (EV)</label>
          </div>
          <div className="flex justify-end gap-2">
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn icon={Plus} onClick={addVehicle} disabled={!newVeh.plate || !newVeh.make || !newVeh.driver}>Register Vehicle</Btn>
          </div>
        </Modal>
      )}

      {/* Vehicle Detail Modal */}
      {selected && (
        <Modal title={`${selected.plate}`} onClose={() => setSelected(null)} wide>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: selected.ev ? "#ccfbf1" : "#f1f5f9" }}>
              <Car size={22} style={{ color: selected.ev ? "#0d9488" : "#64748b" }} />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-800">{selected.make} {selected.model}</div>
              <div className="text-sm text-slate-500">{selected.color} · {selected.year} {selected.ev ? "· Electric" : "· ICE"}</div>
            </div>
            <div className="ml-auto flex gap-2">
              <Badge color={selected.status === "active" ? "green" : selected.status === "flagged" ? "amber" : "red"}>{selected.status}</Badge>
              <Badge color={selected.passType === "Monthly" ? "teal" : "blue"}>{selected.passType}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: "Driver", value: selected.driver },
              { label: "Phone", value: selected.phone || "—" },
              { label: "Tenant", value: tenants.find(t => t.id === selected.tenantId)?.name || "—" },
              { label: "Registered", value: selected.registered || "—" },
              { label: "Last Entry", value: selected.lastEntry || "—" },
              { label: "Last Exit", value: selected.lastExit || "—" },
            ].map(f => (
              <div key={f.label}>
                <div className="text-xs text-slate-500 mb-0.5">{f.label}</div>
                <div className="text-sm font-medium text-slate-800">{f.value}</div>
              </div>
            ))}
          </div>
          {selected.currentlyParked && (
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 mb-4 flex items-center gap-3">
              <ParkingCircle size={18} className="text-emerald-600" />
              <div className="text-sm text-emerald-800">Currently parked at <strong>{selected.level} / {selected.slot}</strong></div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-200">
            <Btn variant="secondary" icon={Edit3}>Edit</Btn>
            <Btn variant={selected.status === "blocked" ? "success" : "danger"} icon={selected.status === "blocked" ? Check : Ban}
              onClick={() => { toggleBlock(selected.id); setSelected(null); }}>
              {selected.status === "blocked" ? "Unblock" : "Block Vehicle"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
