import React from "react";
import { useAuth } from "../context/AuthContext";
import StripeConnectGuard from "./StripeConnectGuard";

/**
 * Renders children only if user is Stripe-connected; otherwise shows StripeConnectGuard.
 * Use for Add Product (and optionally Edit Product) routes.
 */
const RequireStripeConnect = ({ children }) => {
  const { user } = useAuth();
  const connected = user?.stripe_connected === true;

  if (connected) {
    return children;
  }

  return <StripeConnectGuard title="Connect Stripe to add products" showBack />;
};

export default RequireStripeConnect;
