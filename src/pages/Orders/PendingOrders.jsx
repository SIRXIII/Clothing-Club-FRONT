import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Assigned from "../../assets/SVG/assigned.svg";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";

const PendingOrders = ({ orders = [], handleSort, renderSortIcon }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(orders.map((o) => o.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* TABLE VIEW for md and larger screens */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="w-full text-left text-sm lg:text-base">
          <thead className="bg-[#F9F9F9] text-[#6C6C6C] fw5">
            <tr>
              <th className="px-3 lg:px-4 py-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[1.5px] border-[#9A9A9A]"
                  onChange={handleSelectAll}
                  checked={selected.length === orders.length && orders.length > 0}
                />
              </th>
              <th
                className="px-3 lg:px-4 py-3 cursor-pointer"
                onClick={() => handleSort("id")}
              >
                Order ID {renderSortIcon("id")}
              </th>
              <th
                className="px-3 lg:px-4 py-3 cursor-pointer"
                onClick={() => handleSort("traveler.name")}
              >
                Traveler {renderSortIcon("traveler.name")}
              </th>
              <th
                className="px-3 lg:px-4 py-3 cursor-pointer"
                onClick={() => handleSort("partner.name")}
              >
                Partner {renderSortIcon("partner.name")}
              </th>
              <th
                className="px-3 lg:px-4 py-3 cursor-pointer"
                onClick={() => handleSort("eta")}
              >
                ETA {renderSortIcon("eta")}
              </th>
              <th
                className="px-3 lg:px-4 py-3 cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                Date {renderSortIcon("created_at")}
              </th>
              <th
                className="px-3 lg:px-4 py-3 cursor-pointer"
                onClick={() => handleSort("total_price")}
              >
                Total {renderSortIcon("total_price")}
              </th>
              <th className="px-3 lg:px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white fw4 text-[#232323]">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-[#FEF2E6] transition-colors cursor-pointer"
                onClick={() => navigate(`/orders/ordersdetail/${order.id}`)}
              >
                <td className="px-3 lg:px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[1.5px] border-[#9A9A9A]"
                    checked={selected.includes(order.id)}
                    onChange={() => handleSelectOne(order.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>

                <td className="px-3 lg:px-4 py-3 text-[#F77F00] fw5">
                  #ODR-{order.id}
                </td>

                <td className="px-3 lg:px-4 py-3">
                  <div className="flex gap-2.5 items-center">
                    <img
                      src={order?.traveler?.profile_photo || DefaultProfile}
                      alt="Traveler"
                      className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg object-cover"
                      onError={(e) => (e.currentTarget.src = DefaultProfile)}
                    />
                    <div>
                      <p className="text-[#4F4F4F] text-sm">
                        {order.traveler?.name}
                      </p>
                      <p className="text-[#6C6C6C] text-xs">
                        {order.traveler?.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-3 lg:px-4 py-3">
                  <div className="flex gap-2.5 items-center">
                    <img
                      src={order?.partner?.profile_photo || DefaultProfile}
                      alt="Partner"
                      className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg object-cover"
                      onError={(e) => (e.currentTarget.src = DefaultProfile)}
                    />
                    <div>
                      <p className="text-[#4F4F4F] text-sm">
                        {order.partner?.name}
                      </p>
                      <p className="text-[#6C6C6C] text-xs">
                        {order.partner?.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-3 lg:px-4 py-3">{order.eta || "-"}</td>
                <td className="px-3 lg:px-4 py-3">{order.created_at}</td>
                <td className="px-3 lg:px-4 py-3">${order.total_price}</td>

                <td className="px-3 lg:px-4 py-3">
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] hover:bg-[#f9dbbe] transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/orders/assignrider/${order.id}`);
                    }}
                  >
                    <img src={Assigned} alt="Assigned" className="w-4 h-4" />
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-400 text-sm lg:text-base"
                >
                  No pending orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CARD VIEW for small screens */}
      <div className="md:hidden flex flex-col gap-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E5E5]"
            onClick={() => navigate(`/orders/ordersdetail/${order.id}`)}
          >
            <p className="text-[#F77F00] fw5 mb-2">#ODR-{order.id}</p>
            <div className="flex items-center gap-2 mb-2">
              <img
                src={order?.traveler?.profile_photo || DefaultProfile}
                alt="Traveler"
                className="w-8 h-8 rounded-xl object-cover"
                onError={(e) => (e.currentTarget.src = DefaultProfile)}
              />
              <div>
                <p className="text-[#4F4F4F] text-sm">{order.traveler?.name}</p>
                <p className="text-[#6C6C6C] text-xs">{order.traveler?.email}</p>
              </div>
            </div>
            <div className="text-xs text-[#6C6C6C] space-y-1">
              <p>
                <span className="fw5 text-[#4F4F4F]">Partner:</span>{" "}
                {order.partner?.name}
              </p>
              <p>
                <span className="fw5 text-[#4F4F4F]">ETA:</span> {order.eta || "-"}
              </p>
              <p>
                <span className="fw5 text-[#4F4F4F]">Date:</span>{" "}
                {order.created_at}
              </p>
              <p>
                <span className="fw5 text-[#4F4F4F]">Total:</span> $
                {order.total_price}
              </p>
            </div>
            <div className="flex justify-end mt-3">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] hover:bg-[#f9dbbe] transition"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/orders/assignrider/${order.id}`);
                }}
              >
                <img src={Assigned} alt="Assigned" className="w-4 h-4" />
                Assign Rider
              </button>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-center py-6 text-gray-400">No pending orders found.</p>
        )}
      </div>
    </>
  );
};

export default PendingOrders;
