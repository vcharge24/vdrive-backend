import { useState } from "react";
import { Plus, Search, Eye, Edit3, Briefcase, ParkingCircle, Car, DollarSign } from "lucide-react";
import { Badge, StatCard, Modal, InputField, Btn } from "../../../components/shared";
import { MERCHANT } from "../data/merchantData";

export default function TenantsScreen({ tenants, setTenants, vehicles }) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newTenant, setNewTenant] = useState({ name: "", floor: "", type: "Corporate", contact: "", email: "", phone: "", allocatedSlots: 20, monthlyFee: 10000, leaseEnd: "" });

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase()) ||
    t.contact.toLowerCase().includes(search.toLowerCase())
  );

  const addTenant = () => {
    const nextId = `T${String(tenants.length + 1).padStart(3, "0")}`;
    const t = {
      id: nextId, name: newTenant.name, floor: newTenant.floor, type: newTenant.type,
      contact: newTenant.contact, email: newTenant.email, phone: newTenant.phone,
      status: "active", allocatedSlots: parseInt(newTenant.allocatedSlots) || 20,
      vehicles: 0, monthlyFee: parseInt(newTenant.monthlyFee) || 10000,
      leaseEnd: newTenant.leaseEnd || "2028-12-31",
    };
    setTenants([...tenants, t]);
    setNewTenant({ name: "", floor: "", type: "Corporate", contact: "", email: "", phone: "", allocatedSlots: 20, monthlyFee: 10000, leaseEnd: "" });
    setShowAdd(false);
  };

  const totalAllocated = tenants.reduce((s, t) => s + t.allocatedSlots, 0);
  const totalMonthly = tenants.reduce((s, t) => s + t.monthlyFee, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tenant Management</h1>
          <p className="text-sm text-slate-500 mt-1">{tenants.length} tenants in {MERCHANT.name}</p>
        </div>
        <Btn icon={Plus} onClick={() => setShowAdd(true)}>Add Tenant</Btn>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon={Briefcase} value={tenants.filter(t => t.status === "active").length} label="Active Tenants" />
        <StatCard icon={ParkingCircle} value={totalAllocated} label="Allocated Slots" />
        <StatCard icon={Car} value={tenants.reduce((s, t) => s + t.vehicles, 0)} label="Registered Vehicles" />
        <StatCard icon={DollarSign} value={`${(totalMonthly / 1000).toFixed(0)}K AED`} label="Monthly Parking Revenue" />
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenants..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium text-slate-600">Tenant</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Floor(s)</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Type</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Contact</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Slots</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Vehicles</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">Monthly Fee</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Status</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => {
              const tenantVehicles = vehicles.filter(v => v.tenantId === t.id);
              return (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => setSelected(t)}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.id}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{t.floor}</td>
                  <td className="px-4 py-3"><Badge color="purple">{t.type}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="text-slate-700">{t.contact}</div>
                    <div className="text-xs text-slate-400">{t.email}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-slate-800">{t.allocatedSlots}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-semibold ${tenantVehicles.length > t.allocatedSlots ? "text-red-600" : "text-slate-700"}`}>
                      {tenantVehicles.length}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-700">{t.monthlyFee.toLocaleString()} AED</td>
                  <td className="px-4 py-3 text-center"><Badge color={t.status === "active" ? "green" : "amber"}>{t.status}</Badge></td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded hover:bg-slate-100" onClick={e => { e.stopPropagation(); setSelected(t); }}><Eye size={14} className="text-slate-400" /></button>
                      <button className="p-1.5 rounded hover:bg-slate-100"><Edit3 size={14} className="text-slate-400" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tenant Detail Modal */}
      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)} wide>
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: "Floor(s)", value: selected.floor },
              { label: "Type", value: selected.type },
              { label: "Contact", value: selected.contact },
              { label: "Email", value: selected.email },
              { label: "Phone", value: selected.phone },
              { label: "Lease End", value: selected.leaseEnd },
            ].map(f => (
              <div key={f.label}>
                <div className="text-xs text-slate-500 mb-0.5">{f.label}</div>
                <div className="text-sm font-medium text-slate-800">{f.value}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-teal-50 rounded-lg p-3 text-center border border-teal-200">
              <div className="text-lg font-bold text-teal-700">{selected.allocatedSlots}</div>
              <div className="text-xs text-teal-600">Allocated Slots</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
              <div className="text-lg font-bold text-blue-700">{vehicles.filter(v => v.tenantId === selected.id).length}</div>
              <div className="text-xs text-blue-600">Registered Vehicles</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-200">
              <div className="text-lg font-bold text-amber-700">{selected.monthlyFee.toLocaleString()}</div>
              <div className="text-xs text-amber-600">Monthly Fee (AED)</div>
            </div>
          </div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Registered Vehicles</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {vehicles.filter(v => v.tenantId === selected.id).length > 0 ? (
              vehicles.filter(v => v.tenantId === selected.id).map(v => (
                <div key={v.id} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 bg-slate-50">
                  <Car size={14} className="text-slate-400" />
                  <span className="font-mono text-sm font-semibold text-slate-800">{v.plate}</span>
                  <span className="text-xs text-slate-500">{v.make} {v.model}</span>
                  <span className="text-xs text-slate-500">{v.driver}</span>
                  {v.ev && <Badge color="teal">EV</Badge>}
                  {v.currentlyParked && <Badge color="green">Parked</Badge>}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-slate-400">No vehicles registered yet</div>
            )}
          </div>
        </Modal>
      )}

      {/* Add Tenant Modal */}
      {showAdd && (
        <Modal title="Add New Tenant" onClose={() => setShowAdd(false)} wide>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Company Name" value={newTenant.name} onChange={v => setNewTenant({ ...newTenant, name: v })} placeholder="e.g. McKinsey & Co" required />
            <InputField label="Floor(s)" value={newTenant.floor} onChange={v => setNewTenant({ ...newTenant, floor: v })} placeholder="e.g. 17-18" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Industry Type" value={newTenant.type} onChange={v => setNewTenant({ ...newTenant, type: v })}
              options={["Corporate", "Consulting", "Banking", "Retail HQ", "Co-Working", "Energy", "Logistics", "Healthcare", "Technology", "Government"]} />
            <InputField label="Contact Person" value={newTenant.contact} onChange={v => setNewTenant({ ...newTenant, contact: v })} placeholder="Full name" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Email" type="email" value={newTenant.email} onChange={v => setNewTenant({ ...newTenant, email: v })} placeholder="contact@company.ae" />
            <InputField label="Phone" value={newTenant.phone} onChange={v => setNewTenant({ ...newTenant, phone: v })} placeholder="+971 XX XXX XXXX" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <InputField label="Allocated Parking Slots" type="number" value={newTenant.allocatedSlots} onChange={v => setNewTenant({ ...newTenant, allocatedSlots: v })} required />
            <InputField label="Monthly Fee (AED)" type="number" value={newTenant.monthlyFee} onChange={v => setNewTenant({ ...newTenant, monthlyFee: v })} required />
            <InputField label="Lease End Date" type="date" value={newTenant.leaseEnd} onChange={v => setNewTenant({ ...newTenant, leaseEnd: v })} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn icon={Plus} onClick={addTenant} disabled={!newTenant.name || !newTenant.floor}>Create Tenant</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
