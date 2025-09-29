import React from "react";
import Dropdown from "../../../components/Dropdown";

const BasicInfo = ({ productData, handleChange }) => {
  return (
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
                  handleChange({ target: { name: "brand", value: val } })
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
                handleChange({ target: { name: "careMethod", value: val } })
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
  );
};

export default BasicInfo;
