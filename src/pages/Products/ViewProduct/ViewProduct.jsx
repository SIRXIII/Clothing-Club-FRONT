import React, { useState, useEffect } from "react";
import API from "../../../services/api";
import { Link, useParams } from "react-router-dom";
import Video from "../../../assets/SVG/video.svg";
import BasicInfo from "../EditProduct/BasicInfo";
import RentalDetails from "../EditProduct/RentalDetails";
import Location from "../EditProduct/Location";
import SizeFit from "../EditProduct/SizeFit";
import Condition from "../EditProduct/Condition";
import backward from "../../../assets/SVG/backward.svg";
import Breadcrumb from "../../../components/Breadcrumb";
import ImagePreviewGallery from "../../../components/ImagePreviewGallery";

const ViewProduct = () => {
  const { id } = useParams();
  const productId = id;
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [sizes, setSizes] = useState([]);

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

        const primary =
          sortedImages.find((img) => img.is_primary) ||
          sortedImages[0] ||
          null;
        setMainImage(primary ? primary.image_url : null);

        const firstVideo = product.videos?.[0] || {};
        setVideoUrl(firstVideo.video_url || firstVideo.video_path || "");

        // Load product sizes
        if (product.sizes && Array.isArray(product.sizes)) {
          setSizes(product.sizes.map((size) => ({
            size: size.size,
            quantity: size.quantity || 0,
          })));
        } else {
          setSizes([]);
        }
      } catch {
        setError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Dummy handlers for view mode - these won't actually do anything
  const handleChange = () => {};

  // Image preview handlers
  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewImage(null);
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
          { label: "View Product" },
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
            View Product
          </span>
        </div>

        <p className="ms-10 text-sm fw4 text-[#232323]">
          Product details in view-only mode.
        </p>
      </div>

      {/* View-only form */}
      <div className="bg-white border-color rounded-lg p-4 flex flex-col gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <h3 className="fw5 text-[16px] text-[#232323]">Product Images</h3>

            {mainImage ? (
              <div className="relative w-full h-60">
                <img
                  src={mainImage}
                  alt="main"
                  className="w-full h-full object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(mainImage)}
                />
              </div>
            ) : (
              <div className="w-full h-60 bg-[#F5F5F5] rounded-lg flex items-center justify-center text-gray-500">
                No Image Available
              </div>
            )}

            {/* Gallery: show all non-primary images */}
            <div className="flex gap-2 flex-wrap mt-4">
              {images
                .filter((img) => !img.is_primary)
                .map((img) => (
                  <div key={img.id} className="relative w-24 h-24">
                    <img
                      src={img.image_url}
                      alt="gallery"
                      className="w-full h-full object-cover rounded-[10px] border cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleImageClick(img.image_url)}
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="fw5 text-[16px] text-[#232323]">Product Video</h3>
            {videoUrl ? (
              <div className="relative w-full">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-60 object-cover rounded-[10px] border"
                />
              </div>
            ) : (
              <div className="border-2 border-gray-200 rounded-lg p-6 flex flex-col items-center h-[221px] bg-[#F5F5F5]">
                <img src={Video} alt="" className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-base fw6 text-[#9A9A9A]">
                  No video available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pass viewMode prop to all components to disable inputs */}
      <BasicInfo
        productData={productData}
        handleChange={handleChange}
        setProductData={setProductData}
        viewMode={true}
      />
      <RentalDetails
        productData={productData}
        handleChange={handleChange}
        setProductData={setProductData}
        viewMode={true}
      />
      <Location
        productData={productData}
        handleChange={handleChange}
        setProductData={setProductData}
        viewMode={true}
      />
      <SizeFit
        productData={productData}
        handleChange={handleChange}
        setProductData={setProductData}
        viewMode={true}
      />

      <Condition
        productData={productData}
        handleChange={handleChange}
        setProductData={setProductData}
        viewMode={true}
      />

      <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
        <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">
          Product Sizes & Quantities
        </h3>
        <p className="text-sm text-[#6C6C6C]">
          Available sizes and their quantities for this product.
        </p>
        
        {sizes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sizes.map((sizeData) => (
              <div
                key={sizeData.size}
                className="flex flex-col gap-2 p-4 border border-[#D9D9D9] rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#F77F00] rounded bg-[#F77F00] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <label className="text-sm font-medium text-[#232323]">
                    {sizeData.size}
                  </label>
                </div>
                
                <div className="mt-2">
                  <label className="block text-xs text-[#6C6C6C] mb-1">
                    Quantity
                  </label>
                  <div className="w-full p-2 text-sm text-[#121212] bg-white rounded-lg border border-[#D9D9D9]">
                    {sizeData.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#6C6C6C] italic">
            No sizes available for this product.
          </p>
        )}
      </div>

      {/* No action buttons in view mode */}
      <div className="bg-[#FFFFFF] px-6 py-6 flex justify-end gap-3">
        <Link
          to="/products"
          className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] rounded-lg hover:bg-[#F77F00] hover:text-white"
        >
          Back to Products
        </Link>
      </div>

      {/* Image Preview Gallery */}
      {isPreviewOpen && (
        <ImagePreviewGallery
          imageUrl={previewImage}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default ViewProduct;
