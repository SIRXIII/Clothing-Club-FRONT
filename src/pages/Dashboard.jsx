import React from "react";
import WelcomeCard from "../components/Dashboard/WelcomeCard";
import Widgets from "../components/Dashboard/Widgets";
import Queue from "../components/Dashboard/Queue";
import AlertPlane from "../components/Dashboard/AlertPlane";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 sm:p-0 md:p-8 w-full">
      {/* Welcome Card */}
      <WelcomeCard />

      {/* Widgets */}
      <Widgets />

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        <button
          className="p-3 sm:p-4 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] rounded-lg hover:bg-[#F77F00] hover:text-white transition"
          onClick={() => navigate("/products/addproduct")}
        >
          Add New Product
        </button>
        <button
          className="p-3 sm:p-4 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] rounded-lg hover:bg-[#F77F00] hover:text-white transition"
          onClick={() => navigate("/orders")}
        >
          View Orders
        </button>
      </div>

      {/* Queue */}
      <Queue />

      {/* Alerts */}
      <AlertPlane />
    </div>
  );
};

export default Dashboard;
