import API from "./api";

/**
 * Get Stripe Connect onboarding URL. Redirect user to this URL to connect their Stripe account.
 * @returns {Promise<{ url: string }>}
 */
export async function getStripeConnectUrl() {
  const res = await API.post("/stripe/connect");
  const data = res.data?.data ?? res.data;
  if (!data?.url) {
    throw new Error(data?.message || "Failed to get Stripe connect URL");
  }
  return { url: data.url };
}
