// import React, { useState, useMemo, useEffect, useRef } from "react";
// import { FiSearch, FiChevronDown, FiArrowUp, FiArrowDown } from "react-icons/fi";
// import AssignedOrders from "./AssignedOrders";
// import PendingOrders from "./PendingOrders";
// import Pagination from "../../components/Pagination";
// import { useOrders } from "../../hooks/useOrder";
// import Breadcrumb from "../../components/Breadcrumb";
// import { useLocation } from "react-router-dom";

// const Orders = () => {
//   const { data: orders = { pending: [], approved: [] }, isLoading, isError } = useOrders();
//   const location = useLocation();
//   const [activeTab, setActiveTab] = useState("assigned");
//   const [search, setSearch] = useState("");
//   const [pagePending, setPagePending] = useState(1);
//   const [pageAssigned, setPageAssigned] = useState(1);
//   const [perPagePending, setPerPagePending] = useState(10);
//   const [perPageAssigned, setPerPageAssigned] = useState(10);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
//   const params = new URLSearchParams(location.search);
//   const initialStatus = params.get("status") ? params.get("status").charAt(0).toUpperCase() + params.get("status").slice(1) : "All";
//   const [selectedStatus, setSelectedStatus] = useState(initialStatus);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setStatusDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const getValueByPath = (obj, path) => path.split(".").reduce((acc, part) => acc && acc[part], obj);

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   const renderSortIcon = (key) => (
//     <span className="inline-flex flex-row ml-1 text-xs">
//       <FiArrowUp className={sortConfig.key === key && sortConfig.direction === "asc" ? "text-[#F77F00]" : "text-gray-400"} />
//       <FiArrowDown className={sortConfig.key === key && sortConfig.direction === "desc" ? "text-[#F77F00]" : "text-gray-400"} />
//     </span>
//   );

//   const data = activeTab === "pending" ? orders?.pending : orders?.approved;
//   const page = activeTab === "pending" ? pagePending : pageAssigned;
//   const perPage = activeTab === "pending" ? perPagePending : perPageAssigned;
//   const setPage = activeTab === "pending" ? setPagePending : setPageAssigned;
//   const setPerPage = activeTab === "pending" ? setPerPagePending : setPerPageAssigned;

//   const filteredOrders = data?.filter((o) =>
//     `${o.orderId} ${o.traveler?.name || ""} ${o.partner?.name || ""} ${o.rider?.name || ""}`
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   const statusOptions = useMemo(() => {
//     const allStatuses = [
//       ...new Set(
//         [
//           ...(orders?.pending || []),
//           ...(orders?.approved || []),
//         ].map((o) => o.status?.charAt(0).toUpperCase() + o.status?.slice(1) || "")
//       ),
//     ].filter(Boolean);
//     return ["All", ...allStatuses];
//   }, [orders]);

//   const statusFilteredOrders = useMemo(() => {
//     if (selectedStatus === "All") return filteredOrders;
//     return filteredOrders.filter((o) => o.status?.toLowerCase() === selectedStatus.toLowerCase());
//   }, [filteredOrders, selectedStatus]);

//   const sortedOrders = useMemo(() => {
//     if (!sortConfig.key) return statusFilteredOrders;
//     return [...statusFilteredOrders].sort((a, b) => {
//       const aValue = getValueByPath(a, sortConfig.key)?.toString().toLowerCase() || "";
//       const bValue = getValueByPath(b, sortConfig.key)?.toString().toLowerCase() || "";
//       if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [statusFilteredOrders, sortConfig]);

//   const paginatedOrders = useMemo(() => {
//     const start = (page - 1) * perPage;
//     return sortedOrders.slice(start, start + perPage);
//   }, [sortedOrders, page, perPage]);

//   return (
//     <div className="flex flex-col gap-6 p-3">
//       <div className="flex flex-col gap-4">
//         <Breadcrumb items={[{ label: "Dashboard", path: "/" }, { label: "Orders" }]} />
//         <div className="flex justify-between gap-4">
//           <div className="gap-2">
//             <h2 className="text-2xl fw6 font-roboto text-[#232323]">Orders</h2>
//             <p className="text-[#232323] text-sm">View and manage all orders in the platform.</p>
//           </div>
//         </div>
//       </div>
//       <div className="flex gap-4 bg-[#FEECD9] rounded-lg p-2 w-fit">
//         <button
//           onClick={() => setActiveTab("assigned")}
//           className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${activeTab === "assigned" ? "bg-orange text-white shadow" : "text-gray-600"}`}
//         >
//           Assigned ({orders.approved.length})
//         </button>
//         <button
//           onClick={() => setActiveTab("pending")}
//           className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${activeTab === "pending" ? "bg-orange text-white shadow" : "text-gray-600"}`}
//         >
//           Pending ({orders.pending.length})
//         </button>
//       </div>
//       <div className="bg-white rounded-lg shadow border-color p-3 overflow-x-auto">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2">
//           <div className="relative text-[#9A9A9A]">
//             <span className="absolute inset-y-0 left-0 flex items-center pl-5">
//               <FiSearch size={16} />
//             </span>
//             <input
//               type="text"
//               placeholder="Search"
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               className="pl-9 pr-2 px-4 py-2 border border-[#D9D9D9] bg-white rounded-lg w-[320px] focus:outline-none"
//             />
//           </div>
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setStatusDropdownOpen((prev) => !prev)}
//               className="flex items-center border border-[#23232333] rounded-lg px-3 py-2 text-sm text-[#232323] gap-2 h-[42px] bg-white hover:bg-gray-50"
//             >
//               {selectedStatus} <FiChevronDown size={16} />
//             </button>
//             {statusDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                 {statusOptions.map((status) => (
//                   <button
//                     key={status}
//                     onClick={() => {
//                       setSelectedStatus(status);
//                       setStatusDropdownOpen(false);
//                     }}
//                     className={`block w-full text-left px-4 py-2 text-sm ${selectedStatus === status ? "bg-[#FEECD9] text-[#F77F00] font-medium" : "text-gray-700 hover:bg-gray-100"}`}
//                   >
//                     {status}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//         {activeTab === "pending" ? (
//           <PendingOrders orders={paginatedOrders} handleSort={handleSort} renderSortIcon={renderSortIcon} />
//         ) : (
//           <AssignedOrders orders={paginatedOrders} handleSort={handleSort} renderSortIcon={renderSortIcon} />
//         )}
//         <Pagination
//           page={page}
//           setPage={setPage}
//           perPage={perPage}
//           setPerPage={setPerPage}
//           totalItems={statusFilteredOrders.length}
//           options={[5, 10, 25, 50]}
//           fullWidth={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default Orders;
import React, { useState, useMemo, useEffect, useRef } from "react";
import { FiSearch, FiChevronDown, FiArrowUp, FiArrowDown } from "react-icons/fi";
import AssignedOrders from "./AssignedOrders";
import PendingOrders from "./PendingOrders";
import Pagination from "../../components/Pagination";
import { useOrders } from "../../hooks/useOrder";
import Breadcrumb from "../../components/Breadcrumb";
import { useLocation } from "react-router-dom";

const Orders = () => {
  const { data: orders = { pending: [], approved: [] }, isLoading, isError } = useOrders();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("assigned");
  const [search, setSearch] = useState("");
  const [pagePending, setPagePending] = useState(1);
  const [pageAssigned, setPageAssigned] = useState(1);
  const [perPagePending, setPerPagePending] = useState(10);
  const [perPageAssigned, setPerPageAssigned] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const params = new URLSearchParams(location.search);
  const initialStatus = params.get("status") ? params.get("status").charAt(0).toUpperCase() + params.get("status").slice(1) : "All";
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getValueByPath = (obj, path) => path.split(".").reduce((acc, part) => acc && acc[part], obj);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => (
    <span className="inline-flex flex-row ml-1 text-xs">
      <FiArrowUp className={sortConfig.key === key && sortConfig.direction === "asc" ? "text-[#F77F00]" : "text-gray-400"} />
      <FiArrowDown className={sortConfig.key === key && sortConfig.direction === "desc" ? "text-[#F77F00]" : "text-gray-400"} />
    </span>
  );

  const data = activeTab === "pending" ? orders?.pending : orders?.approved;
  const page = activeTab === "pending" ? pagePending : pageAssigned;
  const perPage = activeTab === "pending" ? perPagePending : perPageAssigned;
  const setPage = activeTab === "pending" ? setPagePending : setPageAssigned;
  const setPerPage = activeTab === "pending" ? setPerPagePending : setPerPageAssigned;

  const filteredOrders = data?.filter((o) =>
    `${o.orderId} ${o.traveler?.name || ""} ${o.partner?.name || ""} ${o.rider?.name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const statusOptions = useMemo(() => {
    const allStatuses = [
      ...new Set(
        [
          ...(orders?.pending || []),
          ...(orders?.approved || []),
        ].map((o) => o.status?.charAt(0).toUpperCase() + o.status?.slice(1) || "")
      ),
    ].filter(Boolean);
    return ["All", ...allStatuses];
  }, [orders]);

  const statusFilteredOrders = useMemo(() => {
    if (selectedStatus === "All") return filteredOrders;
    return filteredOrders.filter((o) => o.status?.toLowerCase() === selectedStatus.toLowerCase());
  }, [filteredOrders, selectedStatus]);

  const sortedOrders = useMemo(() => {
    if (!sortConfig.key) return statusFilteredOrders;
    return [...statusFilteredOrders].sort((a, b) => {
      const aValue = getValueByPath(a, sortConfig.key)?.toString().toLowerCase() || "";
      const bValue = getValueByPath(b, sortConfig.key)?.toString().toLowerCase() || "";
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [statusFilteredOrders, sortConfig]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * perPage;
    return sortedOrders.slice(start, start + perPage);
  }, [sortedOrders, page, perPage]);

  return (
    <div className="flex flex-col gap-6 p-3">
      <div className="flex flex-col gap-4">
        <Breadcrumb items={[{ label: "Dashboard", path: "/" }, { label: "Orders" }]} />
        <div className="flex justify-between gap-4 flex-col sm:flex-row">
          <div className="gap-2">
            <h2 className="text-2xl fw6 font-roboto text-[#232323]">Orders</h2>
            <p className="text-[#232323] text-sm">View and manage all orders in the platform.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-[#FEECD9] rounded-lg p-2 w-full sm:w-fit justify-between sm:justify-start">
        <button
          onClick={() => setActiveTab("assigned")}
          className={`flex-1 sm:flex-none text-center px-3 py-2 rounded-md text-sm fw5 transition ${activeTab === "assigned" ? "bg-orange text-white shadow" : "text-gray-600"}`}
        >
          Assigned ({orders.approved.length})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 sm:flex-none text-center px-3 py-2 rounded-md text-sm fw5 transition ${activeTab === "pending" ? "bg-orange text-white shadow" : "text-gray-600"}`}
        >
          Pending ({orders.pending.length})
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border-color p-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2">
          <div className="relative w-full md:w-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
              <FiSearch size={16} className="text-[#9A9A9A]" />
            </span>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-3 py-2 border border-[#D9D9D9] bg-white rounded-lg w-full sm:w-[320px] focus:outline-none text-sm"
            />
          </div>

          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              onClick={() => setStatusDropdownOpen((prev) => !prev)}
              className="w-full sm:w-auto flex items-center justify-between border border-[#23232333] rounded-lg px-3 py-2 text-sm text-[#232323] gap-2 h-[42px] bg-white hover:bg-gray-50"
            >
              {selectedStatus}
              <FiChevronDown size={16} />
            </button>
            {statusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-full sm:w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status);
                      setStatusDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${selectedStatus === status ? "bg-[#FEECD9] text-[#F77F00] font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {activeTab === "pending" ? (
          <PendingOrders orders={paginatedOrders} handleSort={handleSort} renderSortIcon={renderSortIcon} />
        ) : (
          <AssignedOrders orders={paginatedOrders} handleSort={handleSort} renderSortIcon={renderSortIcon} />
        )}

        <div className="mt-3">
          <Pagination
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            totalItems={statusFilteredOrders.length}
            options={[5, 10, 25, 50]}
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Orders;
