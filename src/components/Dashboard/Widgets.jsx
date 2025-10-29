// import React from "react";
// import { useWidgets } from "../../hooks/useDashboard";

// const Widgets = () => {
//   const { data: widgetData, isLoading, error } = useWidgets();

//   if (isLoading) return <p>Loading States...</p>;
//   if (error) return <p>Error loading States</p>;

//   const topWidgets = widgetData.slice(0, 3);
//   const bottomWidgets = widgetData.slice(3);

//   return (
//     <div className="flex flex-col gap-6">
    
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-6 h-[130px]">
//         {topWidgets.map((item, index) => (
//           <div
//             key={index}
//             className="p-6 rounded-lg border border-gray-200 bg-white"
//           >
//             <h6 className="text-xl leading-[120%] tracking-[-4%] mb-5 text-gray-500 font-roboto">
//               {item.label}
//             </h6>
//             <h2 className="text-2xl font-semibold leading-[140%] tracking-[-3%] text-black">
//               {item.value}
//             </h2>
//           </div>
//         ))}
//       </div>

//       {bottomWidgets.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[130px]">
//           {bottomWidgets.map((item, index) => (
//             <div
//               key={index}
//               className="md:col-span-6 p-6 rounded-lg border border-gray-200 bg-white"
//             >
//               <h6 className="text-xl leading-[120%] tracking-[-4%] mb-5 text-gray-500 font-roboto">
//                 {item.label}
//               </h6>
//               <h2 className="text-2xl font-semibold leading-[140%] tracking-[-3%] text-black">
//                 {item.value}
//               </h2>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Widgets;

import React from "react";
import { useWidgets } from "../../hooks/useDashboard";

const Widgets = () => {
  const { data: widgetData, isLoading, error } = useWidgets();

  if (isLoading) return <p>Loading States...</p>;
  if (error) return <p>Error loading States</p>;

  const topWidgets = widgetData.slice(0, 3);
  const bottomWidgets = widgetData.slice(3);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {topWidgets.map((item, index) => (
          <div
            key={index}
            className="p-4 sm:p-6 rounded-lg border border-gray-200 bg-white text-center sm:text-left"
          >
            <h6 className="text-base sm:text-xl text-gray-500 mb-3">{item.label}</h6>
            <h2 className="text-xl sm:text-2xl font-semibold text-black">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Bottom Widgets */}
      {bottomWidgets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {bottomWidgets.map((item, index) => (
            <div
              key={index}
              className="p-4 sm:p-6 rounded-lg border border-gray-200 bg-white text-center sm:text-left"
            >
              <h6 className="text-base sm:text-xl text-gray-500 mb-3">{item.label}</h6>
              <h2 className="text-xl sm:text-2xl font-semibold text-black">{item.value}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Widgets;
