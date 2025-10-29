import React, { useState } from "react";
import SettingSidebar from "./SettingSidebar";
import PersonalInfo from "./PersonalInfo";
import Password from "./Password";
import TwoFA from "./2FA";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="flex flex-col p-4 gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-xs text-[#6C6C6C]">
        <p>Dashboard</p>
        <span className="text-[#9A9A9A]">/</span>
        <p className="text-[#F77F00]">Setting</p>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-[#232323]">Settings</h2>
        <p className="text-[#232323] text-sm">
          View and manage your profile and account settings.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-[320px]">
          <SettingSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div className="flex-1 w-full">
          {activeTab === "personal" && <PersonalInfo />}
          {activeTab === "password" && <Password />}
          {activeTab === "2fa" && <TwoFA />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
