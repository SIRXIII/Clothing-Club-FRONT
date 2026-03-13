
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
import { useAuth } from "../../context/AuthContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const stripeConnected = user?.stripe_connected === true;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/products");
        setProducts(data.data || []);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Breadcrumb items={[{ label: "Dashboard", path: "/" }, { label: "Products" }]} />
        <div>
          <h2 className="text-2xl font-roboto fw6 text-[#232323]">Products</h2>
          <p className="text-[#232323] text-sm">Manage all rental items, availability, and pricing.</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow border-color p-3">
        {/* Search + Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-2 sm:p-4">
          {/* Search */}
          <div className="relative w-full sm:w-auto text-[#9A9A9A]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Search product"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-2 py-2 border border-[#D9D9D9] bg-[#FFFFFF] rounded-lg text-base w-full sm:w-[280px] focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative w-full justify-end">
            {/* Add Product Button */}
            <button
              className="flex items-center justify-center border rounded-lg px-3 py-2 text-sm gap-2 w-full sm:w-auto border-[#F77F00] bg-[#F77F00] text-white"
              onClick={() => navigate("/products/addproduct")}
              title="Add Product"
            >
              + Add Product
            </button>

            {/* Bulk Actions Dropdown (visible only on md+ screens) */}
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setBulkOpen((prev) => !prev)}
                className="flex items-center justify-between border border-[#F77F00] bg-[#FEF2E6] rounded-lg px-3 py-2 text-sm text-[#F77F00] gap-2 w-full sm:w-auto"
              >
                Bulk Actions <FiChevronDown size={14} />
              </button>

              {bulkOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-[#F77F00]/30 rounded-lg shadow-lg z-50">
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

        {/* Loading/Error/Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            {/* Table for desktop */}
            <table className="hidden sm:table min-w-full text-left text-sm border-collapse">
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
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Color</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3 flex justify-center">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white text-[#232323]">
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FEF2E6] border-t border-gray-200">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selected.includes(p.id)}
                        onChange={() => handleSelectOne(p.id)}
                      />
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={p.images?.[0]?.image_url || productImg}
                        alt={p.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      {p.name}
                    </td>
                    <td className="px-4 py-3">{p.category || "-"}</td>
                    <td className="px-4 py-3">{p.brand || "-"}</td>
                    <td className="px-4 py-3">{p.color || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 text-xs rounded-md ${getStatusClass(p.product_availibity)}`}>
                        {p.product_availibity || "unavailable"}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-1 text-orange">
                      <img src={Rating} alt="" className="w-4 h-4" /> {p.average_rating}
                    </td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">${p.base_price}</td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      {/* <img src={Eye} alt="view" onClick={() => navigate("/products/viewproduct/" + p.id)} className="w-6 h-6 cursor-pointer" />
                      <img src={Editing} alt="edit" onClick={() => navigate("/products/editproduct/" + p.id)} className="w-6 h-6 cursor-pointer" />
                      <img src={Delete} alt="delete" onClick={() => { setDeleteId(p.id); setConfirmOpen(true); }} className="w-6 h-6 cursor-pointer" /> */}

                      <div className="flex items-center gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => navigate(`/products/viewproduct/${p.id}`)}
                          title="View Product"
                          className="p-2 md:p-2.5 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E] hover:bg-[#f9dbbe] w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all"
                        >
                          <img src={Eye} alt="view" className="w-4 h-4 md:w-5 md:h-5" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => navigate(`/products/editproduct/${p.id}`)}
                          title="Edit Product"
                          className="p-2 md:p-2.5 rounded-lg  text-[#F77F00]   flex items-center justify-center transition-all"
                        >
                          <img src={Editing} alt="edit" className="w-10 h-10" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            setDeleteId(p.id);
                            setConfirmOpen(true);
                          }}
                          title="Delete Product"
                          className="p-2 md:p-2.5 rounded-lg border bg-[#FCEBEC] text-[#CA4E2E] hover:bg-[#f9dbbe] w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all"
                        >
                          <img src={Delete} alt="delete" className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="sm:hidden flex flex-col gap-3">
              {paginatedProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E5E5]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]?.image_url || productImg}
                        alt={p.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-base font-semibold">{p.name}</h3>
                        <p className="text-sm text-gray-500">{p.gender || "-"}</p>
                       
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-md ${getStatusClass(p.product_availibity)}`}>
                      {p.product_availibity || "unavailable"}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between text-sm text-gray-600">
                    <p>Stock: {p.stock}</p>
                    <p>Price: ${p.base_price}</p>
                  </div>

                  {/* <div className="mt-3 flex justify-end gap-3">
                    <button onClick={() => navigate("/products/viewproduct/" + p.id)}>
                      <img src={Eye} alt="view" className="w-6 h-6" />
                    </button>
                    <button onClick={() => navigate("/products/editproduct/" + p.id)}>
                      <img src={Editing} alt="edit" className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(p.id);
                        setConfirmOpen(true);
                      }}
                    >
                      <img src={Delete} alt="delete" className="w-6 h-6" />
                    </button>
                  </div> */}
                  <div className="mt-3 flex flex-wrap sm:flex-nowrap gap-2 justify-end">
                    <button
                      onClick={() => navigate("/products/viewproduct/" + p.id)}
                      className="p-2 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E] hover:bg-[#f9dbbe] w-7 h-7 md:w-10 md:h-10 flex items-center justify-center"
                      title="View Product"
                    >
                      <img src={Eye} alt="view" className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    <button
                      onClick={() => navigate("/products/editproduct/" + p.id)}
                      className="p-2 rounded-lg border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] hover:bg-[#f9dbbe] w-7 h-7 md:w-10 md:h-10 flex items-center justify-center"
                      title="Edit Product"
                    >
                      <img src={Editing} alt="edit" className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    <button
                      onClick={() => {
                        setDeleteId(p.id);
                        setConfirmOpen(true);
                      }}
                      className="p-2 rounded-lg border border-[#F77F00] bg-[#FCEBEC] text-[#CA4E2E] hover:bg-[#f9dbbe] w-7 h-7 md:w-10 md:h-10 flex items-center justify-center"
                      title="Delete Product"
                    >
                      <img src={Delete} alt="delete" className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
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
