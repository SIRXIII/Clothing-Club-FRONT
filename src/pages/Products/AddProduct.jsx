import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Upload from "../../assets/SVG/upload.svg";
import Video from "../../assets/SVG/video.svg";
import { FaTimes } from "react-icons/fa";

// const Dropdown = ({
//   label,
//   options = [],
//   multiple = false,
//   value,
//   onChange,
//   triggerClass,
//   dropdownClass,
// }) => {
//   const [open, setOpen] = useState(false);

//   const handleSelect = (opt) => {
//     if (multiple) {
//       const newValue = value.includes(opt)
//         ? value.filter((v) => v !== opt)
//         : [...value, opt];
//       onChange(newValue);
//     } else {
//       onChange(opt);
//       setOpen(false);
//     }
//   };

//   const displayValue = multiple ? value.join(", ") || label : value || label;

//   return (
//     <div
//       className="relative"
//       onMouseEnter={() => setOpen(true)}
//       onMouseLeave={() => setOpen(false)}
//     >
//       <div
//         className={`flex items-center border border-[#afaaaa89] rounded-lg px-4 py-4 cursor-pointer bg-white ${triggerClass}`}
//         onClick={() => setOpen((prev) => !prev)}
//       >
//         <span className="text-[#121212] text-sm flex-1">{displayValue}</span>
//         <FiChevronDown
//           className={`transform transition-transform duration-300 w-5 h-5 ${
//             open ? "rotate-180" : "rotate-0"
//           }`}
//         />
//       </div>
//       {open && (
//         <div
//           className={`absolute top-full left-0 bg-white border border-[#D9D9D9]
//     rounded-lg shadow-md z-50 ${dropdownClass}`}
//         >
//           {options.map((opt, index) => (
//             <span
//               key={index}
//               onClick={() => handleSelect(opt)}
//               className={`block hover:bg-[#F77F00] hover:text-[#FFFFFF]
//         p-1 rounded cursor-pointer text-[#121212] py-2 px-4 ${
//           multiple && value.includes(opt) ? "bg-[#f6a34b] text-white mb-1" : ""
//         }`}
//             >
//               {opt}
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

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
              className={`transform transition-transform duration-300 w-5 h-5 ${
                open ? "rotate-180" : "rotate-0"
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
                p-1 rounded cursor-pointer text-[#121212] py-2 px-4 ${
                  multiple && value.includes(opt)
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleFileChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   if (files.length) {
  //     setImages((prev) => [...prev, ...files]);
  //   }
  // };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting product:", productData, images, videoUrl);
    // API call goes here
  };

  const handleVideoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setVideoFile(fileUrl);
      setVideoUrl("");
      e.target.value = null;
    }
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

  // function to auto-generate barcode
  const generateBarcode = () => {
    const randomBarcode = Math.floor(
      100000000000 + Math.random() * 900000000000
    ).toString(); // 12-digit random number
    setProductData((prev) => ({ ...prev, barcode: randomBarcode }));
  };

  return (
    <form>
      <div className="flex flex-col gap-6 p-3">
        <div className="flex flex-col gap-4">
          <div className="flex items-center text-xs gap-1">
            <p className="text-[#6C6C6C]">Dashboard</p>
            <span className="text-[#9A9A9A]">/</span>
            <p className="text-[#6C6C6C]">Product</p>
            <span className="text-[#9A9A9A]">/</span>
            <p className="text-[#F77F00]">Add Product</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl fw6 font-roboto text-[#232323]">
              Add Product
            </h2>
            <p className="text-[#232323] text-sm">
              Fill in the details below to list your product for rental.
            </p>
          </div>
        </div>

        <div className="bg-white border-color rounded-lg p-4 flex flex-col gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <h3 className="fw5 leading-[150%] tracking-[-3%] ">
                Product Image
              </h3>

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
                        className="w-full h-60 object-cover rounded-[10px] border"
                      />
                      <button
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
                            className="w-full h-full object-cover rounded-[10px] border"
                          />
                          <button
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

            <div className="relative">
              <input
                type="text"
                id="color"
                name="color"
                value={productData.color}
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
                Color
              </label>
            </div>

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
          </div>
        </div>

        <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
          <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">
            Rental Details
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 leading-[150%] tracking-[-3%]">
            <div className="relative">
              <input
                type="text"
                id="basePrice"
                name="basePrice"
                value={productData.basePrice}
                onChange={handleChange}
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
                value={productData.extensionPrice}
                onChange={(val) =>
                  setProductData((prev) => ({ ...prev, extensionPrice: val }))
                }
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

            <div className="relative">
              <input
                type="price"
                id="deposite"
                name="deposite"
                value={productData.deposite}
                onChange={handleChange}
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

            <div className="relative">
              <input
                type="text"
                id="lateFee"
                name="lateFee"
                value={productData.lateFee}
                onChange={handleChange}
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

            <div className="relative">
              <Dropdown
                label=" Replacement Value"
                dropdownClass="w-full gap-4"
                options={["$150/day", "$180/day", "$200/day"]}
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
            <div className="relative">
              <input
                type="text"
                id="keepToBuyPrice"
                name="keepToBuyPrice"
                value={productData.keepToBuyPrice}
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
                Keep-to-Buy Price
              </label>
            </div>
          </div>

          <div className="grid  grid-cols-2 w-full gap-6 leading-[150%] tracking-[-3%]">
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
          </div>
        </div>

        <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
          <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">
            Location & Identification
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 leading-[150%] tracking-[-3%]">
            <div className="relative">
              <Dropdown
                label=" Location"
                dropdownClass="w-full gap-4"
                options={[
                  "Barcelona Flagship",
                  "Madrid Central Store",
                  "Paris Boutique",
                  "London Showroom",
                ]}
                value={productData.location}
                onChange={(val) =>
                  setProductData((prev) => ({ ...prev, location: val }))
                }
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
              />
              <label
                htmlFor="location"
                className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
              >
                Location
              </label>
            </div>

            {/* <div className="relative">
              <Dropdown
                label=" SKU"
                dropdownClass="w-full gap-4"
                options={[
                  "SKU-001-ZARA-TSHIRT",
                  "SKU-002-HM-JEANS",
                  "SKU-003-GUCCI-BAG",
                ]}
                value={productData.sku}
                onChange={(val) =>
                  setProductData((prev) => ({ ...prev, sku: val }))
                }
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
              />
              <label
                htmlFor="sku"
                className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
              >
                SKU
              </label>
            </div> */}

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
          </div>
          <div className="flex items-center gap-4">
            {/* <div className="flex gap-3 pt-11">
              <button className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00]  rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]">
                Auto Generate
              </button>
            </div> */}
            <div className="flex flex-col items-center justify-center gap-6">
              <span>QR Code</span>
              <img
                src=""
                alt=""
                className="w-25 h-25 bg-[#D9D9D9] rounded-lg"
              />
            </div>

            <div className="flex gap-3 pt-10">
              <button
                onClick={generateBarcode}
                type="button"
                className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] rounded-lg  hover:bg-[#F77F00] hover:text-[#FFFFFF]"
              >
                Auto Generate
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
          <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">
            Size And Fit
          </h3>
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
          <div className="grid grid-cols-1  gap-6 leading-[150%] tracking-[-3%]">
            <div className="grid grid-cols-3 gap-6">
              <div className="relative">
                <input
                  type="text"
                  id="chest"
                  name="chest"
                  value={productData.chest}
                  onChange={handleChange}
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

              <div className="relative">
                <input
                  type="text"
                  id="lengthType"
                  name="lengthType"
                  value={productData.lengthType}
                  onChange={handleChange}
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

              <div className="relative">
                <input
                  type="text"
                  id="sleeve"
                  name="sleeve"
                  value={productData.sleeve}
                  onChange={handleChange}
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
            </div>
          </div>
          <div className="flex gap-2 fw6 text-xs ">
            <button className="px-4 py-3 bg-[#FFF5EC] text-[#F77F00] rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]">
              cm
            </button>
            <button className="px-4 py-3 bg-[#FFF5EC] text-[#F77F00] rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]">
              inch
            </button>
          </div>
        </div>

        <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
          <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">
            Condition & Lifecycle
          </h3>
          <div className="grid grid-cols-2 gap-6 leading-[150%] tracking-[-3%]">
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

        <div className="relative bottom-0 left-0 right-0 bg-[#FFFFFF]  px-6 py-6 flex justify-end gap-3">
          <button className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00]  rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]">
            Cancel
          </button>
          <button className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00]  rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]">
            Save Product
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddProduct;
