import { useState } from "react";
import { Plus, Edit3, Trash2, Layers, ParkingCircle, BatteryCharging, Zap, DoorOpen, DoorClosed, Camera, Wifi, Camera as CameraIcon } from "lucide-react";
import { Badge, StatCard, Modal, InputField, Btn, TabBar } from "../../../components/shared";

const C = {
  brand: "#0d9488", red: "#ef4444", green: "#10b981", amber: "#f59e0b"
};

export default function BuildingSetupScreen({ basements, setBasements, gates, setGates }) {
  const [tab, setTab] = useState("Basement Levels");
  const [showAddLevel, setShowAddLevel] = useState(false);
  const [showAddGate, setShowAddGate] = useState(false);

  // New level form
  const [newLevel, setNewLevel] = useState({ name: "", totalSlots: 80, evSlots: 8, handicapSlots: 4, chargers: 4 });
  // New gate form
  const [newGate, setNewGate] = useState({ name: "", type: "entrance", level: "B1", camera: "" });

  const addLevel = () => {
    const nextNum = basements.length + 1;
    const lvl = {
      id: `B${nextNum}`, name: newLevel.name || `Basement ${nextNum}`, level: -nextNum,
      totalSlots: parseInt(newLevel.totalSlots) || 80, evSlots: parseInt(newLevel.evSlots) || 8,
      handicapSlots: parseInt(newLevel.handicapSlots) || 4, status: "active", occupancy: 0,
      chargers: parseInt(newLevel.chargers) || 4,
    };
    setBasements([...basements, lvl]);
    setNewLevel({ name: "", totalSlots: 80, evSlots: 8, handicapSlots: 4, chargers: 4 });
    setShowAddLevel(false);
  };

  const addGate = () => {
    const nextId = `G${String(gates.length + 1).padStart(3, "0")}`;
    const g = {
      id: nextId, name: newGate.name || `Gate ${gates.length + 1}`, type: newGate.type,
      level: newGate.level, camera: newGate.camera || `CAM-${nextId}`,
      status: "online", barrier: "up", vehiclesPerHour: 0, lastEvent: "--:--:--",
    };
    setGates([...gates, g]);
    setNewGate({ name: "", type: "entrance", level: "B1", camera: "" });
    setShowAddGate(false);
  };

  const removeLevel = (id) => setBasements(basements.filter(b => b.id !== id));
  const removeGate = (id) => setGates(gates.filter(g => g.id !== id));

  const totalSlots = basements.reduce((s, b) => s + b.totalSlots, 0);
  const totalEV = basements.reduce((s, b) => s + b.evSlots, 0);
  const totalChargers = basements.reduce((s, b) => s + b.chargers, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Building Setup</h1>
          <p className="text-sm text-slate-500 mt-1">Configure basement parking levels, entry/exit gates, and ANPR cameras</p>
        </div>
      </div>

      <TabBar tabs={["Basement Levels", "Entrance & Exit Gates"]} active={tab} onChange={setTab} />

      {tab === "Basement Levels" && (
        <div>
          <div className="grid grid-cols-4 gap-3 mb-5">
            <StatCard icon={Layers} value={basements.length} label="Basement Levels" />
            <StatCard icon={ParkingCircle} value={totalSlots} label="Total Parking Slots" />
            <StatCard icon={BatteryCharging} value={totalEV} label="EV Designated Slots" />
            <StatCard icon={Zap} value={totalChargers} label="EV Chargers" />
          </div>

          <div className="flex justify-end mb-4">
            <Btn icon={Plus} onClick={() => setShowAddLevel(true)}>Add Basement Level</Btn>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Level</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Floor</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Total Slots</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">EV Slots</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Handicap</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Chargers</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Occupancy</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {basements.map(b => (
                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-800">{b.name}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono">{b.level}</td>
                    <td className="px-4 py-3 text-center font-semibold">{b.totalSlots}</td>
                    <td className="px-4 py-3 text-center"><span className="text-teal-600 font-medium">{b.evSlots}</span></td>
                    <td className="px-4 py-3 text-center text-slate-600">{b.handicapSlots}</td>
                    <td className="px-4 py-3 text-center"><span className="text-blue-600 font-medium">{b.chargers}</span></td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{
                            width: `${b.occupancy}%`,
                            background: b.occupancy > 85 ? C.red : b.occupancy > 60 ? C.amber : C.green
                          }} />
                        </div>
                        <span className="text-xs text-slate-500">{b.occupancy}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center"><Badge color={b.status === "active" ? "green" : "red"}>{b.status}</Badge></td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 rounded hover:bg-slate-100"><Edit3 size={14} className="text-slate-400" /></button>
                        <button className="p-1.5 rounded hover:bg-red-50" onClick={() => removeLevel(b.id)}><Trash2 size={14} className="text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showAddLevel && (
            <Modal title="Add Basement Level" onClose={() => setShowAddLevel(false)}>
              <InputField label="Level Name" value={newLevel.name} onChange={v => setNewLevel({ ...newLevel, name: v })} placeholder={`Basement ${basements.length + 1}`} required />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Total Parking Slots" type="number" value={newLevel.totalSlots} onChange={v => setNewLevel({ ...newLevel, totalSlots: v })} required />
                <InputField label="EV Designated Slots" type="number" value={newLevel.evSlots} onChange={v => setNewLevel({ ...newLevel, evSlots: v })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Handicap Slots" type="number" value={newLevel.handicapSlots} onChange={v => setNewLevel({ ...newLevel, handicapSlots: v })} />
                <InputField label="EV Chargers" type="number" value={newLevel.chargers} onChange={v => setNewLevel({ ...newLevel, chargers: v })} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Btn variant="secondary" onClick={() => setShowAddLevel(false)}>Cancel</Btn>
                <Btn icon={Plus} onClick={addLevel}>Create Level</Btn>
              </div>
            </Modal>
          )}
        </div>
      )}

      {tab === "Entrance & Exit Gates" && (
        <div>
          <div className="grid grid-cols-4 gap-3 mb-5">
            <StatCard icon={DoorOpen} value={gates.filter(g => g.type === "entrance").length} label="Entrance Gates" />
            <StatCard icon={DoorClosed} value={gates.filter(g => g.type === "exit").length} label="Exit Gates" />
            <StatCard icon={CameraIcon} value={gates.length} label="ANPR Cameras" />
            <StatCard icon={Wifi} value={gates.filter(g => g.status === "online").length} label="Online" sub={`${gates.filter(g => g.status !== "online").length} degraded/offline`} />
          </div>

          <div className="flex justify-end mb-4">
            <Btn icon={Plus} onClick={() => setShowAddGate(true)}>Add Gate</Btn>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Gate</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Type</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Level</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">ANPR Camera</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Barrier</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Vehicles/hr</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Last Event</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gates.map(g => (
                  <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{g.name}</div>
                      <div className="text-xs text-slate-400">{g.id}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge color={g.type === "entrance" ? "green" : "blue"}>{g.type === "entrance" ? "Entrance" : "Exit"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-600">{g.level}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Camera size={14} className="text-slate-400" />
                        <span className="font-mono text-xs text-slate-600">{g.camera}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${g.barrier === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {g.barrier === "up" ? "▲ UP" : "▼ DOWN"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-700">{g.vehiclesPerHour}</td>
                    <td className="px-4 py-3 text-center"><Badge color={g.status === "online" ? "green" : g.status === "degraded" ? "amber" : "red"}>{g.status}</Badge></td>
                    <td className="px-4 py-3 text-center font-mono text-xs text-slate-500">{g.lastEvent}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 rounded hover:bg-slate-100"><Edit3 size={14} className="text-slate-400" /></button>
                        <button className="p-1.5 rounded hover:bg-red-50" onClick={() => removeGate(g.id)}><Trash2 size={14} className="text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showAddGate && (
            <Modal title="Add Gate" onClose={() => setShowAddGate(false)}>
              <InputField label="Gate Name" value={newGate.name} onChange={v => setNewGate({ ...newGate, name: v })} placeholder="e.g. Main Entrance C" required />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Gate Type" value={newGate.type} onChange={v => setNewGate({ ...newGate, type: v })} options={["entrance", "exit"]} required />
                <InputField label="Connected Level" value={newGate.level} onChange={v => setNewGate({ ...newGate, level: v })}
                  options={basements.map(b => ({ value: b.id, label: b.name }))} required />
              </div>
              <InputField label="ANPR Camera ID" value={newGate.camera} onChange={v => setNewGate({ ...newGate, camera: v })} placeholder="e.g. CAM-ENT-C" />
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Camera size={14} className="text-teal-600" />
                  ANPR camera will be auto-provisioned and linked to this gate
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Btn variant="secondary" onClick={() => setShowAddGate(false)}>Cancel</Btn>
                <Btn icon={Plus} onClick={addGate}>Create Gate</Btn>
              </div>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}
