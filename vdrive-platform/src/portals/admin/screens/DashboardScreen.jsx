import { BarChart3, AlertCircle, CheckCircle, Zap } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import C from "../../../styles/colors";
import { StatCard, Badge } from "../../../components/shared";
import { REVENUE_MONTHLY, TRANSACTIONS } from "../data/adminData";

export default function DashboardScreen() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Platform Dashboard</h1>
        <p className="text-slate-500 mt-1">Real-time overview of Vdrive operations</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={CreditCard}
          value="AED 2.38M"
          label="Total Revenue"
          sub="Last 7 days"
          trend="+12.5%"
          trendUp
        />
        <StatCard
          icon={Building2}
          value="6"
          label="Active Merchants"
          sub="1 pending"
          trend="+1"
          trendUp
        />
        <StatCard
          icon={Zap}
          value="240"
          label="Total Chargers"
          sub="4 faulted"
          trend="-0.8%"
          trendUp={false}
        />
        <StatCard
          icon={ParkingSquare}
          value="1,520"
          label="Total Parking"
          sub="920 occupied"
          trend="+5.2%"
          trendUp
        />
        <StatCard
          icon={AlertCircle}
          value="4"
          label="Faulted Chargers"
          sub="↑ from 2 yesterday"
          trend="+100%"
          trendUp={false}
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Revenue Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={REVENUE_MONTHLY}>
            <defs>
              <linearGradient id="chargingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.brand} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.brand} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="parkingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.amber} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.amber} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="salikGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.blue} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="month" stroke={C.textLight} />
            <YAxis stroke={C.textLight} />
            <Tooltip
              contentStyle={{
                backgroundColor: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: "8px",
              }}
              formatter={(value) => `AED ${value.toLocaleString()}`}
            />
            <Area
              type="monotone"
              dataKey="charging"
              stackId="1"
              stroke={C.brand}
              fillOpacity={1}
              fill="url(#chargingGradient)"
            />
            <Area
              type="monotone"
              dataKey="parking"
              stackId="1"
              stroke={C.amber}
              fillOpacity={1}
              fill="url(#parkingGradient)"
            />
            <Area
              type="monotone"
              dataKey="salik"
              stackId="1"
              stroke={C.blue}
              fillOpacity={1}
              fill="url(#salikGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: C.brand }}></div>
            <span className="text-slate-600">Charging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: C.amber }}></div>
            <span className="text-slate-600">Parking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: C.blue }}></div>
            <span className="text-slate-600">Salik</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: C.border }}>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">ID</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Type</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Merchant</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Amount</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Method</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Status</th>
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Time</th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((txn) => (
                  <tr
                    key={txn.id}
                    className="border-b hover:bg-slate-50 transition-colors"
                    style={{ borderColor: C.border }}
                  >
                    <td className="py-3 px-3 text-slate-900 font-medium">{txn.id}</td>
                    <td className="py-3 px-3">
                      <Badge color={txn.type === "Charging" ? "teal" : "amber"}>
                        {txn.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{txn.merchant}</td>
                    <td className="py-3 px-3 text-slate-900 font-medium">
                      AED {txn.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{txn.method}</td>
                    <td className="py-3 px-3">
                      <Badge color={txn.status === "completed" ? "green" : "amber"}>
                        {txn.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{txn.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">System Health</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <span className="text-sm text-slate-700">CPMS Gateway</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-medium text-emerald-700">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50">
              <span className="text-sm text-slate-700">ANPR Network</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-xs font-medium text-amber-700">Degraded</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <span className="text-sm text-slate-700">SALIK API</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-medium text-emerald-700">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <span className="text-sm text-slate-700">Supabase DB</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-medium text-emerald-700">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon components for KPI cards
function CreditCard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function Building2(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M3 21v-4a4 4 0 0 1 4-4h3V7a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v2h3a4 4 0 0 1 4 4v10" />
    </svg>
  );
}

function ParkingSquare(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 11h5a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H9V9" />
    </svg>
  );
}
