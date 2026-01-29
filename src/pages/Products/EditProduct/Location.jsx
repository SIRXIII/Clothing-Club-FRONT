import React, { useState, useEffect } from "react";
import Dropdown from "../../../components/Dropdown";
import QRCode from "qrcode";
import ImagePreviewGallery from "../../../components/ImagePreviewGallery";

const Location = ({ productData, handleChange, viewMode = false }) => {
  const [qrUrl, setQrUrl] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (productData.barcode) {
      generateQRCode(productData.barcode);
    }
  }, [productData.barcode]);

  const generateQRCode = async (barcodeValue) => {
    try {
      const qr = await QRCode.toDataURL(barcodeValue, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      setQrUrl(qr);
    } catch (err) {
      console.error("QR generation failed:", err);
    }
  };

  const handleAutoGenerate = async () => {
    const randomBarcode = Math.floor(
      100000000000 + Math.random() * 900000000000
    ).toString();

    handleChange({ target: { name: "barcode", value: randomBarcode } });
    await generateQRCode(randomBarcode);
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `${productData.barcode || "qr-code"}.png`;
    link.click();
  };

  return (
    <>
      <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
        <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">
          Location & Identification
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 leading-[150%] tracking-[-3%]">
       
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
                handleChange({ target: { name: "location", value: val } })
              }
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            />
            <label
              htmlFor="location"
              className="absolute text-sm ms-4 text-[#F77F00] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#F77F00]"
            >
              City / Location <span className="text-red-500">*</span>
            </label>
            {!productData.location && !viewMode && (
              <p className="text-xs text-[#F77F00] mt-1">⚠️ Required field</p>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              id="sku"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
          <div className="flex flex-col items-center justify-center gap-6">
            <span>QR Code</span>
            <img
              src={qrUrl || ""}
              alt="QR Code"
              className="w-25 h-25 bg-[#D9D9D9] rounded-lg object-contain"
            />
          </div>

          {!viewMode && (
            <div className="flex gap-3 pt-11">
              {!qrUrl ? (
                <button
                  onClick={handleAutoGenerate}
                  type="button"
                  className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]"
                >
                  Auto Generate
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    type="button"
                    className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]"
                  >
                    Preview
                  </button>
                  <button
                    onClick={handleDownload}
                    type="button"
                    className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]"
                  >
                    Download
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {isPreviewOpen && (
        <ImagePreviewGallery
          imageUrl={qrUrl}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </>
  );
};

export default Location;
