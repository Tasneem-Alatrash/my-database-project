export default function ConfidenceBar({ value, label }) {
  const clamped = Math.max(0, Math.min(100, value));
  const color = clamped >= 70 ? "bg-primary-500" : clamped >= 40 ? "bg-amber-500" : "bg-red-500";

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-800">{clamped}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
