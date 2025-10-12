import React, { useState, useMemo } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import Pagination from "../../components/Pagination";
import productsData from "../../data/ProductsData";
import Editing from "../../assets/SVG/editing.svg";
import Rating from "../../assets/SVG/rating.svg";
import Delete from "../../assets/SVG/delete.svg";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import productImg from "../../assets/Images/Pro_img.jpg";


const Products = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [bulkOpen, setBulkOpen] = useState(false);

  const navigate = useNavigate();

  const products = Array.isArray(productsData) ? productsData : [];

  const filteredProducts = products.filter((p) =>
    (p.productName?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredProducts.slice(start, start + perPage);
  }, [filteredProducts, page, perPage]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedProducts.map((p) => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    if (selected.length === 0) {
      alert("⚠️ Please select at least one product.");
      return;
    }
    if (action === "delete") {
      alert(`Deleting ${selected.length} products...`);
    } else if (action === "export") {
      alert(`Exporting ${selected.length} products...`);
    } else if (action === "archive") {
      alert(`Archiving ${selected.length} products...`);
    }
    setBulkOpen(false);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Available":
        return "bg-[#E7F7ED] text-[#088B3A]";
      case "Maintenance":
        return "bg-[#FEFCDD] text-[#B2A23F]";
      case "Out":
      case "Out of Stock":
        return "bg-[#FCECD6] text-[#CA4E2E]";
      default:
        return "bg-[#F9F9F9] text-[#6C6C6C]";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-3">
      <div className="flex flex-col gap-4">
        {/* <div className="flex items-center text-xs gap-1">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className="text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Products</p>
        </div> */}
         <Breadcrumb
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Products"},
            ]}
          />
        <div>
          <h2 className="text-2xl font-roboto fw6 text-[#232323]">Products</h2>
          <p className="text-[#232323] text-sm">
            Manage all rental items, availability, and pricing.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg  border-color p-3 overflow-x-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
          <div className="relative text-[#9A9A9A] px-2 py-2 gap-3 text-xs leading-[150%] tracking-[-3%]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-5">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Search in product"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-2 px-4 py-2 gap-2 border border-[#D9D9D9] bg-[#FFFFFF] rounded-lg text-base w-[320px] leading-[150%] focus:outline-none focus:border-[#D9D9D9]"
            />
          </div>

          <div className="flex gap-2 relative">
            <button    className="flex items-center justify-between border border-[#23232333] rounded-lg px-3 py-0.5 text-sm text-[#9A9A9A] gap-3 max-w-[127px] h-[42px]">
              Filters
              <FiChevronDown size={16} />
            </button>

            <button
                 className="flex items-center justify-between border border-[#F77F00] bg-[#F77F00] rounded-lg px-3 py-0.5 text-sm text-[#FFFFFF] gap-3 max-w-[127px] h-[42px]"
              onClick={() => navigate("/products/addproduct")}
            >
              + Add Product
            </button>

            <div className="relative">
              <button
                onClick={() => setBulkOpen(!bulkOpen)}
                   className="flex items-center justify-between border border-[#F77F00]  bg-[#FEF2E6] rounded-lg px-3 py-0.5 text-sm text-[#F77F00] gap-3 max-w-[135px] h-[42px]"
              >
                Bulk Actions <FiChevronDown size={14} />
              </button>

              {bulkOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                  <ul className="text-sm text-[#232323]">
                    <li
                      onClick={() => handleBulkAction("delete")}
                      className="px-4 py-2 hover:bg-[#FEF2E6] cursor-pointer"
                    >
                      Delete Selected
                    </li>
                    <li
                      onClick={() => handleBulkAction("export")}
                      className="px-4 py-2 hover:bg-[#FEF2E6] cursor-pointer"
                    >
                      Export Selected
                    </li>
                    <li
                      onClick={() => handleBulkAction("archive")}
                      className="px-4 py-2 hover:bg-[#FEF2E6] cursor-pointer"
                    >
                      Archive Selected
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-[#F9F9F9] text-[#6C6C6C]">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-400"
                  onChange={handleSelectAll}
                  checked={
                    selected.length === paginatedProducts.length &&
                    paginatedProducts.length > 0
                  }
                />
              </th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Prep Buffer</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white text-[#232323]"
          onClick={() => navigate("/products/editproduct")}>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FEF2E6] transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-400"
                      checked={selected.includes(p.id)}
                      onChange={() => handleSelectOne(p.id)}
                    />
                  </td>

                  <td className="px-4 py-3 flex items-center gap-2">
                    <img
                      src={p.image || productImg }
                      alt={p.productName}
                      className="w-10 h-10 rounded object-cover"
                      onError={(e) => { e.currentTarget.src = productImg; }}
                    />
                    <span>{p.productName}</span>
                  </td>

                  <td className="px-4 py-3">{p.grade}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-md ${getStatusClass(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">{p.prepBuffer}</td>

                  <td className="px-4 py-3 flex items-center gap-1 text-orange">
                    <img src={Rating} alt="" /> {p.rating}
                  </td>

                  <td className="px-4 py-3">${p.value}</td>

                  <td className="px-4 py-3">${p.price}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className=" rounded-lg"
                        onClick={() => navigate("/products/editproduct")}
                      >
                        <img src={Editing} alt="" />
                      </button>
                      <button className="p-2 rounded-lg border border-[#F77F00]  bg-[#FCEBEC] text-[#CA4E2E] hover:bg-[#f9dbbe]  ">
                        <img src={Delete} alt="" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          totalItems={filteredProducts.length}
          options={[5, 10, 25, 50]}
          fullWidth={true}
        />
      </div>
    </div>
  );
};

export default Products;
