import React from "react";
import WelcomeCard from "../components/Dashboard/WelcomeCard";
import Widgets from "../components/Dashboard/Widgets";
import Queue from "../components/Dashboard/Queue";
import AlertPlane from "../components/Dashboard/AlertPlane";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStripeConnectUrl } from "../services/stripeService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const stripeConnected = user?.stripe_connected === true;

  const handleAddProduct = () => {
    navigate("/products/addproduct");
  };

  const handleConnectStripe = async () => {
    try {
      const { url } = await getStripeConnectUrl();
      if (url) window.location.href = url;
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to open Stripe setup"
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:p-0 md:p-8 w-full">
      {/* Stripe Connect banner when not connected (optional information only) */}
      {!stripeConnected && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-amber-800 text-sm font-medium">
            Connect Stripe to receive payments. You need to complete Stripe setup before adding products.
          </p>
          <button
            type="button"
            onClick={handleConnectStripe}
            className="px-4 py-2 rounded-lg bg-[#F77F00] text-white text-sm font-medium hover:bg-[#e57300] shrink-0"
          >
            Connect with Stripe
          </button>
        </div>
      )}

      {/* Welcome Card */}
      <WelcomeCard />

      {/* Widgets */}
      <Widgets />

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        <button
          className="p-3 sm:p-4 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] rounded-lg hover:bg-[#F77F00] hover:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleAddProduct}
        >
          Add New Product
        </button>
        <button
          className="p-3 sm:p-4 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] rounded-lg hover:bg-[#F77F00] hover:text-white transition"
          onClick={() => navigate("/orders")}
        >
          View Orders
        </button>
      </div>

      {/* Queue */}
      <Queue />

      {/* Alerts */}
      <AlertPlane />
    </div>
  );
};

export default Dashboard;
