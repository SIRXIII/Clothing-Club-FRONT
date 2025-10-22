import React, { useState, useMemo, useEffect, useRef } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import Pagination from "../../components/Pagination";
import API from "../../services/api";
import Editing from "../../assets/SVG/editing.svg";
import Rating from "../../assets/SVG/rating.svg";
import Delete from "../../assets/SVG/delete.svg";
import Eye from "../../assets/SVG/eyeorange.svg";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import productImg from "../../assets/Images/Pro_img.jpg";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/Dialogs/ConfirmDialog";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false); // ✅ For confirm dialog
  const [deleteId, setDeleteId] = useState(null); // ✅ ID to delete

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch products dynamically
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/products");
        setProducts(data.data || []);

        console.log("products", data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setBulkOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredProducts = products.filter((p) =>
    (p.productname?.toLowerCase() || "").includes(search.toLowerCase())
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

  // ✅ Single Delete Handler (API + Toast)
  const handleSingleDelete = async (id) => {
    try {
      setLoading(true);
      await API.post("/products/bulk-delete", { ids: [id] });

      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Bulk Delete Handler
  const handleBulkAction = async (action) => {
    if (selected.length === 0) {
      toast.warning("Please select at least one product.");
      return;
    }

    if (action === "delete") {
      try {
        setLoading(true);
        await API.post("/products/bulk-delete", { ids: selected });

        setProducts((prev) => prev.filter((p) => !selected.includes(p.id)));
        setSelected([]);
        toast.success("Selected products deleted successfully.");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete selected products.");
      } finally {
        setLoading(false);
        setBulkOpen(false);
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "available":
        return "bg-[#E7F7ED] text-[#088B3A]";
      case "Under Maintenance":
        return "bg-[#FEFCDD] text-[#B2A23F]";
      case "Out":
      case "Out of Stock":
        return "bg-[#FCECD6] text-[#CA4E2E]";
      case "rental":
        return "bg-green-100 text-green-800";
      default:
        return "bg-[#F9F9F9] text-[#6C6C6C]";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-3">
      <div className="flex flex-col gap-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", path: "/" },
            { label: "Products" },
          ]}
        />
        <div>
          <h2 className="text-2xl font-roboto fw6 text-[#232323]">Products</h2>
          <p className="text-[#232323] text-sm">
            Manage all rental items, availability, and pricing.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border-color p-3 overflow-x-auto">
        {/* 🔍 Search + Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
          <div className="relative text-[#9A9A9A]">
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
              className="pl-9 pr-2 px-4 py-2 border border-[#D9D9D9] bg-[#FFFFFF] rounded-lg text-base w-[320px] focus:outline-none"
            />
          </div>

          <div className="flex gap-2 relative">
            <button className="flex items-center justify-between border border-[#23232333] rounded-lg px-3 py-2 text-sm text-[#9A9A9A] gap-3">
              Filters
              <FiChevronDown size={16} />
            </button>

            <button
              className="flex items-center justify-between border border-[#F77F00] bg-[#F77F00] rounded-lg px-3 py-2 text-sm text-[#FFFFFF] gap-3"
              onClick={() => navigate("/products/addproduct")}
            >
              + Add Product
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setBulkOpen((prev) => !prev)}
                className="flex items-center justify-between border border-[#F77F00] bg-[#FEF2E6] rounded-lg px-3 py-2 text-sm text-[#F77F00] gap-3"
              >
                Bulk Actions <FiChevronDown size={14} />
              </button>

              {bulkOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border-color  rounded-lg shadow-lg z-50">
                  <ul className="text-sm text-[#232323]">
                    <li
                      onClick={() => handleBulkAction("delete")}
                      className="px-4 py-3 hover:bg-[#FEF2E6] rounded-lg cursor-pointer capitalize"
                    >
                      Delete Selected
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🌀 Loading / Error / Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#F9F9F9] text-[#6C6C6C]">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
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
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white text-[#232323]">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="h-[200px]">
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <p className="text-orange-500 font-semibold text-lg">
                        No products found.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Try adjusting filters or check back later.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FEF2E6]">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selected.includes(p.id)}
                        onChange={() => handleSelectOne(p.id)}
                      />
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img
                        src={p.images?.[0]?.image_url || productImg}
                        alt={p.name}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src = productImg;
                        }}
                      />
                      <span>{p.name}</span>
                    </td>
                    <td className="px-4 py-3">{p.condition_grade || "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-md ${getStatusClass(
                          p.product_availibity
                        )}`}
                      >
                        {p.product_availibity || "unavailable"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{p.prep_buffer || "—"}</td>
                    <td className="px-4 py-3 flex items-center gap-1 text-orange">
                      <img src={Rating} alt="" /> {p.average_rating}
                    </td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">${p.base_price}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate("/products/viewproduct/" + p.id)
                          }
                          className="p-2 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E] hover:bg-[#f9dbbe]"
                          title="View Product"
                        >
                          <img src={Eye} alt="view" />
                        </button>
                        <button
                          onClick={() =>
                            navigate("/products/editproduct/" + p.id)
                          }
                        >
                          <img src={Editing} alt="edit" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(p.id);
                            setConfirmOpen(true);
                          }}
                          className="p-2 rounded-lg border border-[#F77F00] bg-[#FCEBEC] text-[#CA4E2E] hover:bg-[#f9dbbe]"
                        >
                          <img src={Delete} alt="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

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

      {/* ✅ Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={() => {
          handleSingleDelete(deleteId);
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default Products;
