import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { getListing, getListingMatches, getApiErrorMessage } from "../api/client";
import ListingCard from "../components/ListingCard";

export default function ListingDetail() {
  const { id } = useParams();
  const { t } = useLanguage();

  const [listing, setListing] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getListing(id), getListingMatches(id)])
      .then(([listingRes, matchesRes]) => {
        setListing(listingRes.data);
        setMatches(matchesRes.data);
      })
      .catch((err) => setError(getApiErrorMessage(err, t("common.error"))))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className="text-center text-gray-400 py-24">{t("common.loading")}</p>;
  if (error) return <p className="text-center text-red-500 py-24">{error}</p>;
  if (!listing) return null;

  const isOffer = listing.listing_type === "offer";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/marketplace" className="text-sm text-primary-600 hover:underline">
        ← {t("common.back")}
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full ${
              isOffer ? "bg-primary-100 text-primary-700" : "bg-teal-100 text-teal-700"
            }`}
          >
            {t(`listingTypes.${listing.listing_type}`)}
          </span>
          <span className="text-xs text-gray-400">{new Date(listing.created_at).toLocaleDateString()}</span>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900">
          {t(`materialTypes.${listing.material_type}`)}
          {listing.sub_type && <span className="text-gray-400 font-medium"> · {listing.sub_type}</span>}
        </h1>

        <div className="grid sm:grid-cols-3 gap-6 mt-6">
          <DetailBlock label={t("marketplace.quantity")} value={`${listing.quantity_kg_month.toLocaleString()} ${t("common.kgPerMonth")}`} />
          <DetailBlock label={t("classify.condition")} value={t(`conditions.${listing.condition}`)} />
          <DetailBlock label={t("marketplace.location")} value={listing.location} />
        </div>

        {listing.description && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-1">{t("marketplace.description")}</p>
            <p className="text-sm text-gray-600">{listing.description}</p>
          </div>
        )}

        {listing.factory && (
          <div className="mt-6 border-t border-gray-50 pt-4 text-sm text-gray-500">
            {t("marketplace.postedBy")}: <span className="font-semibold text-gray-700">{listing.factory.name}</span>
            {" · "}
            {listing.factory.contact}
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t("marketplace.suggestedMatches")}</h2>
        {matches.length === 0 ? (
          <p className="text-gray-400">{t("marketplace.noMatches")}</p>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="relative">
                <div className="absolute top-4 end-4 z-10 bg-white border border-primary-200 text-primary-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {t("marketplace.matchScore")}: {match.match_score}%
                </div>
                <ListingCard listing={match.listing} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailBlock({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}
