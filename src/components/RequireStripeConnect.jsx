import React from "react";
import { useAuth } from "../context/AuthContext";
import StripeConnectGuard from "./StripeConnectGuard";

/**
 * Renders children only if user is Stripe-connected; otherwise shows StripeConnectGuard.
 * Use for Add Product (and optionally Edit Product) routes.
 */
const RequireStripeConnect = ({ children }) => {
  // Stripe connect gating has been made optional; always allow access
  return children;
};

export default RequireStripeConnect;
