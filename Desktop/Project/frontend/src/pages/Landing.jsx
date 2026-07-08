import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { getDashboardStats } from "../api/client";

export default function Landing() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  const steps = [
    { title: t("landing.step1Title"), desc: t("landing.step1Desc"), emoji: "📷" },
    { title: t("landing.step2Title"), desc: t("landing.step2Desc"), emoji: "🤖" },
    { title: t("landing.step3Title"), desc: t("landing.step3Desc"), emoji: "🔗" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 via-teal-50 to-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            {t("landing.heroTitle")}
          </h1>
          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">{t("landing.heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/classify"
              className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-colors"
            >
              {t("landing.ctaClassify")}
            </Link>
            <Link
              to="/marketplace"
              className="px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold border border-primary-200 hover:bg-primary-50 transition-colors"
            >
              {t("landing.ctaMarketplace")}
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">{t("landing.howItWorks")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary-100 flex items-center justify-center text-2xl mb-4">
                {step.emoji}
              </div>
              <div className="text-xs font-bold text-primary-600 mb-1">
                {idx + 1}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact stats */}
      <section className="bg-primary-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">{t("landing.impactTitle")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <StatCard value={stats?.total_waste_diverted_kg_month} label={t("landing.statWasteDiverted")} />
            <StatCard value={stats?.total_co2_saved_kg_month} label={t("landing.statCo2Saved")} />
            <StatCard value={stats?.total_matches} label={t("landing.statMatches")} />
            <StatCard value={stats?.total_factories} label={t("landing.statFactories")} />
          </div>
        </div>
      </section>

      {/* What is industrial symbiosis */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("landing.whatIsTitle")}</h2>
        <p className="text-gray-600 leading-relaxed">{t("landing.whatIsDesc")}</p>
      </section>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-extrabold text-primary-300">
        {value !== undefined && value !== null ? Math.round(value).toLocaleString() : "—"}
      </div>
      <div className="text-sm text-primary-100 mt-2">{label}</div>
    </div>
  );
}
