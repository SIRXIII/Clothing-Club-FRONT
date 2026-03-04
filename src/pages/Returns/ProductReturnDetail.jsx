import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getReturnById } from "../../services/returnService";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Breadcrumb";
import API from "../../services/api";

const statusOptions = [
  { value: "upcoming", label: "Upcoming" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
];

const ProductReturnDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [returnData, setReturnData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchReturn = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getReturnById(id);
      const data = res?.data?.data;
      setReturnData(data?.return ?? data ?? null);
    } catch (error) {
      console.error("Error fetching return:", error);
      toast.error("Failed to load return");
      setReturnData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (!id || updating) return;
    setUpdating(true);
    try {
      await API.post("/returns/status", { id: Number(id), status: newStatus });
      toast.success("Return status updated");
      fetchReturn();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-[#9A9A9A]">Loading...</p>
      </div>
    );
  }

  if (!returnData) {
    return (
      <div className="p-6">
        <Breadcrumb items={[{ label: "Dashboard", path: "/" }, { label: "Returns", path: "/returns" }, { label: "Detail" }]} />
        <p className="text-red-600 mt-4">Return not found.</p>
        <Link to="/returns" className="text-[#F77F00] hover:underline mt-2 inline-block">Back to Returns</Link>
      </div>
    );
  }

  const r = returnData;
  const statusLower = (r.status || "").toLowerCase();
  const validStatus = statusOptions.some((o) => o.value === statusLower)
    ? statusLower
    : statusOptions[0].value;

  return (
    <div className="gap-6 p-2">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Returns", path: "/returns" },
          { label: r.return_id || `Return #${id}` },
        ]}
      />
      <div className="mt-4 bg-white rounded-lg border border-[#D9D9D9] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-xl font-semibold text-[#232323]">
            Return {r.return_id}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[#9A9A9A]">Status:</span>
            <select
              value={validStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm text-[#232323] focus:outline-none focus:border-[#F77F00]"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-medium text-[#9A9A9A] mb-2">Product</h2>
            <p className="text-[#232323]">{r.product?.name} {r.product?.size && `(${r.product.size})`}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-[#9A9A9A] mb-2">Order</h2>
            <p className="text-[#232323]">{r.order?.order_id} — ${r.order?.total_price}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-[#9A9A9A] mb-2">Traveler</h2>
            <p className="text-[#232323]">{r.traveler?.name} {r.traveler?.email && `(${r.traveler.email})`}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-[#9A9A9A] mb-2">Partner</h2>
            <p className="text-[#232323]">{r.partner?.business_name ?? r.partner?.name ?? "—"}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-[#9A9A9A] mb-2">Pickup address</h2>
            <p className="text-[#232323]">{r.pickup_address || "—"}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-[#9A9A9A] mb-2">Scheduled at</h2>
            <p className="text-[#232323]">{r.scheduled_at || "—"}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-[#9A9A9A] mb-2">Return due date</h2>
            <p className="text-[#232323]">{r.return_due_date || "—"}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-[#9A9A9A] mb-2">Completed at</h2>
            <p className="text-[#232323]">{r.completed_at || "—"}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#D9D9D9]">
          <button
            type="button"
            onClick={() => navigate("/returns")}
            className="text-[#F77F00] hover:underline font-medium"
          >
            ← Back to Returns
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductReturnDetail;
