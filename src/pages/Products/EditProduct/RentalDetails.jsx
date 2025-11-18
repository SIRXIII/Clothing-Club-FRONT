import React from "react";
import Dropdown from "../../../components/Dropdown";

const RentalDetails = ({ productData, handleChange, viewMode = false }) => {
  return (
    // <form>
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
              onChange={(e) => {
                    const value = e.target.value;

                    if (/^\d*\.?\d*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  pattern="^\d+(\.\d{1,2})?$"
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
              options={["$10/day", "$15/day", "$18/day", "$20/day", "$25/day"]}
              value={productData.extensionPrice ? (productData.extensionPrice.includes("$") ? productData.extensionPrice : `$${productData.extensionPrice}/day`) : ""}
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
                handleChange({ target: { name: "extensionPrice", value: numericValue } });
              }}
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
               onChange={(e) => {
                    const value = e.target.value;

                    if (/^\d*\.?\d*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
              onChange={(e) => {
                    const value = e.target.value;

                    if (/^\d*\.?\d*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  pattern="^\d+(\.\d{1,2})?$"
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
              options={["100", "150", "200"]}
              value={productData.replacementValue}
              onChange={(val) =>
                handleChange({target: { name: "replacementValue", value: val },})
              }
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
               onChange={(e) => {
                    const value = e.target.value;

                    if (/^\d*\.?\d*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  pattern="^\d+(\.\d{1,2})?$"
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
                handleChange({
                  target: { name: "minRentalPeriod", value: val },
                })
              }
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
    // </form>  
  );
};

export default RentalDetails;
