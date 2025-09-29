import React from "react";
import WelcomeCard from "../components/Dashboard/WelcomeCard";
import Widgets from "../components/Dashboard/Widgets";
import Queue from "../components/Dashboard/Queue";
import AlertPlane from "../components/Dashboard/AlertPlane";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className=" flex flex-col top-[120px] left-[281px] gap-6">
      <WelcomeCard />

      <Widgets />

      <div className="flex gap-5">
        <button
          className="p-4 gap-2 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00]  rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]"
          onClick={() => navigate("/products/addproduct")}
        >
          Add New Product
        </button>
        <button className="p-4 gap-2 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00]  rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]"
         onClick={() => navigate("/orders")}
         >
          View Orders
        </button>
      </div>

      <Queue />

      <AlertPlane />
    </div>
  );
};

export default Dashboard;
