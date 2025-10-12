import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

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

export default Dropdown;
