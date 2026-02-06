import React from 'react'
import Dropdown from "../../../components/Dropdown";


const Condition = ({ productData, handleChange, viewMode = false }) => {
  return (
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
                value={productData.coditionGrade}
                onChange={(val) =>
                handleChange({ target: { name: "coditionGrade", value: val } })
                }
                disabled={viewMode}
                className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              />
              <label
                htmlFor="coditionGrade"
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
                handleChange({ target: { name: "status", value: val } })
                }
                disabled={viewMode}
                className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
          
          {/* Product Type & Cloth Category Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                id="productType"
                name="productType"
                value={productData.productType}
                onChange={handleChange}
                disabled={viewMode}
                className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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

            <div className="relative">
              <Dropdown
                label=" Cloth Category"
                dropdownClass="w-full gap-4"
                options={["Business", "Vacation", "Gala", "Casual", "Resort", "Other"]}
                value={productData.clothCategory}
                onChange={(val) =>
                  handleChange({ target: { name: "clothCategory", value: val } })
                }
                disabled={viewMode}
                className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-lg border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              />
              <label
                htmlFor="clothCategory"
                className="absolute text-sm ms-4 text-[#939393] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
              >
                Cloth Category <span className="text-red-500">*</span>
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
              disabled={viewMode}
              className={`block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
  )
}

export default Condition