import React from "react";
import QueueData from "../../data/QueueData";
import { useNavigate } from "react-router-dom";

const Queue = () => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg p-6 gap-6">
      <h3 className="text-xl fw4 font-roboto">Today's Queue</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {QueueData.map((col) => (
          <div
            key={col.id}
            className="flex flex-col p-4 rounded-lg border border-gray-200 bg-white gap-4"
          >
            <h6 className="text-md font-roboto fw5 flex items-center gap-4">
              <span className={`w-2 h-2 rounded-full  ${col.color}`}></span>
              {col.label} ({col.orders.length})
            </h6>

            {col.orders.map((order, i) => (
              <div
                key={i}
                className="flex flex-col p-3 rounded-lg border border-gray-100 bg-white shadow-sm gap-2"
              >
                <p className="text-sm font-medium text-gray-800">
                  Order {order.id}
                </p>
                <p className="text-sm text-gray-700">{order.product}</p>
                <p className="text-xs text-gray-500">{order.customer}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-md w-fit ${order.statusColor}`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queue;
