import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import C from "../../styles/colors";

export default function StatCard({ icon: Icon, value, label, sub, trend, trendUp }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.brandLight }}>
          <Icon size={18} style={{ color: C.brand }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{trend}
          </div>
        )}
      </div>
      <div className="text-xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}
