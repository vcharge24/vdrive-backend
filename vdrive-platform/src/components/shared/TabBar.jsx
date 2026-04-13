export default function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-slate-200 mb-5">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            active === t
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
