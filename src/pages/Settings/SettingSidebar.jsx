import React from "react";
import { FiChevronRight } from "react-icons/fi";
import pro from "../../assets/SVG/pro.svg";
import prowhite from "../../assets/SVG/prowhite.svg";
import password from "../../assets/SVG/password.svg";
import passwordwhite from "../../assets/SVG/passwordwhite.svg";
import FA from "../../assets/SVG/FA.svg";
import FAwhite from "../../assets/SVG/FAwhite.svg";

const paymentIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const SettingSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "personal", label: "Personal Information", icon: pro, iconActive: prowhite },
    { id: "password", label: "Password", icon: password, iconActive: passwordwhite },
    { id: "2fa", label: "2FA Verification", icon: FA, iconActive: FAwhite },
    { id: "payments", label: "Payments Setup", icon: null, iconActive: null },
  ];

  return (
    <div className="flex flex-col border border-[#00000033] rounded-lg bg-white p-4 sm:p-6 gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center justify-between w-full p-3 sm:p-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === tab.id
              ? "bg-[#F77F00] text-white"
              : "text-[#232323] hover:bg-[#F77F00]/80 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            {tab.icon ? (
              <img
                src={activeTab === tab.id ? tab.iconActive : tab.icon}
                alt={tab.label}
                className="w-4 h-4"
              />
            ) : (
              <span className="w-4 h-4 flex items-center justify-center">{paymentIcon}</span>
            )}
            <span>{tab.label}</span>
          </div>
          <FiChevronRight className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};

export default SettingSidebar;
