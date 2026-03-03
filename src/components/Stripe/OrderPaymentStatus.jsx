import React from "react";

/**
 * OrderPaymentStatus (Partner-facing – read-only)
 *
 * Shows the Stripe payment lifecycle for an order.
 * Partners can see the current status and timeline but cannot
 * trigger captures, cancellations, or refunds — those are admin actions.
 */
const PAYMENT_STATUS_STYLES = {
  unpaid:           "bg-gray-100 text-gray-600",
  pending:          "bg-blue-100 text-blue-600",
  authorized:       "bg-yellow-100 text-yellow-700",
  holding:          "bg-amber-100 text-amber-700",
  captured:         "bg-green-100 text-green-700",
  transfer_created: "bg-emerald-100 text-emerald-700",
  completed:        "bg-green-200 text-green-800",
  failed:           "bg-red-100 text-red-600",
  refunded:         "bg-purple-100 text-purple-700",
  canceled:         "bg-gray-200 text-gray-600",
};

const PAYMENT_STATUS_LABELS = {
  unpaid:           "Unpaid",
  pending:          "Awaiting Payment",
  authorized:       "Authorized (On Hold)",
  holding:          "On Hold – 24h",
  captured:         "Captured",
  transfer_created: "Payout Sent",
  completed:        "Completed",
  failed:           "Payment Failed",
  refunded:         "Refunded",
  canceled:         "Canceled",
};

const PAYMENT_STATUS_DESCRIPTIONS = {
  unpaid:           "No payment has been made yet.",
  pending:          "The customer's payment is being processed.",
  authorized:       "Payment is authorized and on hold. It will be captured soon.",
  holding:          "Payment is on hold for 24 hours. You will receive your payout after capture.",
  captured:         "Payment has been successfully captured.",
  transfer_created: "Your payout has been sent to your connected bank account.",
  completed:        "The rental payment is fully settled.",
  failed:           "The customer's payment failed. Please contact support.",
  refunded:         "This order has been refunded.",
  canceled:         "The payment was canceled.",
};

const OrderPaymentStatus = ({ order }) => {
  if (!order?.payment_status || order.payment_status === "unpaid") return null;

  const ps  = order.payment_status;
  const fmt = (d) => d ? new Date(d).toLocaleString() : null;

  const timeline = [
    order.authorized_at && { label: "Authorized",     time: fmt(order.authorized_at), color: "amber" },
    order.release_at    && { label: "Auto-capture at", time: fmt(order.release_at),    color: "blue", future: new Date(order.release_at) > new Date() },
    order.captured_at   && { label: "Captured",        time: fmt(order.captured_at),   color: "green" },
    order.canceled_at   && { label: "Canceled",        time: fmt(order.canceled_at),   color: "red" },
  ].filter(Boolean);

  return (
    <div className="flex flex-col bg-white p-6 rounded-2xl shadow-sm gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg fw6 text-[#232323]">Payment Status</h2>
        <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${PAYMENT_STATUS_STYLES[ps] || "bg-gray-100 text-gray-600"}`}>
          {PAYMENT_STATUS_LABELS[ps] || ps}
        </span>
      </div>

      {/* Description */}
      {PAYMENT_STATUS_DESCRIPTIONS[ps] && (
        <p className="text-sm text-[#6C6C6C]">{PAYMENT_STATUS_DESCRIPTIONS[ps]}</p>
      )}

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {order.total_price && (
          <>
            <span className="text-[#9A9A9A]">Amount</span>
            <span className="text-[#232323] font-medium">
              ${order.total_price} {order.currency?.toUpperCase()}
            </span>
          </>
        )}
        {order.payment_intent_id && (
          <>
            <span className="text-[#9A9A9A]">Payment Intent</span>
            <span className="font-mono text-xs text-[#6C6C6C] truncate">{order.payment_intent_id}</span>
          </>
        )}
        {order.stripe_charge_id && (
          <>
            <span className="text-[#9A9A9A]">Charge ID</span>
            <span className="font-mono text-xs text-[#6C6C6C] truncate">{order.stripe_charge_id}</span>
          </>
        )}
      </div>

      {/* Timeline */}
      {timeline.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wide">Timeline</p>
          <div className="flex flex-col gap-1.5 pl-2 border-l-2 border-[#F77F00]/30">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-start gap-3 pl-3">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  t.color === "green" ? "bg-green-500" :
                  t.color === "amber" ? "bg-amber-500" :
                  t.color === "red"   ? "bg-red-500"   :
                  "bg-blue-400"
                }`} />
                <div>
                  <span className="text-xs font-medium text-[#232323]">{t.label}</span>
                  {t.future && (
                    <span className="ml-1 text-xs text-amber-600 font-medium">(upcoming)</span>
                  )}
                  <span className="block text-xs text-[#9A9A9A]">{t.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Holding notice */}
      {ps === "holding" && order.release_at && new Date(order.release_at) > new Date() && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <strong>24-hour hold active.</strong> Your payout will be processed after{" "}
          {new Date(order.release_at).toLocaleString()}.
          If you have questions, contact the platform admin.
        </div>
      )}

      {/* Payout notice */}
      {ps === "transfer_created" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
          <strong>Payout sent.</strong> Funds have been transferred to your connected Stripe account.
          They typically arrive within 2 business days depending on your bank.
        </div>
      )}
    </div>
  );
};

export default OrderPaymentStatus;
