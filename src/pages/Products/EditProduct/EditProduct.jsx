import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import API from "../../../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import Video from "../../../assets/SVG/video.svg";
import BasicInfo from "./BasicInfo";
import RentalDetails from "./RentalDetails";
import Location from "./Location";
import SizeFit from "./SizeFit";
import Condition from "./Condition";
import backward from "../../../assets/SVG/backward.svg";
import Breadcrumb from "../../../components/Breadcrumb";
import { toast } from "react-toastify";


const EditProduct = () => {
  const { id } = useParams();
  const productId = id;
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [keepImages, setKeepImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    productname: "",
    brand: "",
    color: "",
    material: "",
    careMethod: "",
    weight: "",
    url: "",
    basePrice: "",
    extensionPrice: "",
    deposite: "",
    lateFee: "",
    replacementValue: "",
    keepToBuyPrice: "",
    minRentalPeriod: "",
    maxRentalPeriod: "",
    prepBuffer: "",
    date: "",
    location: "",
    sku: "",
    barcode: "",
    fitType: "",
    chest: "",
    lengthType: "",
    sleeve: "",
    coditionGrade: "",
    status: "",
    note: "",
    sizeUnit: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`products/${productId}`);
        const product = data.data || {};

        setProductData({
          productname: product.name || "",
          brand: product.brand || "",
          color: product.color || "",
          material: product.material || "",
          careMethod: product.care_method || "",
          weight: product.weight || "",
          url: product.url || "",
          basePrice: product.base_price || "",
          extensionPrice: product.extensions_price || "",
          deposite: product.deposit || "",
          lateFee: product.late_fee || "",
          replacementValue: product.replacement_value || "",
          keepToBuyPrice: product.keep_to_buy_price || "",
          minRentalPeriod: product.min_rental_period || "",
          maxRentalPeriod: product.max_rental_period || "",
          prepBuffer: product.prep_buffer || "",
          date: product.blackout_date || "",
          location: product.location || "",
          sku: product.sku || "",
          barcode: product.barcode || "",
          fitType: product.fit_category || "",
          chest: product.chest || "",
          lengthType: product.length || "",
          sleeve: product.sleeve || "",
          coditionGrade: product.condition_grade || "",
          status: product.product_availibity || "",
          note: product.note || "",
          sizeUnit: product.unit || "",
        });

        const sortedImages = (product.images || []).sort(
          (a, b) => b.is_primary - a.is_primary
        );
        setImages(sortedImages);
        setKeepImages(sortedImages.map((img) => img.id));

        const primary =
          sortedImages.find((img) => img.is_primary) ||
          sortedImages[0] ||
          null;
        setMainImage(primary ? primary.image_url : null);

        const firstVideo = product.videos?.[0] || {};
        setVideoUrl(firstVideo.video_url || firstVideo.video_path || "");
      } catch {
        setError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // --- IMAGE HANDLERS ---
  const handleAddImage = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map((file, idx) => ({
      id: Date.now() + idx,
      image_url: URL.createObjectURL(file),
      is_primary: false,
      file,
    }));

    setImages((prev) => {
      const updated = [...prev, ...newImages];
      // If no primary image exists, set the first one as primary
      if (!updated.some((img) => img.is_primary)) {
        updated[0].is_primary = true;
        setMainImage(updated[0].image_url);
      }
      return updated;
    });
  };

  const handleRemoveImage = (imageUrl, id = null) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.image_url !== imageUrl);

      // If this was main image, pick next available
      if (mainImage === imageUrl) {
        const nextMain =
          updated.find((img) => img.is_primary)?.image_url ||
          updated[0]?.image_url ||
          null;
        setMainImage(nextMain);
      }

      // Remove backend IDs
      if (id) {
        setKeepImages((prevIds) => prevIds.filter((keepId) => keepId !== id));
      }

      if (updated.length === 0) {
        setKeepImages([]);
        setMainImage(null);
      }

      return updated;
    });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl("");
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoUrl("");
    const input = document.getElementById("productVideo");
    if (input) input.value = "";
  };

  const handleUrlChange = (e) => {
    setVideoUrl(e.target.value);
    setVideoFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      const formData = new FormData();
      for (const [key, value] of Object.entries(productData)) {
        formData.append(key, value ?? "");
      }
      if (videoFile) formData.append("video_file", videoFile);
      else if (videoUrl) formData.append("video_url", videoUrl);
      images.forEach((img) => {
        if (img.file instanceof File) {
          formData.append("images[]", img.file);
        }
      });
      keepImages.forEach((id) => {
        if (id) formData.append("keep_images[]", id);
      });
      formData.append("_method", "PUT");
      await API.post(`products/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully!");
      navigate('/products', { replace: true });
    } catch {
      // setError("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading product...</p>;
  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-6 p-3">

      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Products", path: "/products" },

          { label: "Edit Product" },
        ]}
      />

      <div className="flex flex-col gap-1">

        <div className="flex gap-3 items-center">
          <Link to="/products" className="group">
            <img
              src={backward}
              alt="backward"
              className="w-6 h-6 transform transition-transform duration-300 group-hover:-translate-x-1"
            />
          </Link>
          <span className="text-2xl fw6 font-roboto text-[#232323]">
            Edit Product
          </span>
        </div>


        <p className="ms-10 text-sm fw4 text-[#232323]">
          Update your product details below.
        </p>
      </div>




      <form onSubmit={handleSubmit}>
        <div className="bg-white border-color rounded-lg p-4 flex flex-col gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">

              <h3 className="fw5 text-[16px] text-[#232323]">Product Images</h3>

              {mainImage ? (
                <div className="relative w-full h-60">
                  <img
                    src={mainImage}
                    alt="main"
                    className="w-full h-full object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => {
                      const img = images.find((i) => i.image_url === mainImage);
                      handleRemoveImage(mainImage, img?.id);
                    }}
                    type="button"
                    className="absolute top-2 right-2 flex items-center justify-center w-[24px] h-[24px] rounded bg-[#F77F00] text-white text-[12px]"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="w-full h-60 bg-[#D9D9D9] rounded-lg flex items-center justify-center text-gray-500 cursor-pointer hover:bg-[#cfcfcf] transition">
                  + Add Main Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAddImage}
                  />
                </label>
              )}

              {/* Gallery: only show non-primary images */}
              <div className="flex gap-2 flex-wrap mt-4">
                {images
                  .filter((img) => !img.is_primary)
                  .map((img) => (
                    <div key={img.id} className="relative w-24 h-24 group">
                      <img
                        src={img.image_url}
                        alt="gallery"
                        className="w-full h-full object-cover rounded-[10px] border cursor-not-allowed"
                      />
                      <button
                        onClick={() => handleRemoveImage(img.image_url, img?.id)}
                        type="button"
                        className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center w-[20px] h-[20px] rounded bg-[#F77F00] text-white text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-[#D9D9D9] rounded-[10px] cursor-pointer hover:bg-gray-100 transition">
                  +
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleAddImage}
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="fw5 text-[16px] text-[#232323]">Product Video</h3>
              {!videoFile && !videoUrl ? (
                <div
                  className="border-2 border-dashed border-gray-300 justify-center gap-2 rounded-lg p-6 flex flex-col items-center cursor-pointer h-[221px]"
                  onClick={() =>
                    document.getElementById("productVideo").click()
                  }
                >
                  <img src={Video} alt="" className="w-8 h-8 mb-2" />
                  <p className="text-base fw6 text-[#6C6C6C]">
                    Upload product video
                  </p>
                  <p className="text-xs text-[#9A9A9A]">
                    Only MP4, MOV, AVI allowed.
                  </p>
                </div>
              ) : (
                <div className="relative w-full">
                  <video
                    src={
                      videoFile instanceof File
                        ? URL.createObjectURL(videoFile)
                        : videoUrl
                    }
                    controls
                    className="w-full h-60 object-cover rounded-[10px] border"
                  />
                  <button
                    onClick={handleRemoveVideo}
                    type="button"
                    className="absolute top-2 right-2 flex items-center justify-center w-[24px] h-[24px] rounded-md bg-[#FEF2E6] text-[#F77F00] text-[12px]"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}
              <input
                type="file"
                id="productVideo"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
              />
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-[#D9D9D9]" />
                <span className="text-sm text-gray-500">OR</span>
                <div className="flex-1 h-px bg-[#D9D9D9]" />
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  value={videoUrl}
                  onChange={handleUrlChange}
                  disabled={!!videoFile}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9]"
                  placeholder=" "
                />
                <label
                  htmlFor="videoUrl"
                  className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2"
                >
                  Add URL
                </label>
              </div>
            </div>
          </div>
        </div>

        <BasicInfo
          productData={productData}
          handleChange={handleChange}
          setProductData={setProductData}
        />
        <RentalDetails
          productData={productData}
          handleChange={handleChange}
          setProductData={setProductData}
        />
        <Location
          productData={productData}
          handleChange={handleChange}
          setProductData={setProductData}
        />
        <SizeFit
          productData={productData}
          handleChange={handleChange}
          setProductData={setProductData}
        />
        <Condition
          productData={productData}
          handleChange={handleChange}
          setProductData={setProductData} />

        <div className="bg-[#FFFFFF] px-6 py-6 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] rounded-lg hover:bg-[#F77F00] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-3 text-sm border border-[#F77F00] bg-[#F77F00] text-white rounded-lg hover:bg-[#e96e00]"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
