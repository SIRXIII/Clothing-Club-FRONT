import React, { useState } from "react";
import proImg from "../../../assets/Images/Pro_img.jpg";
import BasicInfo from "./BasicInfo";
import RentalDetails from "./RentalDetails";
import Location from "./Location";
import SizeFit from "./SizeFit";
import Condition from "./Condition";
import Availability from "./Availability";

const EditProduct = () => {
  const [images, setImages] = useState([proImg, proImg, proImg]);
  const [mainImage, setMainImage] = useState(proImg);
  const [videoUrl, setVideoUrl] = useState(proImg);
  const [productData, setProductData] = useState({
    productname: "Silk Kimono",
    brand: "Zara",
    color: "#C84B31 (Burnt Red)",
    material: "100% Silk",
    careMethod: "Dry Clean Only",
    weight: "0.8 kg",
    url: "",
    basePrice: "$20/day",
    extensionPrice: "$15/day",
    deposite: "$50",
    lateFee: "$10/day",
    replacementValue: "$180",
    keepToBuyPrice: "$140",
    minRentalPeriod: "1 day",
    maxRentalPeriod: "14 days",
    prepBuffer: "2 hours",
    date: "1 Feb - 4 Feb 2026",
    location: "Barcelona Flagship",
    sku: "SKU-2031",
    barcode: "0025926331",
    fitType: "loose",
    chest: "88cm",
    lengthType: "120cm",
    sleeve: "60cm",
    coditionGrade: "New",
    status: "In Circulation",
    note: "0025926331",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form>
      <div className="flex flex-col gap-6 p-3">
        <div className="flex flex-col gap-4">
          <div className="flex items-center text-xs gap-1 leading-[150%] tracking-[-3%]">
            <p className="text-[#6C6C6C]">Dashboard</p>
            <span className="text-[#9A9A9A]">/</span>
            <p className="text-[#6C6C6C]">Product</p>
            <span className="text-[#9A9A9A]">/</span>
            <p className="text-[#F77F00]">Edit Product</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl fw6 font-roboto text-[#232323] leading-[140%] tracking-[-3%]">
              Edit Product
            </h2>
            <p className="text-[#232323] text-sm leading-[150%] tracking-[-3%]">
              Make changes to your product information and ensure it's
              rental-ready.
            </p>
          </div>
        </div>

        <div className="bg-white border-color rounded-lg p-4 flex flex-col gap-6 leading-[150%] tracking-[-3%]">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <h3 className="fw5 text-[16px] text-[#232323] leading-[150%] tracking-[-3%] ">
                Product Image
              </h3>
              <img
                src={mainImage}
                alt="main"
                className="w-full h-60 object-cover rounded-lg border-color"
              />
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24">
                    <img
                      src={img}
                      alt="product"
                      className="w-full h-full object-cover rounded-[10px] border-color"
                    />
                    <button
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== idx))
                      }
                      className="absolute -top-[-6px] -right-[-6px] flex items-center justify-center
                   w-[18px] h-[18px] rounded-[3.52px] bg-[#FEF2E6] text-[#F77F00] text-[10px] 
                   shadow-[0px_2.4px_2.4px_0px_rgba(0,0,0,0.15)]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-[#D9D9D9] rounded-[10px] text-2xl text-[#4F4F4F] hover:bg-gray-100">
                  +
                </button>
              </div>
            </div>

            {/* <div className="flex flex-col gap-4">
              <h3 className="fw5 text-[16px] text-[#232323] leading-[150%] tracking-[-3%]">
                Product Video
              </h3>
              <div className="relative rounded-lg overflow-hidden">
                {videoUrl ? (
                  <>
                    <video
                      src={videoUrl}
                      controls
                      className="w-full rounded-lg object-cover"
                    />
                    <button
                      onClick={() => setVideoUrl("")}
                      className="absolute top-2 right-2 flex items-center justify-center
                     w-[18px] h-[18px] rounded-[3.52px] bg-[#FEF2E6] 
                     text-[#F77F00] text-[10px] 
                     shadow-[0px_2.4px_2.4px_0px_rgba(0,0,0,0.15)]"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full h-40 border border-dashed rounded-lg text-gray-400">
                    No video uploaded
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className="text-sm text-[#6C6C6C] ">OR</span>
              </div>
             <div className="flex flex-col align-bottom">
               <div className="relative">
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent 
                 rounded-xl border border-[#D9D9D9] 
                 focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="videoUrl"
                  className="absolute text-sm ms-4 text-gray-500 duration-300 transform 
                 -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Add URL
                </label>
              </div>
             </div>
            </div> */}

            <div className="flex flex-col gap-6">
              <h3 className="fw5 text-[16px] text-[#232323] leading-[150%] tracking-[-3%]">
                Product Video
              </h3>

              {/* Video Preview */}
              {videoUrl && (
                <div className="relative rounded-lg overflow-hidden">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setVideoUrl("")}
                    className="absolute top-2 right-2 flex items-center justify-center
        w-[18px] h-[18px] rounded-[3.52px] bg-[#FEF2E6] 
        text-[#F77F00] text-[10px] 
        shadow-[0px_2.4px_2.4px_0px_rgba(0,0,0,0.15)]"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-[#D9D9D9]" />
                <span className="text-sm text-gray-500">OR</span>
                <div className="flex-1 h-px bg-[#D9D9D9]" />
              </div>

              {/* URL Input */}
              <div className="relative">
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={videoUrl && videoUrl.startsWith("blob:")} // disable if uploaded file is being previewed
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder=" "
                />
                <label
                  htmlFor="videoUrl"
                  className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
                >
                  Add URL
                </label>
              </div>
            </div>
          </div>
        </div>

        <BasicInfo productData={productData} handleChange={handleChange} />

        <RentalDetails productData={productData} handleChange={handleChange} />

        <Location productData={productData} handleChange={handleChange} />

        <SizeFit productData={productData} handleChange={handleChange} />

        <Condition productData={productData} handleChange={handleChange} />

        {/* <Availability productData={productData} handleChange={handleChange} /> */}

        {/* <DemoItem label="Controlled calendar">
          <DateCalendar
            value={calendarValue}
            onChange={(newValue) => setCalendarValue(newValue)}
          />
        </DemoItem> */}

        <div className="relative bottom-0 left-0 right-0 bg-[#FFFFFF]  px-6 py-6 flex justify-end gap-3 ">
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

export default EditProduct;
