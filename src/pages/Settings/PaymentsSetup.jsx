import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStripeConnectUrl } from "../../services/stripeService";
import { toast } from "react-toastify";

const statusConfig = {
  not_connected: { label: "Not connected", class: "bg-gray-200 text-gray-700" },
  pending: { label: "Pending verification", class: "bg-amber-100 text-amber-800" },
  restricted: { label: "Pending verification / restricted", class: "bg-amber-100 text-amber-800" },
  connected: { label: "Connected", class: "bg-green-100 text-green-800" },
};

const PaymentsSetup = () => {
  const { user, fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const status = user?.stripe_connection_status || "not_connected";
  const config = statusConfig[status] || statusConfig.not_connected;
  const isConnected = user?.stripe_connected === true;

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

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-[#232323]">Payments Setup</h3>
      <p className="text-sm text-[#6C6C6C]">
        Connect your Stripe account to receive payments when customers rent your products.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.class}`}>
          {isConnected && <span aria-hidden>✅</span>}
          {config.label}
        </span>
        {!isConnected && (
          <button
            type="button"
            onClick={handleConnect}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#F77F00] text-white text-sm font-medium hover:bg-[#e57300] disabled:opacity-70"
          >
            {loading ? "Loading…" : status === "not_connected" ? "Connect with Stripe" : "Continue Stripe Setup"}
          </button>
        )}
      </div>

      {status === "restricted" && (
        <p className="text-sm text-amber-800 bg-amber-50 rounded-lg p-3">
          Stripe needs additional information from you. Click &quot;Continue Stripe Setup&quot; to complete verification.
        </p>
      )}
      {status === "pending" && !isConnected && (
        <p className="text-sm text-[#6C6C6C]">
          You started onboarding. Click &quot;Continue Stripe Setup&quot; to finish and start receiving payments.
        </p>
      )}
    </div>
  );
};

export default PaymentsSetup;
