import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export default function ListingCard({ listing }) {
  const { t } = useLanguage();
  const isOffer = listing.listing_type === "offer";

  return (
    <Link
      to={`/marketplace/listings/${listing.id}`}
      className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            isOffer ? "bg-primary-100 text-primary-700" : "bg-teal-100 text-teal-700"
          }`}
        >
          {t(`listingTypes.${listing.listing_type}`)}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(listing.created_at).toLocaleDateString()}
        </span>
      </div>

      <h3 className="font-bold text-lg text-gray-900">{t(`materialTypes.${listing.material_type}`)}</h3>
      {listing.sub_type && <p className="text-sm text-gray-500 mb-2">{listing.sub_type}</p>}

      <div className="flex items-center justify-between text-sm mt-3">
        <span className="text-gray-600">
          {listing.quantity_kg_month.toLocaleString()} {t("common.kgPerMonth")}
        </span>
        <span className="text-gray-500">{listing.location}</span>
      </div>

      {listing.factory && (
        <p className="text-xs text-gray-400 mt-3 border-t border-gray-50 pt-2">
          {t("marketplace.postedBy")}: {listing.factory.name}
        </p>
      )}
    </Link>
  );
}
