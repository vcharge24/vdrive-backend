const colorMap = {
  green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  red: "bg-red-50 text-red-700 border border-red-200",
  amber: "bg-amber-50 text-amber-700 border border-amber-200",
  blue: "bg-blue-50 text-blue-700 border border-blue-200",
  purple: "bg-purple-50 text-purple-700 border border-purple-200",
  teal: "bg-teal-50 text-teal-700 border border-teal-200",
  gray: "bg-slate-50 text-slate-600 border border-slate-200",
};

export default function Badge({ children, color = "gray" }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[color] || colorMap.gray}`}>
      {children}
    </span>
  );
}
