import React, { useState, useEffect, useMemo, useRef } from "react";
import { FiArrowDown, FiArrowUp, FiChevronDown, FiMoreHorizontal } from "react-icons/fi";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Breadcrumb from "../../components/Breadcrumb";
import API from "../../services/api";
import Assigned from "../../assets/SVG/assigned.svg";
import { format } from "crypto-js";
import ConfirmDialog from "../../components/Dialogs/ConfirmDialog";
import { toast } from "react-toastify";


const Returns = () => {
  const navigate = useNavigate();
  const statusRef = useRef(null);
  const actionRefs = useRef({});

  // State
  const [returns, setReturns] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState("Status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openActionId, setOpenActionId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isLoading, setIsLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);


  const statusColors = {
    Upcoming: "bg-[#E1FDFD] text-[#3E77B0]",
    Scheduled: "bg-[#E7F7ED] text-[#088B3A]",
    Completed: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  // Fetch returns once on mount
  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setIsLoading(true);
        const res = await API.get("/returns"); // adjust API endpoint
        setReturns(res.data.data); // store API data once
      } catch (error) {
        console.error("Failed to fetch returns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReturns();
  }, []); // <-- empty dependency array = run once

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setStatusOpen(false);
      }
      if (
        openActionId &&
        actionRefs.current[openActionId] &&
        !actionRefs.current[openActionId].contains(event.target)
      ) {
        setOpenActionId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openActionId]);

  // Filter, search, and sort
  useEffect(() => {
    let temp = [...(returns || [])]; // ✅ prevent TypeError

    if (status !== "Status") {
      temp = temp.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    if (searchTerm.trim() !== "") {
      temp = temp.filter(
        (r) =>
          r.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.orderId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.order_item_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.order?.traveler_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.order?.partner_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      temp.sort((a, b) => {
        const valA = (a[sortConfig.key] || "").toString().toLowerCase();
        const valB = (b[sortConfig.key] || "").toString().toLowerCase();
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredReturns(temp);
    setPage(1);
  }, [searchTerm, status, returns, sortConfig]);

  // Pagination
  const paginatedReturns = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredReturns.slice(start, start + perPage);
  }, [filteredReturns, page, perPage]);

  // Log only when paginated data changes
  useEffect(() => {
    console.log("Paginated returns:", paginatedReturns);
  }, [paginatedReturns]);

  // Selection
  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? paginatedReturns.map((r) => r.id) : []);
  };
  const handleSelectOne = (id) => {
    setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  // Sorting
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };
  const renderSortIcon = (key) => (
    <span className="inline-flex flex-row ml-1 text-xs">
      <FiArrowUp className={sortConfig.key === key && sortConfig.direction === "asc" ? "text-[#F77F00]" : "text-gray-400"} />
      <FiArrowDown className={sortConfig.key === key && sortConfig.direction === "desc" ? "text-[#F77F00]" : "text-gray-400"} />
    </span>
  );

  const handleSetReturnedClick = (r) => {
    setSelectedReturn(r); // store the clicked return record
    setConfirmOpen(true);  // open the modal
  };

  const handleSetReturned = async (r) => {
    try {
      setIsLoading(true);

      // Send the payload expected by your backend
      const payload = {
        id: r.id,
        status: "completed", // or "upcoming"/"scheduled" if you want dynamic
      };

      const res = await API.post("/returns/status", payload);

      // Update local state with new status
      setReturns((prev) =>
        prev.map((ret) =>
          ret.id === r.id ? { ...ret, status: res.data.data.status } : ret
        )
      );

      toast.success("Return status updated successfully!");
    } catch (error) {
      console.error("Failed to set return as returned:", error);
      toast.error("Failed to update return status");
    } finally {
      setIsLoading(false);
      setConfirmOpen(false);
      setSelectedReturn(null);
    }
  };



  return (
    <div className="gap-6 p-2">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Returns" },
        ]}
      />

      <div className="bg-[#FFFFFF] rounded-lg border-color p-6 mt-4">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-2 px-4 py-2 border border-gray-300 rounded-xl text-base w-[320px] focus:outline-none focus:border-[#D9D9D9]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
          {/* <div className="relative" ref={statusRef}>
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex items-center justify-between border border-[#23232333] rounded-md px-3 py-1 gap-2 text-xs text-[#9A9A9A] h-[36px]"
            >
              {status}
              <FiChevronDown size={12} />
            </button>
            {statusOpen && (
              <div className="absolute mt-1 bg-white border-color rounded-lg shadow-lg w-28 z-20">
                {["Pending", "Processed", "Rejected"].map((s) => (
                  <p
                    key={s}
                    className="px-4 py-2 hover:bg-[#FEF2E6] cursor-pointer text-sm"
                    onClick={() => {
                      setStatus(s);
                      setStatusOpen(false);
                    }}
                  >
                    {s}
                  </p>
                ))}
              </div>
            )}
          </div> */}
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-40 gap-2">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
            <p className="text-orange-500 fw5 flex items-center">
              Loading Returns
              <span className="flex space-x-1 ml-1 text-2xl font-bold leading-none">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
              </span>
            </p>
          </div>
        ) : filteredReturns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <p className="text-orange-500 font-semibold text-lg">No Returns found.</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting filters or check back later.</p>
          </div>
        ) : (
          <>
            {/* 🖥️ TABLE VIEW (Desktop) */}
            <div className="hidden md:block overflow-x-auto min-h-[200px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#F9F9F9] text-sm uppercase text-[#6C6C6C]">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded-lg"
                        onChange={handleSelectAll}
                        checked={
                          selected.length === paginatedReturns.length &&
                          paginatedReturns.length > 0
                        }
                      />
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("return_id")}>
                      Return ID {renderSortIcon("return_id")}
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("order_item_id")}>
                      Order Item ID {renderSortIcon("order_item_id")}
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("traveler.name")}>
                      Traveler {renderSortIcon("traveler.name")}
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("partner.business_name")}>
                      Partner {renderSortIcon("partner.business_name")}
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("pickup_time")}>
                      Pickup time {renderSortIcon("pickup_time")}
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("status")}>
                      Status {renderSortIcon("status")}
                    </th>
                    <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("amount")}>
                      Total {renderSortIcon("amount")}
                    </th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReturns.map((r, index) => {
                    const isNearBottom = index >= paginatedReturns.length - 2 && paginatedReturns.length >= 3;
                    return (
                      <tr
                        key={r.id}
                        className="text-sm bg-white hover:bg-[#FEF2E6] transition-colors cursor-pointer"
                        onClick={() => navigate(`/refund/Returnsdetail/${r.id}`)}
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-lg"
                            checked={selected.includes(r.id)}
                            onChange={() => handleSelectOne(r.id)}
                          />
                        </td>
                        <td className="px-4 py-3 text-[#F77F00] fw5">{r.return_id}</td>
                        <td className="px-4 py-3"> {r.product?.name} - (#{r.order?.id})</td>
                        <td className="px-4 py-3">{r?.traveler?.name}</td>
                        <td className="px-4 py-3">{r?.partner?.business_name}</td>
                        <td className="px-4 py-3">{r.pickup_time}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[r.status] || ""}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">${r.order?.total_price}</td>
                        <td className="px-4 py-3 text-end relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            className={`p-1.5 rounded-lg border bg-[#FEF2E6] border-[#F77F00] text-[#F77F00] ${r.status === 'Completed' ? 'hidden' : ''}`}
                            onClick={() => handleSetReturnedClick(r)}
                          >
                            Set Returned
                          </button>


                          {/* {openActionId === r.id && (
                            <div
                              className={`absolute w-[140px] bg-white rounded-md z-10 ${isNearBottom ? "bottom-full mb-2" : "top-full mt-2"} right-0`}
                              style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
                            >
                              {["Returned"].map((statusOption) => (
                                <button
                                  key={statusOption}
                                  className="px-4 py-2 hover:bg-[#FEF2E6] w-full text-left text-sm"
                                  onClick={() => handleSetReturned(r.id, statusOption)}
                                >
                                  {statusOption}
                                </button>
                              ))}
                            </div>
                          )} */}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 📱 CARD VIEW (Mobile) */}
            <div className="md:hidden flex flex-col gap-3">
              {paginatedReturns.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E5E5] "
                  onClick={() => navigate(`/refund/Returnsdetail/${r.id}`)}
                >
                  <p className="text-[#F77F00] fw5 mb-2">Return #{r.return_id}</p>
                  <div className="text-xs text-[#6C6C6C] space-y-3">
                    <p className="flex justify-between"><span className="fw5 text-[#4F4F4F]">Order ID:</span> #{r.order?.order_id}</p>
                    <p className="flex justify-between"><span className="fw5 text-[#4F4F4F]">Traveler:</span> {r?.traveler?.name}</p>
                    <p className="flex justify-between"><span className="fw5 text-[#4F4F4F]">Partner:</span> {r?.partner?.business_name}</p>
                    <p className="flex justify-between">
                      <span className="fw5 text-[#4F4F4F]">Pickup Time: </span>
                      <p>
                        {r.pickup_time ? new Date(r.pickup_time).toLocaleDateString() : "-"}<br />
                        {r.pickup_time ? new Date(r.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}</p>
                    </p>

                    <p className="flex justify-between"><span className="fw5 text-[#4F4F4F]">Total:</span> ${r.order?.total_price}</p>
                    <p className="flex justify-between">
                      <span className="fw5 text-[#4F4F4F]">Status:</span>{" "}
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[r.status] || ""}`}>
                        {r.status}
                      </span>
                    </p>
                  </div>

                  {/* <div className="flex justify-end mt-3 gap-2">
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] hover:bg-[#f9dbbe] transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/refund/Returnsdetail/${r.id}`);
                      }}
                    >
                      View Detail
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] hover:bg-[#f9dbbe] transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSupportClick(r.order.id);
                      }}
                    >
                      Chat Support
                    </button>
                  </div> */}
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {paginatedReturns.length > 0 && (
              <Pagination
                page={page}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
                totalItems={filteredReturns.length}
                options={[5, 10, 25, 50]}
                fullWidth={true}
              />
            )}
          </>
        )}
      </div>


      <ConfirmDialog
        isOpen={confirmOpen}
        title={`Return Product #${selectedReturn?.return_id}`}
        message={`Are you sure you want to set this product as returned? This action cannot be undone.`}
        onConfirm={() => {
          // Call your API or function to set returned
          handleSetReturned(selectedReturn);
          setConfirmOpen(false);
          setSelectedReturn(null);
        }}
        actionLabel="Set Returned"
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedReturn(null);
        }}
      />

    </div>


  );

};

export default Returns;
