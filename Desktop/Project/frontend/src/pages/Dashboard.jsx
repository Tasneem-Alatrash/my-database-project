import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useLanguage } from "../i18n/LanguageContext";
import { getDashboardStats, getApiErrorMessage } from "../api/client";

const COLORS = ["#059669", "#0d9488", "#34d399", "#14b8a6", "#6ee7b7", "#0f766e", "#a7f3d0", "#10b981", "#047857", "#065f46"];

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(getApiErrorMessage(err, t("common.error"))))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p className="text-center text-gray-400 py-24">{t("common.loading")}</p>;
  if (error) return <p className="text-center text-red-500 py-24">{error}</p>;
  if (!stats) return null;

  const chartData = stats.breakdown_by_material.map((item) => ({
    ...item,
    label: t(`materialTypes.${item.material_type}`),
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">{t("dashboard.title")}</h1>
        <p className="text-gray-600 mt-1">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <StatCard value={stats.total_waste_diverted_kg_month} suffix="kg" label={t("dashboard.totalWaste")} />
        <StatCard value={stats.total_co2_saved_kg_month} suffix="kg" label={t("dashboard.totalCo2")} />
        <StatCard value={stats.total_matches} label={t("dashboard.totalMatches")} />
        <StatCard value={stats.total_listings} label={t("dashboard.totalListings")} />
        <StatCard value={stats.total_factories} label={t("dashboard.totalFactories")} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">{t("dashboard.quantityChartTitle")}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="label" width={90} />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} kg`, t("dashboard.quantityChartTitle")]} />
              <Bar dataKey="quantity_kg_month" name={t("dashboard.quantityChartTitle")} fill="#059669" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">{t("dashboard.co2ChartTitle")}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="co2_saved_kg"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => entry.label}
              >
                {chartData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toLocaleString()} kg`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">
        <h2 className="font-bold text-gray-900 mb-4">{t("dashboard.breakdownTitle")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-start text-gray-400 border-b border-gray-100">
                <th className="py-2 px-3 text-start">{t("classify.materialType")}</th>
                <th className="py-2 px-3 text-start">{t("marketplace.quantity")}</th>
                <th className="py-2 px-3 text-start">{t("dashboard.totalCo2")}</th>
                <th className="py-2 px-3 text-start">{t("dashboard.totalListings")}</th>
              </tr>
            </thead>
            <tbody>
              {stats.breakdown_by_material.map((item) => (
                <tr key={item.material_type} className="border-b border-gray-50">
                  <td className="py-2.5 px-3 font-medium text-gray-800">{t(`materialTypes.${item.material_type}`)}</td>
                  <td className="py-2.5 px-3 text-gray-600">
                    {item.quantity_kg_month.toLocaleString()} {t("common.kgPerMonth")}
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">{item.co2_saved_kg.toLocaleString()} kg</td>
                  <td className="py-2.5 px-3 text-gray-600">{item.listing_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, suffix }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
      <div className="text-2xl font-extrabold text-primary-700">
        {Math.round(value).toLocaleString()}
        {suffix ? <span className="text-sm text-gray-400 ms-1">{suffix}</span> : null}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
