import { Download, DollarSign, BatteryCharging, CreditCard, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge, StatCard, Btn } from "../../../components/shared";
import { MERCHANT, DAILY_REVENUE } from "../data/merchantData";

const C = {
  brand: "#0d9488", brandDark: "#0f766e", blue: "#3b82f6"
};

export default function RevenueScreen({ tenants }) {
  const monthlyRev = tenants.reduce((s, t) => s + t.monthlyFee, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Revenue & Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Financial overview for {MERCHANT.name}</p>
        </div>
        <Btn variant="secondary" icon={Download}>Export Report</Btn>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard icon={DollarSign} value={`${(monthlyRev / 1000).toFixed(0)}K`} label="Monthly Parking Rev" sub="AED" trend="+8.2%" trendUp />
        <StatCard icon={BatteryCharging} value="18.5K" label="Monthly Charging Rev" sub="AED" trend="+12.4%" trendUp />
        <StatCard icon={CreditCard} value={`${((monthlyRev + 18500) / 1000).toFixed(0)}K`} label="Total Monthly" sub="AED" />
        <StatCard icon={TrendingUp} value="94%" label="Collection Rate" trend="+2.1%" trendUp />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Weekly Revenue Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={DAILY_REVENUE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="parking" stackId="1" fill={C.brand} stroke={C.brandDark} fillOpacity={0.6} />
            <Area type="monotone" dataKey="charging" stackId="1" fill={C.blue} stroke={C.blue} fillOpacity={0.4} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 justify-center mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: C.brand }} /> Parking Revenue</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: C.blue }} /> Charging Revenue</span>
        </div>
      </div>

      {/* Tenant Revenue Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Revenue by Tenant</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium text-slate-600">Tenant</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Slots</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Vehicles</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">Monthly Fee</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">% of Total</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {tenants.sort((a, b) => b.monthlyFee - a.monthlyFee).map(t => (
              <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{t.name}</td>
                <td className="px-4 py-3 text-center text-slate-600">{t.allocatedSlots}</td>
                <td className="px-4 py-3 text-center text-slate-600">{t.vehicles}</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-800">{t.monthlyFee.toLocaleString()} AED</td>
                <td className="px-4 py-3 text-right text-slate-500">{monthlyRev > 0 ? (t.monthlyFee / monthlyRev * 100).toFixed(1) : 0}%</td>
                <td className="px-4 py-3 text-center"><Badge color={t.status === "active" ? "green" : "amber"}>{t.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
