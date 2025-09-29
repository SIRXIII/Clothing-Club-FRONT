import React from "react";
import Dropdown from "../../../components/Dropdown";

const SizeFit = ({ productData, handleChange }) => {
  return (
    <div className="flex flex-col bg-[#FFFFFF] border-color rounded-lg p-6 gap-6">
      <h3 className="fw6 text-lg leading-[150%] tracking-[-3%]">
        Size And Fit
      </h3>
      <div className="relative">
        <Dropdown
          label=" Fit Type"
          dropdownClass="w-full gap-4"
          options={["Zara", "H&M", "Gucci", "Prada", "Uniqlo"]}
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
  );
};

export default SizeFit;
