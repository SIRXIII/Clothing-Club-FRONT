import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStripeConnectUrl } from "../services/stripeService";
import { toast } from "react-toastify";

/**
 * Full-page guard when merchant is not Stripe-connected and tries to add/edit products.
 * Shows title, explanation, and "Connect Stripe" button that redirects to Stripe onboarding.
 */
const StripeConnectGuard = ({ title = "Connect Stripe to add products", showBack = true }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const { url } = await getStripeConnectUrl();
      if (url) window.location.href = url;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to open Stripe setup");
    } finally {
      setLoading(false);
    }
  };

  const isRestricted = user?.stripe_connection_status === "restricted";
  const isPending = user?.stripe_connection_status === "pending";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl border border-[#E5E5E5] shadow-sm p-8 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-[#232323] mb-3">{title}</h1>
        <p className="text-[#6C6C6C] text-sm sm:text-base mb-6">
          To receive payments, connect your Stripe account. After connecting, you can add and list products for rent.
        </p>
        {isRestricted && (
          <p className="text-amber-700 text-sm mb-4 bg-amber-50 rounded-lg p-3">
            Your Stripe account has pending requirements. Complete them in Stripe to enable product listing.
          </p>
        )}
        {isPending && !isRestricted && (
          <p className="text-blue-700 text-sm mb-4 bg-blue-50 rounded-lg p-3">
            You started Stripe setup. Click below to continue and complete verification.
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleConnect}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-[#F77F00] text-white font-medium hover:bg-[#e57300] disabled:opacity-70"
          >
            {loading ? "Loading…" : "Connect with Stripe"}
          </button>
          {showBack && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-lg border border-[#D9D9D9] text-[#232323] hover:bg-[#F9F9F9]"
            >
              Go back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StripeConnectGuard;
