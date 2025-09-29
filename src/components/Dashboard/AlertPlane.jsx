import React from "react";
import AlertData from "../../data/AlertData";
const AlertPlane = () => {
  return (
    <div className="flex flex-col border-color rounded-lg p-6 gap-6">
      <h3 className="text-lg fw4 font-roboto gap-[214px]">Alerts Panel</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {AlertData.map((item) => (
          <div
            key={item.id}
            className="flex flex-col p-4 rounded-lg border border-gray-200 bg-white gap-4"
          >
            <div className="flex justify-between items-start">
              <h6 className="text-md text-[#202020] font-roboto fw5 flex items-center gap-4 leading-[28px] tracking-[-1%]">
                <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                {item.label}
              </h6>
            </div>
            <div className="flex flex-col leading-[150%] fw5 tracking-[-3%] gap-2">
              <p className="text-sm  text-[#232323] ">{item.value}</p>
              <p className={`text-xs ${item.descriptionColor} `}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPlane;
