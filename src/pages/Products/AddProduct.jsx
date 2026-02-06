import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Upload from "../../assets/SVG/upload.svg";
import Video from "../../assets/SVG/video.svg";
import { FaTimes } from "react-icons/fa";
import API from "../../services/api";
import QRCode from "qrcode";
import Breadcrumb from "../../components/Breadcrumb";
import backward from "../../assets/SVG/backward.svg";
import { Link, useNavigate } from "react-router-dom";
import { handleApiError, showSuccess } from "../../utils/toastHelper";
import ImagePreviewGallery from "../../components/ImagePreviewGallery";


const Dropdown = ({
  label,
  options = [],
  multiple = false,
  value,
  onChange,
  triggerClass,
  dropdownClass,
}) => {
  const [open, setOpen] = useState(false);
  const [isOther, setIsOther] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleSelect = (opt) => {
    if (opt === "Other") {
      setIsOther(true);
      setOpen(false);
      onChange("");
      return;
    }

    if (multiple) {
      const newValue = value.includes(opt)
        ? value.filter((v) => v !== opt)
        : [...value, opt];
      onChange(newValue);
    } else {
      onChange(opt);
      setIsOther(false);
      setOpen(false);
    }
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomValue(val);
    onChange(val);
  };

  const displayValue = multiple ? value.join(", ") || label : value || label;

  return (
    <div
      className="relative"
      onMouseEnter={() => !isOther && setOpen(true)}
      onMouseLeave={() => !isOther && setOpen(false)}
    >
      <div
        className={`flex items-center border border-[#afaaaa89] rounded-lg px-4 py-4 bg-white ${triggerClass}`}
      >
        {isOther ? (
          <input
            type="text"
            value={customValue}
            onChange={handleCustomChange}
            onBlur={() => {
              if (!customValue) setIsOther(false);
            }}
            placeholder="Enter"
            className="flex-1 text-sm text-[#121212] bg-transparent focus:outline-none"
            autoFocus
          />
        ) : (
          <div
            className="flex items-center w-full cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="text-[#121212] text-sm flex-1">
              {displayValue || label}
            </span>
            <FiChevronDown
              className={`transform transition-transform duration-300 w-5 h-5 ${open ? "rotate-180" : "rotate-0"
                }`}
            />
          </div>
        )}
      </div>

      {open && (
        <div
          className={`absolute top-full left-0 bg-white border border-[#D9D9D9]
            rounded-lg shadow-md z-50 ${dropdownClass}`}
        >
          {options.map((opt, index) => (
            <span
              key={index}
              onClick={() => handleSelect(opt)}
              className={`block hover:bg-[#F77F00] hover:text-[#FFFFFF]
                p-1 rounded cursor-pointer text-[#121212] py-2 px-4 ${multiple && value.includes(opt)
                  ? "bg-[#f6a34b] text-white mb-1"
                  : ""
                }`}
            >
              {opt}
            </span>
          ))}

          <span
            onClick={() => handleSelect("Other")}
            className="block hover:bg-[#F77F00] hover:text-[#FFFFFF]
              p-1 rounded cursor-pointer text-[#121212] py-2 px-4"
          >
            Other
          </span>
        </div>
      )}
    </div>
  );
};

const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState();
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const navigate = useNavigate();
  
  // Image upload method states
  const [imageUploadMethod, setImageUploadMethod] = useState("local"); // "local" or "api"
  const [apiImageFile, setApiImageFile] = useState(null);
  const [apiProcessedImages, setApiProcessedImages] = useState([]);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Image preview states
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    productType: "", // Business, Vacation, Gala, Casual, Resort, Other
    clothCategory: "", // Tops, Bottoms, Dresses, Outerwear, etc
    gender: "Female", // For AI image processing
  });

  // Sizes state - array of {size: string, quantity: number}
  const [sizes, setSizes] = useState([]);
  
  // Available size options
  const availableSizes = ["XS", "Small", "Medium", "Large", "XL", "XXL", "XXXL"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Handle size checkbox toggle
  const handleSizeToggle = (size) => {
    setSizes((prev) => {
      const existing = prev.find((s) => s.size === size);
      if (existing) {
        // Remove if already exists
        return prev.filter((s) => s.size !== size);
      } else {
        // Add with default quantity 1
        return [...prev, { size, quantity: 1 }];
      }
    });
  };

  // Handle quantity change for a size
  const handleQuantityChange = (size, quantity) => {
    const numQuantity = parseInt(quantity) || 0;
    setSizes((prev) =>
      prev.map((s) => (s.size === size ? { ...s, quantity: numQuantity } : s))
    );
  };

  // Helper function to convert number to "$10/day" format for display
  const formatExtensionPrice = (value) => {
    if (!value) return "";
    // If already in "$10/day" format, return as is
    if (value.includes("$") && value.includes("/day")) {
      return value;
    }
    // If it's a number, convert to "$10/day" format
    const num = parseFloat(value);
    if (!isNaN(num)) {
      return `$${num}/day`;
    }
    return value;
  };

  // Helper function to get extension price display value
  const getExtensionPriceDisplayValue = () => {
    if (!productData.extensionPrice) return "";
    return formatExtensionPrice(productData.extensionPrice);
  };



  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle API Image Upload
  const handleApiImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setApiImageFile(file);
    setIsProcessingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('gender', productData.gender || 'Female'); // Use selected gender from product data
      
      // Call backend API endpoint
      const response = await API.post('/products/process-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Backend returns processed image URL and metadata
      if (response.data && response.data.success && response.data.processed_image) {
        // Use original_api_url for display as it's on CDN and publicly accessible
        const processedImage = {
          ...response.data.processed_image,
          displayUrl: response.data.processed_image.original_api_url || response.data.processed_image.url
        };
        setApiProcessedImages((prev) => [...prev, processedImage]);
        showSuccess('✨ Your image has been enhanced successfully!');
      }
    } catch (error) {
      handleApiError(error);
      console.error('Image processing failed:', error);
    } finally {
      setIsProcessingImage(false);
      e.target.value = null;
    }
  };

  const handleRemoveApiImage = (index) => {
    setApiProcessedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Image preview handlers
  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Clean extensionPrice - extract only number if it contains "$" or "/day"
      let cleanedExtensionPrice = '';
      if (productData.extensionPrice) {
        // Remove all non-numeric characters except decimal point
        const numericString = productData.extensionPrice.toString().replace(/[^0-9.]/g, '');
        const num = parseFloat(numericString);
        cleanedExtensionPrice = isNaN(num) ? '' : num.toString();
      }

      Object.entries(productData).forEach(([key, value]) => {
        // Override extensionPrice with cleaned numeric value
        if (key === 'extensionPrice') {
          formData.append(key, cleanedExtensionPrice);
        } else {
          formData.append(key, value ?? "");
        }
      });

      // Handle images based on upload method
      if (imageUploadMethod === "local" && images && images.length > 0) {
        images.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      } else if (imageUploadMethod === "api" && apiProcessedImages.length > 0) {
        // API images are already stored in backend, just send their paths
        apiProcessedImages.forEach((imageData, index) => {
          formData.append(`api_image_paths[${index}]`, imageData.path || imageData.url);
        });
      }

      if (videoFile) {
        formData.append("video_file", videoFile);
      } else if (videoUrl) {
        formData.append("video_url", videoUrl);
      }

      // Handle sizes - send as JSON array
      if (sizes.length > 0) {
        sizes.forEach((sizeData, index) => {
          formData.append(`sizes[${index}][size]`, sizeData.size);
          formData.append(`sizes[${index}][quantity]`, sizeData.quantity);
        });
      }

      const response = await API.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProductData({
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
      });

      setImages([]);
      setApiProcessedImages([]);
      setApiImageFile(null);
      setVideoFile(null);
      setVideoUrl("");
      setSizes([]);
      setErrors({});

      showSuccess("Product added successfully!");
      navigate('/products', { replace: true });
    } catch (error) {
      handleApiError(error, setErrors);
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = error.response.data.errors;
        setErrors(validationErrors);

        // ✅ Scroll smoothly to the first error field
        const firstErrorField = Object.keys(validationErrors)[0];
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            // Optional: add small delay before focusing for smoother animation
            setTimeout(() => {
              element.focus({ preventScroll: true });
            }, 500);
          }
        }
      }
    }
  };


  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl("");
    }
    e.target.value = null;
  };

  const handleUrlChange = (e) => {
    setVideoUrl(e.target.value);
    setVideoFile(null);
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoUrl("");
    const input = document.getElementById("productVideo");
    if (input) input.value = null;
  };

  // const generateBarcode = () => {
  //   const randomBarcode = Math.floor(
  //     100000000000 + Math.random() * 900000000000
  //   ).toString();
  //   setProductData((prev) => ({ ...prev, barcode: randomBarcode }));
  // };

  const generateBarcode = async () => {
    const randomBarcode = productData.barcode

    try {
      // Generate QR image (returns data URL)
      const qr = await QRCode.toDataURL(randomBarcode, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      setQrCodeUrl(qr);
    } catch (err) {
      console.error("QR generation failed:", err);
    }
  };



  return (
    <div className="flex flex-col gap-6 p-3">
      <div className="flex flex-col gap-4">
       
        <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Products", path: "/products" },

          { label: "Add Product" },
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
            Add Product
          </span>
        </div>


        <p className="ms-10 text-sm fw4 text-[#232323]">
          Fill in the details below to list your product for rental.
        </p>
      </div>

        
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        <div className="bg-white border-color rounded-lg p-4 flex flex-col gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="fw5 leading-[150%] tracking-[-3%]">
                  Product Image
                </h3>
                {/* Toggle between Local and Enhanced upload */}
                <div className="flex gap-2 text-xs fw6">
                  <button
                    type="button"
                    onClick={() => setImageUploadMethod("local")}
                    className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                      imageUploadMethod === "local"
                        ? "bg-[#F77F00] text-white border-[#F77F00]"
                        : "bg-[#FFF5EC] text-[#F77F00] border-transparent hover:bg-[#F77F00] hover:text-white"
                    }`}
                  >
                    Direct Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadMethod("api")}
                    className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                      imageUploadMethod === "api"
                        ? "bg-[#F77F00] text-white border-[#F77F00]"
                        : "bg-[#FFF5EC] text-[#F77F00] border-transparent hover:bg-[#F77F00] hover:text-white"
                    }`}
                  >
                    Enhanced Quality
                  </button>
                </div>
              </div>

              {imageUploadMethod === "local" ? (
                // LOCAL UPLOAD METHOD
                <div className="w-full">
                  <input
                    type="file"
                    id="productImages"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {images.length === 0 ? (
                    <div
                      className="border-2 border-dashed border-gray-300 justify-center gap-1 rounded-lg p-6 flex flex-col items-center cursor-pointer h-[326px]"
                      onClick={() =>
                        document.getElementById("productImages").click()
                      }
                    >
                      <img src={Upload} alt="" className="w-8 h-8 mb-2" />
                      <p className="text-base fw6 text-[#6C6C6C]">
                        Upload product images
                      </p>
                      <p className="text-xs text-[#9A9A9A]">
                        Only PNG, JPG allowed.
                      </p>
                      <p className="text-xs text-[#9A9A9A]">
                        500x500 pixels are recommended.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="relative w-full">
                        <img
                          src={URL.createObjectURL(images[0])}
                          alt="main product"
                          className="w-full h-60 object-cover rounded-[10px] border cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handleImageClick(URL.createObjectURL(images[0]))}
                        />
                        <button
                          type="button"
                          onClick={() => setImages([])}
                          className="absolute -top-2 -right-2 flex items-center justify-center w-[24px] h-[24px] rounded-[3.52px] bg-[#FEF2E6] text-[#F77F00] text-[12px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.15)]"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {images.slice(1).map((img, idx) => (
                          <div key={idx} className="relative w-24 h-24">
                            <img
                              src={URL.createObjectURL(img)}
                              alt="product"
                              className="w-full h-full object-cover rounded-[10px] border cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => handleImageClick(URL.createObjectURL(img))}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setImages(images.filter((_, i) => i !== idx + 1))
                              }
                              className="absolute -top-2 -right-2 flex items-center justify-center w-[20px] h-[20px] rounded-[3.52px] bg-[#FEF2E6] text-[#F77F00] text-[10px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.15)]"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded-[10px] text-2xl text-[#4F4F4F] hover:bg-gray-100"
                          onClick={() =>
                            document.getElementById("productImages").click()
                          }
                        >
                          +
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // ENHANCED UPLOAD METHOD
                <div className="w-full flex flex-col gap-4">
                  {/* Gender Selection for AI Model */}
                  <div className="flex flex-col gap-2 p-3 bg-[#FFF5EC] rounded-lg border border-[#F77F00]/20">
                    <span className="text-sm fw6 text-[#232323]">Choose Model Type:</span>
                    <div className="flex gap-2">
                      {["Female", "Male"].map((genderOption) => (
                        <button
                          key={genderOption}
                          type="button"
                          onClick={() => setProductData((prev) => ({ ...prev, gender: genderOption }))}
                          className={`flex-1 px-4 py-2 rounded-lg text-sm fw6 transition-all duration-200 ${
                            productData.gender === genderOption
                              ? "bg-[#F77F00] text-white shadow-sm"
                              : "bg-white text-[#F77F00] border border-[#F77F00]/30 hover:bg-[#F77F00]/10"
                          }`}
                        >
                          {genderOption} Model
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-[#9A9A9A]">
                      Selected: <span className="fw6 text-[#F77F00]">{productData.gender}</span> - This will be used for AI try-on visualization
                    </p>
                  </div>

                  <input
                    type="file"
                    id="apiProductImage"
                    accept="image/*"
                    className="hidden"
                    onChange={handleApiImageUpload}
                    disabled={isProcessingImage}
                  />
                  
                  {apiProcessedImages.length === 0 ? (
                    <div
                      className={`border-2 border-dashed border-gray-300 justify-center gap-1 rounded-lg p-6 flex flex-col items-center cursor-pointer h-[280px] ${
                        isProcessingImage ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() =>
                        !isProcessingImage && document.getElementById("apiProductImage").click()
                      }
                    >
                      <img src={Upload} alt="" className="w-8 h-8 mb-2" />
                      <p className="text-base fw6 text-[#6C6C6C]">
                        {isProcessingImage ? 'Enhancing your image...' : 'Want better quality images?'}
                      </p>
                      <p className="text-sm text-[#6C6C6C] mt-1 text-center px-4">
                        {isProcessingImage 
                          ? 'Please wait while we process your image' 
                          : 'Upload your product picture here and we\'ll enhance it for you!'}
                      </p>
                      <p className="text-xs text-[#9A9A9A] mt-2">
                        We'll optimize brightness, clarity & background
                      </p>
                      <p className="text-xs text-[#9A9A9A]">
                        Only PNG, JPG allowed
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="relative w-full">
                        <img
                          src={apiProcessedImages[0].displayUrl || apiProcessedImages[0].original_api_url || apiProcessedImages[0].url || apiProcessedImages[0]}
                          alt="processed product"
                          className="w-full h-60 object-cover rounded-[10px] border cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handleImageClick(apiProcessedImages[0].displayUrl || apiProcessedImages[0].original_api_url || apiProcessedImages[0].url || apiProcessedImages[0])}
                        />
                        <button
                          type="button"
                          onClick={() => setApiProcessedImages([])}
                          className="absolute -top-2 -right-2 flex items-center justify-center w-[24px] h-[24px] rounded-[3.52px] bg-[#FEF2E6] text-[#F77F00] text-[12px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.15)]"
                        >
                          <FaTimes size={12} />
                        </button>
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Enhanced ✨</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {apiProcessedImages.slice(1).map((img, idx) => (
                          <div key={idx} className="relative w-24 h-24">
                            <img
                              src={img.displayUrl || img.original_api_url || img.url || img}
                              alt="processed"
                              className="w-full h-full object-cover rounded-[10px] border cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => handleImageClick(img.displayUrl || img.original_api_url || img.url || img)}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveApiImage(idx + 1)}
                              className="absolute -top-2 -right-2 flex items-center justify-center w-[20px] h-[20px] rounded-[3.52px] bg-[#FEF2E6] text-[#F77F00] text-[10px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.15)]"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded-[10px] text-2xl text-[#4F4F4F] hover:bg-gray-100"
                          onClick={() =>
                            !isProcessingImage && document.getElementById("apiProductImage").click()
                          }
                          disabled={isProcessingImage}
                        >
                          {isProcessingImage ? '...' : '+'}
                        </button>
                      </div>
                    </>
                  )}

                  {isProcessingImage && (
                    <div className="flex flex-col items-center justify-center gap-2 p-4 bg-[#FFF5EC] rounded-lg border border-[#F77F00]/20">
                      <div className="flex items-center gap-2 text-sm text-[#F77F00]">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#F77F00] border-t-transparent"></div>
                        <span className="fw6">Enhancing your image...</span>
                      </div>
                      <p className="text-xs text-[#9A9A9A] text-center">
                        Optimizing quality, removing background & adjusting lighting
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-semibold">Product Video</h3>
              <div className="w-full">
                <input
                  type="file"
                  id="productVideo"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />

                {!videoFile ? (
                  <div
                    className="border-2 border-dashed border-gray-300 justify-center gap-1 rounded-lg p-6 flex flex-col items-center cursor-pointer h-[221px]"
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
                      src={videoFile}
                      controls
                      className="w-full h-60 object-cover rounded-[10px] border"
                    />
                    <button
                      onClick={handleRemoveVideo}
                      className="absolute -top-2 -right-2 flex items-center justify-center w-[24px] h-[24px] rounded-[3.52px] bg-[#FEF2E6] text-[#F77F00] text-[12px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.15)]"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 justify-center">
                <span className="text-sm text-[#6C6C6C]">OR</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  value={videoUrl}
                  onChange={handleUrlChange}
                  className="block p-4 pt-4 w-full text-sm text-[#939393] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="videoUrl"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform 
                  -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                  peer-placeholder-shown:top-1/2 peer-focus:top-2 
                  peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Add URL
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
          <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">
            Basic Information
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 leading-[150%] tracking-[-3%]">
            <div>
              <div className="relative">
                <input
                  type="text"
                  id="productname"
                  name="productname"
                  value={productData.productname}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="productname"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Product Name
                </label>
              </div>
              {errors.productname && (
                <p className="text-red-500 text-sm mt-1">{errors.productname[0]}</p>
              )}
            </div>


            <div>

              <div className="relative">
                <Dropdown
                  label=" Brand"
                  dropdownClass="w-full gap-4"
                  options={["Zara", "H&M", "Gucci", "Prada", "Uniqlo"]}
                  value={productData.brand}
                  onChange={(val) =>
                    setProductData((prev) => ({ ...prev, brand: val }))
                  }
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                />
                <label
                  htmlFor="brand"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Brand
                </label>
              </div>
              {errors.brand && (
                <p className="text-red-500 text-sm mt-1">{errors.brand[0]}</p>
              )}
            </div>
            <div>

              <div className="relative w-full">

                <input
                  type="text"
                  id="color"
                  name="color"
                  value={productData.color}
                  onChange={handleChange}
                  placeholder="Color"
                  className="block p-4 pr-14 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                />


                <label
                  htmlFor="color"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                  peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Color
                </label>

                {/* <input
                  type="color"
                  id="colorPicker"
                  name="color"
                  value={productData.color}
                  onChange={handleChange}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 cursor-pointer border border-[#D9D9D9] rounded-full bg-transparent"
                /> */}
              </div>
              {errors.color && (
                <p className="text-red-500 text-sm mt-1">{errors.color[0]}</p>
              )}
            </div>

            <div>

              <div className="relative">
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={productData.material}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="material"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Material
                </label>
              </div>
              {errors.material && (
                <p className="text-red-500 text-sm mt-1">{errors.material[0]}</p>
              )}
            </div>

            <div>
              <div className="relative w-full">
                <Dropdown
                  label=" Care Method"
                  dropdownClass="w-full gap-4"
                  options={[
                    "Dry Clean Only",
                    "Machine Wash",
                    "Hand Wash",
                    "Do Not Wash",
                  ]}
                  value={productData.careMethod}
                  onChange={(val) =>
                    setProductData((prev) => ({ ...prev, careMethod: val }))
                  }
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                />
                <label
                  htmlFor="careMethod"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Care Method
                </label>
              </div>
              {errors.careMethod && (
                <p className="text-red-500 text-sm mt-1">{errors.careMethod[0]}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={productData.weight}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="weight"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Weight
                </label>
              </div>
              {errors.weight && (
                <p className="text-red-500 text-sm mt-1">{errors.weight[0]}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
          <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">
            Rental Details
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 leading-[150%] tracking-[-3%]">

            <div>
              <div className="relative">
                <input
                  type="text"
                  id="basePrice"
                  name="basePrice"
                  value={productData.basePrice}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^\d*\.?\d*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  pattern="^\d+(\.\d{1,2})?$"
                  inputMode="decimal"
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="basePrice"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Base Price
                </label>
              </div>
              {errors.basePrice && (
                <p className="text-red-500 text-sm mt-1">{errors.basePrice[0]}</p>
              )}
            </div>

            <div>
              <div className="relative w-full">
                <Dropdown
                  label=" Extension Price"
                  dropdownClass="w-full gap-4"
                  options={[
                    "$10/day",
                    "$15/day",
                    "$18/day",
                    "$20/day",
                    "$25/day",
                  ]}
                  value={getExtensionPriceDisplayValue()}
                  onChange={(val) => {
                    // Extract number from "$10/day" format - extract only the number
                    let numericValue = '';
                    if (val) {
                      // Remove all non-numeric characters except decimal point
                      numericValue = val.replace(/[^0-9.]/g, '');
                      // Ensure it's a valid number
                      const num = parseFloat(numericValue);
                      numericValue = isNaN(num) ? '' : num.toString();
                    }
                    setProductData((prev) => ({ ...prev, extensionPrice: numericValue }));
                  }}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                />
                <label
                  htmlFor="extensionPrice"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Extension Price
                </label>
              </div>
              {errors.extensionPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.extensionPrice[0]}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type="price"
                  id="deposite"
                  name="deposite"
                  value={productData.deposite}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^\d*\.?\d*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  pattern="^\d+(\.\d{1,2})?$"
                  inputMode="decimal"
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="deposite"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#939393]"
                >
                  Deposite
                </label>
              </div>

              {errors.deposite && (
                <p className="text-red-500 text-sm mt-1">{errors.deposite[0]}</p>
              )}
            </div>

            <div>

              <div className="relative">
                <input
                  type="text"
                  id="lateFee"
                  name="lateFee"
                  value={productData.lateFee}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^\d*\.?\d*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  pattern="^\d+(\.\d{1,2})?$"
                  inputMode="decimal"
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="lateFee"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Late Fee
                </label>
              </div>

              {errors.lateFee && (
                <p className="text-red-500 text-sm mt-1">{errors.lateFee[0]}</p>
              )}
            </div>

            <div>

              <div className="relative">
                <Dropdown
                  label=" Replacement Value"
                  dropdownClass="w-full gap-4"
                  options={["100", "150", "200"]}
                  value={productData.replacementValue}
                  onChange={(val) =>
                    setProductData((prev) => ({ ...prev, replacementValue: val }))
                  }
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                />
                <label
                  htmlFor="replacementValue"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#939393]"
                >
                  Replacement Value
                </label>
              </div>

              {errors.replacementValue && (
                <p className="text-red-500 text-sm mt-1">{errors.replacementValue[0]}</p>
              )}
            </div>

            <div>

              <div className="relative">
                <input
                  type="text"
                  id="keepToBuyPrice"
                  name="keepToBuyPrice"
                  value={productData.keepToBuyPrice}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (/^\d*\.?\d*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    pattern="^\d+(\.\d{1,2})?$"
                  inputMode="decimal"
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="color"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Keep-to-Buy Price
                </label>
              </div>

              {errors.keepToBuyPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.keepToBuyPrice[0]}</p>
              )}
            </div>


          </div>

          <div className="grid  grid-cols-2 w-full gap-6 leading-[150%] tracking-[-3%]">
            <div>
              <div className="relative">
                <Dropdown
                  label="  Min Rental Period"
                  dropdownClass="w-full gap-4"
                  options={["1 day", "2 days", "4 days"]}
                  value={productData.minRentalPeriod}
                  onChange={(val) =>
                    setProductData((prev) => ({ ...prev, minRentalPeriod: val }))
                  }
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                />
                <label
                  htmlFor="minRentalPeriod"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Min Rental Period
                </label>
              </div>

              {errors.minRentalPeriod && (
                <p className="text-red-500 text-sm mt-1">{errors.minRentalPeriod[0]}</p>
              )}
            </div>

            <div>


              <div className="relative">
                <input
                  type="text"
                  id="maxRentalPeriod"
                  name="maxRentalPeriod"
                  value={productData.maxRentalPeriod}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="maxRentalPeriod"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Max Rental Period
                </label>
              </div>

              {errors.maxRentalPeriod && (
                <p className="text-red-500 text-sm mt-1">{errors.maxRentalPeriod[0]}</p>
              )}
            </div>

            <div>

              <div className="relative">
                <input
                  type="text"
                  id="prepBuffer"
                  name="prepBuffer"
                  value={productData.prepBuffer}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="color"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Prep Buffer
                </label>
              </div>


              {errors.prepBuffer && (
                <p className="text-red-500 text-sm mt-1">{errors.prepBuffer[0]}</p>
              )}
            </div>

            <div>

              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={productData.date}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="date"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Date
                </label>
              </div>

              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date[0]}</p>
              )}
            </div>

          </div>
        </div>

        <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
          <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">
            Location & Identification
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 leading-[150%] tracking-[-3%]">
            <div>
              <div className="relative">
                <Dropdown
                  label=" City / Location"
                  dropdownClass="w-full gap-4"
                  options={[
                    "Barcelona",
                    "Madrid",
                    "Paris",
                    "London",
                    "New York",
                    "Tokyo",
                    "Dubai",
                  ]}
                  value={productData.location}
                  onChange={(val) =>
                    setProductData((prev) => ({ ...prev, location: val }))
                  }
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                />
                <label
                  htmlFor="location"
                  className="absolute text-sm ms-4 text-[#F77F00] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#F77F00]"
                >
                  City / Location <span className="text-red-500">*</span>
                </label>
              </div>

              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location[0]}</p>
              )}
              {!productData.location && (
                <p className="text-xs text-[#F77F00] mt-1">⚠️ Required field</p>
              )}
            </div>

            <div>


              <div className="relative">
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={productData.sku}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="sku"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  SKU
                </label>
              </div>


              {errors.sku && (
                <p className="text-red-500 text-sm mt-1">{errors.sku[0]}</p>
              )}
            </div>

            <div>


              <div className="relative">
                <input
                  type="text"
                  id="barcode"
                  name="barcode"
                  value={productData.barcode}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="barcode"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Barcode
                </label>
              </div>


              {errors.barcode && (
                <p className="text-red-500 text-sm mt-1">{errors.barcode[0]}</p>
              )}
            </div>

          </div>
          <div className="flex items-center gap-4">

            <div className="flex flex-col items-center justify-center gap-6">
              <span>QR Code</span>
              {/* <img
                src=""
                alt=""
                className="w-25 h-25 bg-[#D9D9D9] rounded-lg"
              /> */}
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-25 h-25 border border-gray-300 rounded-lg shadow-sm"
                />
              ) : (
                <img
                  src=""
                  alt=""
                  className="w-25 h-25 bg-[#D9D9D9] rounded-lg"
                />
              )}
            </div>

            <div className="flex gap-3 pt-10">
              {productData.barcode && (
                <button
                  onClick={generateBarcode}
                  type="button"
                  className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] rounded-lg  hover:bg-[#F77F00] hover:text-[#FFFFFF]"
                >
                  Auto Generate
                </button>
              )}
              
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
          <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">
            Size And Fit
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="relative">
                <Dropdown
                  label=" Gender Category"
                  dropdownClass="w-full gap-4"
                  options={[
                    "Male",
                    "Female",
                    "Unisex",
                  ]}
                  value={productData.gender}
                  onChange={(val) =>
                    setProductData((prev) => ({ ...prev, gender: val }))
                  }
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                />
                <label
                  htmlFor="gender"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                  peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Gender Category
                </label>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender[0]}</p>
              )}
              <p className="text-xs text-[#9A9A9A] mt-2">
                Used for AI image processing model selection
              </p>
            </div>

            <div>
              <div className="relative">
                <Dropdown
                  label=" Fit Type"
                  dropdownClass="w-full gap-4"
                  options={[
                    "Slim Fit",
                    "Regular Fit",
                    "Relaxed Fit",
                    "Tailored Fit",
                    "Loose Fit",
                  ]}
                  value={productData.fitType}
                  onChange={(val) =>
                    setProductData((prev) => ({ ...prev, fitType: val }))
                  }
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                />
                <label
                  htmlFor="fitType"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                  peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Fit Type
                </label>
              </div>

              {errors.fitType && (
                <p className="text-red-500 text-sm mt-1">{errors.fitType[0]}</p>
              )}
            </div>
          </div>

          {/* <div> */}

          <div className="grid grid-cols-1  gap-6 leading-[150%] tracking-[-3%]">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="chest"
                    name="chest"
                    value={productData.chest}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (/^\d*\.?\d*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    pattern="^\d+(\.\d{1,2})?$"
                    inputMode="decimal"
                    className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="chest"
                    className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                  >
                    Chest
                  </label>
                </div>

                {errors.chest && (
                  <p className="text-red-500 text-sm mt-1">{errors.chest[0]}</p>
                )}
              </div>

              <div>


                <div className="relative">
                  <input
                    type="text"
                    id="lengthType"
                    name="lengthType"
                    value={productData.lengthType}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (/^\d*\.?\d*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    pattern="^\d+(\.\d{1,2})?$"
                    inputMode="decimal"
                    className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="lengthType"
                    className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                          peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                          peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                  >
                    Length Type
                  </label>
                </div>

                {errors.lengthType && (
                  <p className="text-red-500 text-sm mt-1">{errors.lengthType[0]}</p>
                )}
              </div>

              <div>


                <div className="relative">
                  <input
                    type="text"
                    id="sleeve"
                    name="sleeve"
                    value={productData.sleeve}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (/^\d*\.?\d*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    pattern="^\d+(\.\d{1,2})?$"
                    inputMode="decimal"
                    className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="sleeve"
                    className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                          peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                          peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                  >
                    Sleeve
                  </label>
                </div>

                {errors.sleeve && (
                  <p className="text-red-500 text-sm mt-1">{errors.sleeve[0]}</p>
                )}
              </div>

            </div>
          </div>

          <div className="flex gap-2 fw6 text-xs">
            {["cm", "inch"].map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => setProductData((prev) => ({ ...prev, unit }))}
                className={`px-4 py-3 rounded-lg border transition-all duration-200
                    ${productData.unit === unit
                    ? "bg-[#F77F00] text-white border-[#F77F00]"
                    : "bg-[#FFF5EC] text-[#F77F00] border-transparent hover:bg-[#F77F00] hover:text-white"
                  }`}
              >
                {unit}
              </button>
            ))}
          </div>

        </div>

        <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
          <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">
            Condition & Lifecycle
          </h3>
          <div className="grid grid-cols-2 gap-6 leading-[150%] tracking-[-3%]">
            <div>
              <div className="relative">
                <Dropdown
                  label=" Condition Grade"
                  dropdownClass="w-full gap-4"
                  options={["New", "Like New", "Good", "Fair"]}
                  value={productData.conditionGrade}
                  onChange={(val) =>
                    setProductData((prev) => ({ ...prev, conditionGrade: val }))
                  }
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                />
                <label
                  htmlFor="conditionGrade"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Condition Grade
                </label>
              </div>
              {errors.conditionGrade && (
                <p className="text-red-500 text-sm mt-1">{errors.conditionGrade[0]}</p>
              )}
            </div>
            <div>

              <div className="relative">
                <Dropdown
                  label=" Status"
                  dropdownClass="w-full gap-4"
                  options={[
                    "Available",
                    "Rented",
                    "Under Maintenance",
                    "Archived",
                  ]}
                  value={productData.status}
                  onChange={(val) =>
                    setProductData((prev) => ({ ...prev, status: val }))
                  }
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                />
                <label
                  htmlFor="status"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Status
                </label>
              </div>

              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
              )}
            </div>
          </div>
          
          {/* Product Type & Cloth Category Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="relative">
                <input
                  type="text"
                  id="productType"
                  name="productType"
                  value={productData.productType}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="productType"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Product Type <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.productType && (
                <p className="text-red-500 text-sm mt-1">{errors.productType[0]}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Dropdown
                  label=" Cloth Category"
                  dropdownClass="w-full gap-4"
                  options={["Business", "Vacation", "Gala", "Casual", "Resort", "Other"]}
                  value={productData.clothCategory}
                  onChange={(val) =>
                    setProductData((prev) => ({ ...prev, clothCategory: val }))
                  }
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                />
                <label
                  htmlFor="clothCategory"
                  className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Cloth Category <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.clothCategory && (
                <p className="text-red-500 text-sm mt-1">{errors.clothCategory[0]}</p>
              )}
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              id="note"
              name="note"
              value={productData.note}
              onChange={handleChange}
              className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
              placeholder=" "
            />
            <label
              htmlFor="note"
              className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                       peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
            >
              Note
            </label>
          </div>
        </div>

        {/* Sizes Section */}
        <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
          <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">
            Product Sizes & Quantities
          </h3>
          <p className="text-sm text-[#6C6C6C]">
            Select the sizes available for this product and specify the quantity for each size.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableSizes.map((size) => {
              const sizeData = sizes.find((s) => s.size === size);
              const isChecked = !!sizeData;
              
              return (
                <div
                  key={size}
                  className="flex flex-col gap-2 p-4 border border-[#D9D9D9] rounded-lg hover:border-[#F77F00] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`size-${size}`}
                      checked={isChecked}
                      onChange={() => handleSizeToggle(size)}
                      className="w-4 h-4 text-[#F77F00] border-[#D9D9D9] rounded focus:ring-[#F77F00] focus:ring-2"
                    />
                    <label
                      htmlFor={`size-${size}`}
                      className="text-sm font-medium text-[#232323] cursor-pointer"
                    >
                      {size}
                    </label>
                  </div>
                  
                  {isChecked && (
                    <div className="mt-2">
                      <label
                        htmlFor={`quantity-${size}`}
                        className="block text-xs text-[#6C6C6C] mb-1"
                      >
                        Quantity
                      </label>
                      <input
                        type="number"
                        id={`quantity-${size}`}
                        min="0"
                        value={sizeData.quantity}
                        onChange={(e) =>
                          handleQuantityChange(size, e.target.value)
                        }
                        className="w-full p-2 text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#F77F00]"
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {sizes.length === 0 && (
            <p className="text-sm text-[#6C6C6C] italic">
              No sizes selected. Please select at least one size for your product.
            </p>
          )}
        </div>

        <div className="relative bottom-0 left-0 right-0 bg-[#FFFFFF]  px-6 py-6 flex justify-end gap-3">
          <button className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00]  rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]">
            Cancel
          </button>
          <button className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00]  rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]">
            Save Product
          </button>
        </div>
      </form>

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

export default AddProduct;
