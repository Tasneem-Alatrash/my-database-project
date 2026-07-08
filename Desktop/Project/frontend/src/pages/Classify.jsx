import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { classifyWasteImage, getApiErrorMessage } from "../api/client";
import ConfidenceBar from "../components/ConfidenceBar";

export default function Classify() {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };

  const handleClassify = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await classifyWasteImage(file);
      setResult(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, t("classify.errorGeneric")));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">{t("classify.title")}</h1>
        <p className="text-gray-600 mt-2">{t("classify.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label
            htmlFor="waste-photo"
            className="flex flex-col items-center justify-center border-2 border-dashed border-primary-200 rounded-xl h-64 cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors overflow-hidden"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center px-4">
                <div className="text-4xl mb-2">📤</div>
                <p className="font-medium text-gray-700">{t("classify.uploadLabel")}</p>
                <p className="text-xs text-gray-400 mt-1">{t("classify.uploadHint")}</p>
              </div>
            )}
          </label>
          <input
            id="waste-photo"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="mt-5 flex gap-3">
            {file && (
              <button
                onClick={reset}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                {t("classify.chooseAnother")}
              </button>
            )}
            <button
              onClick={handleClassify}
              disabled={!file || loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t("classify.analyzing") : t("classify.analyzeButton")}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm">
              <p className="font-semibold mb-1">{t("classify.errorTitle")}</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Result panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {!result ? (
            <div className="h-full flex items-center justify-center text-center text-gray-400 py-16">
              <p>{loading ? t("classify.analyzing") : "—"}</p>
            </div>
          ) : (
            <div>
              <h2 className="font-bold text-lg text-gray-900 mb-4">{t("classify.resultTitle")}</h2>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <InfoBlock label={t("classify.materialType")} value={t(`materialTypes.${result.material_type}`)} />
                <InfoBlock label={t("classify.subType")} value={result.sub_type} />
                <InfoBlock label={t("classify.condition")} value={t(`conditions.${result.condition}`)} />
                <InfoBlock label={t("classify.estimatedValue")} value={result.estimated_value_note} />
              </div>

              <div className="mb-5">
                <ConfidenceBar value={result.confidence} label={t("classify.confidence")} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">{t("classify.reuseSuggestions")}</p>
                <ul className="space-y-2">
                  {result.reuse_suggestions?.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-600 bg-primary-50/60 rounded-lg px-3 py-2"
                    >
                      <span className="text-primary-600">♻</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/marketplace"
                className="mt-6 block text-center px-4 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors"
              >
                {t("classify.postToMarketplace")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}
