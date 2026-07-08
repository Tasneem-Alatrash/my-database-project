import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { useFactory } from "../context/FactoryContext";
import {
  listListings,
  listFactories,
  createFactory,
  createListing,
  getApiErrorMessage,
} from "../api/client";
import { MATERIAL_TYPES, CONDITIONS, LISTING_TYPES } from "../constants";
import ListingCard from "../components/ListingCard";
import Modal from "../components/Modal";

export default function Marketplace() {
  const { t } = useLanguage();
  const { activeFactory, setActiveFactory } = useFactory();

  const [listings, setListings] = useState([]);
  const [factories, setFactories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ material_type: "", listing_type: "", location: "" });

  const [showRegister, setShowRegister] = useState(false);
  const [showNewListing, setShowNewListing] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchListings = () => {
    setLoading(true);
    setError(null);
    const params = {};
    if (filters.material_type) params.material_type = filters.material_type;
    if (filters.listing_type) params.listing_type = filters.listing_type;
    if (filters.location) params.location = filters.location;

    listListings(params)
      .then((res) => setListings(res.data))
      .catch((err) => setError(getApiErrorMessage(err, t("common.error"))))
      .finally(() => setLoading(false));
  };

  const fetchFactories = () => {
    listFactories()
      .then((res) => setFactories(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchFactories();
  }, []);

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleFactoryRegistered = (factory) => {
    setFactories((prev) => [...prev, factory]);
    setActiveFactory(factory);
    setShowRegister(false);
    setToast(t("marketplace.factoryCreated"));
  };

  const handleListingCreated = (listing) => {
    setShowNewListing(false);
    setToast(t("marketplace.listingCreated"));
    fetchListings();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {toast && (
        <div className="fixed top-20 inset-x-0 z-50 flex justify-center">
          <div className="bg-primary-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
            {toast}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{t("marketplace.title")}</h1>
          <p className="text-gray-600 mt-1">{t("marketplace.subtitle")}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">{t("marketplace.loggedInAs")}:</label>
            <select
              value={activeFactory?.id || ""}
              onChange={(e) => {
                const factory = factories.find((f) => f.id === Number(e.target.value));
                setActiveFactory(factory || null);
              }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
            >
              <option value="">{t("marketplace.selectFactory")}</option>
              {factories.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowRegister(true)}
              className="px-4 py-2 text-sm rounded-xl border border-primary-200 text-primary-700 font-medium hover:bg-primary-50 transition-colors"
            >
              {t("marketplace.registerFactory")}
            </button>
            <button
              onClick={() => setShowNewListing(true)}
              className="px-4 py-2 text-sm rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              {t("marketplace.newListing")}
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 flex flex-wrap gap-3">
        <select
          value={filters.material_type}
          onChange={(e) => setFilters((f) => ({ ...f, material_type: e.target.value }))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">{t("marketplace.allMaterials")}</option>
          {MATERIAL_TYPES.map((m) => (
            <option key={m} value={m}>
              {t(`materialTypes.${m}`)}
            </option>
          ))}
        </select>

        <select
          value={filters.listing_type}
          onChange={(e) => setFilters((f) => ({ ...f, listing_type: e.target.value }))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">{t("marketplace.allTypes")}</option>
          {LISTING_TYPES.map((lt) => (
            <option key={lt} value={lt}>
              {t(`listingTypes.${lt}`)}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={t("marketplace.filterLocation")}
          value={filters.location}
          onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[160px]"
        />
      </div>

      {/* Listings grid */}
      {loading ? (
        <p className="text-center text-gray-400 py-16">{t("common.loading")}</p>
      ) : error ? (
        <p className="text-center text-red-500 py-16">{error}</p>
      ) : listings.length === 0 ? (
        <p className="text-center text-gray-400 py-16">{t("marketplace.noListings")}</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {showRegister && (
        <Modal title={t("marketplace.registerFormTitle")} onClose={() => setShowRegister(false)}>
          <RegisterFactoryForm onSuccess={handleFactoryRegistered} />
        </Modal>
      )}

      {showNewListing && (
        <Modal title={t("marketplace.listingFormTitle")} onClose={() => setShowNewListing(false)}>
          {activeFactory ? (
            <NewListingForm factoryId={activeFactory.id} onSuccess={handleListingCreated} />
          ) : (
            <p className="text-sm text-gray-600">{t("marketplace.pleaseSelectFactory")}</p>
          )}
        </Modal>
      )}
    </div>
  );
}

function RegisterFactoryForm({ onSuccess }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", industry_type: "", location: "", contact: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await createFactory(form);
      onSuccess(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, t("common.error")));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label={t("marketplace.factoryName")} required>
        <input
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="input"
        />
      </Field>
      <Field label={t("marketplace.industryType")} required>
        <input
          required
          value={form.industry_type}
          onChange={(e) => setForm((f) => ({ ...f, industry_type: e.target.value }))}
          className="input"
        />
      </Field>
      <Field label={t("marketplace.location")} required>
        <input
          required
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          className="input"
        />
      </Field>
      <Field label={t("marketplace.contact")} required>
        <input
          required
          value={form.contact}
          onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
          className="input"
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
      >
        {t("common.submit")}
      </button>
    </form>
  );
}

function NewListingForm({ factoryId, onSuccess }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    listing_type: "offer",
    material_type: "",
    sub_type: "",
    quantity_kg_month: "",
    condition: "unknown",
    location: "",
    description: "",
    photo_url: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        factory_id: factoryId,
        quantity_kg_month: Number(form.quantity_kg_month),
        sub_type: form.sub_type || null,
        description: form.description || null,
        photo_url: form.photo_url || null,
      };
      const res = await createListing(payload);
      onSuccess(res.data);
    } catch (err) {
      setError(getApiErrorMessage(err, t("common.error")));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label={t("marketplace.selectListingType")} required>
        <div className="flex gap-2">
          {LISTING_TYPES.map((lt) => (
            <button
              key={lt}
              type="button"
              onClick={() => setForm((f) => ({ ...f, listing_type: lt }))}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                form.listing_type === lt
                  ? "bg-primary-600 text-white border-primary-600"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {lt === "offer" ? t("marketplace.offerWaste") : t("marketplace.requestMaterial")}
            </button>
          ))}
        </div>
      </Field>

      <Field label={t("classify.materialType")} required>
        <select
          required
          value={form.material_type}
          onChange={(e) => setForm((f) => ({ ...f, material_type: e.target.value }))}
          className="input"
        >
          <option value="">{t("marketplace.selectMaterial")}</option>
          {MATERIAL_TYPES.map((m) => (
            <option key={m} value={m}>
              {t(`materialTypes.${m}`)}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("classify.subType")}>
        <input
          value={form.sub_type}
          onChange={(e) => setForm((f) => ({ ...f, sub_type: e.target.value }))}
          placeholder={t("marketplace.subTypePlaceholder")}
          className="input"
        />
      </Field>

      <Field label={`${t("marketplace.quantity")} (${t("common.kgPerMonth")})`} required>
        <input
          type="number"
          min="1"
          required
          value={form.quantity_kg_month}
          onChange={(e) => setForm((f) => ({ ...f, quantity_kg_month: e.target.value }))}
          className="input"
        />
      </Field>

      <Field label={t("classify.condition")}>
        <select
          value={form.condition}
          onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
          className="input"
        >
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {t(`conditions.${c}`)}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("marketplace.location")} required>
        <input
          required
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          className="input"
        />
      </Field>

      <Field label={t("marketplace.photoUrlOptional")}>
        <input
          value={form.photo_url}
          onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))}
          className="input"
        />
      </Field>

      <Field label={t("marketplace.description")}>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder={t("marketplace.descriptionPlaceholder")}
          rows={3}
          className="input"
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
      >
        {t("common.submit")}
      </button>
    </form>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}
