

import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Queue = () => {
  const [queueData, setQueueData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await API.get("dashboard/orders/queue");
      const data = res.data;

      const grouped = {
        preparing: [],
        pickup: [],
        delivery: [],
        return: [],
        cleaning: [],
      };

      data.forEach((order) => {
        if (order.status === "processing") grouped.preparing.push(order);
        else if (order.status === "shipped") grouped.pickup.push(order);
        else if (order.status === "delivered") grouped.delivery.push(order);
        else if (order.status === "returned") grouped.return.push(order);
        else if (order.product_availability === "Under Maintenance")
          grouped.cleaning.push(order);
      });

      const formatted = [
        {
          id: "processing",
          label: "Preparing",
          color: "bg-[#4F46E5]",
          orders: grouped.preparing,
        },
        {
          id: "shipped",
          label: "Pickup",
          color: "bg-[#F59E0B]",
          orders: grouped.pickup,
        },
        {
          id: "delivered",
          label: "Delivery",
          color: "bg-[#22C55E]",
          orders: grouped.delivery,
        },
        {
          id: "returned",
          label: "Return",
          color: "bg-[#F43F5E]",
          orders: grouped.return,
        },
        {
          id: "Under Maintenance",
          label: "Cleaning",
          color: "bg-[#475569]",
          orders: grouped.cleaning,
        },
      ];

      setQueueData(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load queue data");
    }
  };

  const handleToggle = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNavigate = (status) => {
    navigate(`/orders?status=${status}`);
  };

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg p-6 gap-6">
      <h3 className="text-xl font-semibold font-roboto">Today's Queue</h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {queueData.map((col) => {
          const showAll = expanded[col.id];
          const visibleOrders = showAll ? col.orders : col.orders.slice(0, 3);

          return (
            <div
              key={col.id}
              className="flex flex-col p-4 rounded-lg border border-gray-200 bg-white gap-4"
            >
              <h6
                onClick={() => handleNavigate(col.id)}
                className="text-md font-roboto font-medium flex items-center gap-3 cursor-pointer hover:text-[#F77F00]"
              >
                <span className={`w-2 h-2 rounded-full ${col.color}`}></span>
                {col.label} ({col.orders.length})
              </h6>

              {visibleOrders.length > 0 ? (
                visibleOrders.map((order, i) => (
                  <div
                    key={i}
                    className="flex flex-col p-3 rounded-lg border border-gray-100 bg-white shadow-sm gap-2"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-gray-700">{order.product}</p>
                    <p className="text-xs text-gray-500">{order.customer}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-md w-fit ${
                        order.status === "processing"
                          ? "bg-indigo-100 text-indigo-600"
                          : order.status === "shipped"
                          ? "bg-yellow-100 text-yellow-600"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-600"
                          : order.status === "returned"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No orders</p>
              )}

              {col.orders.length > 3 && (
                <button
                  onClick={() => handleToggle(col.id)}
                  className="text-xs text-[#F77F00] font-medium self-start hover:underline"
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Queue;
