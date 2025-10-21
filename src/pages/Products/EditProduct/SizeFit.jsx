import React from "react";
import Dropdown from "../../../components/Dropdown";

const SizeFit = ({ productData, setProductData, handleChange, viewMode = false }) => {
  const handleUnitChange = (unit) => {
    if (!viewMode) {
      setProductData((prev) => ({
        ...prev,
        sizeUnit: unit,
      }));
    }
  };

  return (
    <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
      <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">Size And Fit</h3>

      <div className="relative">
        <Dropdown
          label="Fit Type"
          dropdownClass="w-full gap-4"
          options={[
            "Slim Fit",
            "Regular Fit",
            "Relaxed Fit",
            "Tailored Fit",
            "Loose Fit",
          ]}
          value={productData.fitType || ""}
          onChange={(val) =>
            setProductData((prev) => ({ ...prev, fitType: val }))
          }
          disabled={viewMode}
          className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        />
        <label
          htmlFor="fitType"
          className="absolute text-sm ms-4 text-[#939393] -translate-y-4 scale-75 top-2 z-10 bg-white px-2"
        >
          Fit Type
        </label>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {["chest", "lengthType", "sleeve"].map((field) => (
          <div className="relative" key={field}>
            <input
              type="text"
              id={field}
              name={field}
              value={productData[field] || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) handleChange(e);
              }}
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder=" "
            />
            <label
              htmlFor={field}
              className="absolute text-sm ms-4 text-[#939393] -translate-y-4 scale-75 top-2 z-10 bg-white px-2"
            >
              {field === "lengthType"
                ? "Length Type"
                : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
          </div>
        ))}
      </div>

      <div className="flex gap-2 fw6 text-xs">
        {["cm", "inch"].map((unit) => (
          <button
            key={unit}
            type="button"
            onClick={() => handleUnitChange(unit)}
            disabled={viewMode}
            className={`px-4 py-3 rounded-lg border transition-all duration-200 ${
              productData.sizeUnit === unit
                ? "bg-[#F77F00] text-white border-[#F77F00]"
                : viewMode
                ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                : "bg-[#FFF5EC] text-[#F77F00] border border-[#F77F00] hover:bg-[#F77F00] hover:text-white"
            }`}
          >
            {unit}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeFit;
