// import React, { useState, useRef, useEffect } from "react";
// import { ChevronDown, Menu, Search } from "lucide-react";
// import profile from "../assets/SVG/img.svg";
// import bell from "../assets/SVG/bell.svg";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import DefaultProfile from "../assets/Images/rid_profile.jpg";

// const Header = ({ toggleSidebar }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const { user, notifications, markAsRead, markAllAsRead, logout } = useAuth();
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);
//   const profileRef = useRef(null);
//  const [profileDropdown, setProfileDropdown] = useState(false);


//   const toggleDropdown = () => setProfileDropdown(!profileDropdown);

//   const unreadCount = notifications.length;

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//        if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setProfileDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleNotificationClick = async (notification) => {
//     try {
//       await markAsRead(notification.id);
//       setShowDropdown(false);
//       if (notification.data?.url) {
//         navigate(notification.data.url);
//       }
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       await markAllAsRead();
//       setShowDropdown(false);
//     } catch (error) {
//       console.error("Error marking all notifications as read:", error);
//     }
//   };

//   const handleProfileClick = () => {
//     navigate("/settings");
//   };

//   return (
//     <header className="bg-white shadow-sm p-4 flex items-center justify-between w-full z-10 relative">
//       <button
//         className="md:hidden text-gray-700 focus:outline-none"
//         onClick={toggleSidebar}
//         aria-label="Toggle sidebar"
//       >
//         <Menu size={24} />
//       </button>


//       <div className="flex items-center gap-4 ml-auto">
//         <div className="relative" ref={dropdownRef}>
//           <button
//             className="relative text-gray-400 w-6 h-6"
//             onClick={() => setShowDropdown(!showDropdown)}
//             aria-label={`Notifications (${unreadCount} unread)`}
//             aria-expanded={showDropdown}
//           >
//             <img src={bell} alt="Notifications" className="w-full h-full" />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full">
//                 {unreadCount > 9 ? "9+" : unreadCount}
//             </span>
//           )}
//         </button>

//           {showDropdown && (
//             <div
//               className="absolute right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-20 animate-fadeIn"
//               role="menu"
//               aria-labelledby="notifications"
//             >
//               <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300">
//                 <span className="text-sm font-semibold text-gray-800">Notifications</span>
//                 {unreadCount > 0 && (
//                   <button
//                     onClick={handleMarkAllAsRead}
//                     className="text-xs font-medium text-orange-600 hover:text-orange-800"
//                     role="menuitem"
//                   >
//                     Mark all as read
//                   </button>
//                 )}
//               </div>
//               <div className="max-h-96 overflow-y-auto">
//                 {notifications.length > 0 ? (
//                   notifications.map((n) => (
//                     <div
//                       key={n.id}
//                       className={`px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${!n.read_at ? "bg-orange-50" : ""
//                         }`}
//                       onClick={() => handleNotificationClick(n)}
//                       role="menuitem"
//                       tabIndex={0}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ") {
//                           handleNotificationClick(n);
//                         }
//                       }}
//                     >
//                       <div className="flex items-start gap-2">
//                         {!n.read_at && (
//                           <span className="w-2 h-2 mt-1.5 bg-orange-500 rounded-full" aria-hidden="true"></span>
//                         )}
//                         <div className="flex-1">
//                           {n.data.title && (
//                             <strong className="text-gray-800 font-medium">{n.data.title}</strong>
//                           )}
//                           <p className="text-gray-600 mt-1">{n.data.message}</p>

//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-4 py-3 text-sm text-gray-500 text-center" role="alert">
//                     No notification
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="flex items-center gap-3 relative" ref={profileRef}>
//           <button
//             onClick={toggleDropdown}
//             className="flex items-center gap-2 focus:outline-none hover:bg-gray-50 p-2 rounded-lg transition-colors"
//           >
//             <img
//               src={user?.profile_photo || DefaultProfile}
//               alt="Profile"
//               className="w-12 h-12 rounded-[10px]"
//               // onError={(e) => { e.currentTarget.src = user?.profile_photo || DefaultProfile; }}
//             />
            
//             <span className="text-base font-medium text-left text-[#232323] hidden md:inline leading-[150%]">
//               {user?.name || user?.first_name + ' ' + user?.last_name || 'User'} <br />
//               <span className="text-xs font-medium text-[#9A9A9A] hidden md:inline leading-[150%]">
//                 {user?.email || 'user@example.com'}
//               </span>
//             </span>
//             <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${profileDropdown ? 'rotate-180' : ''}`} strokeWidth={2.5} />
//           </button>

//           {profileDropdown && (
//             <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
//               <button
//                 onClick={() => {
//                   navigate('/settings');
//                   setProfileDropdown(false);
//                 }}
//                 className="flex items-center w-full px-4 py-3 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6] transition-colors"
//               >
//                 <span>Settings</span>
//               </button>
//               <button
//                 onClick={async () => { 
//                   setProfileDropdown(false);
//                   try {
//                     await logout();
//                   } catch (error) {
//                     console.error('Logout failed:', error);
//                   }
//                 }}  
//                 className="flex items-center w-full px-4 py-3 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6] transition-colors border-t border-gray-100"
//               >
//                 <span>Logout</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, Search } from "lucide-react";
import bell from "../assets/SVG/bell.svg";
import DefaultProfile from "../assets/Images/rid_profile.jpg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const { user, notifications, markAsRead, markAllAsRead, logout } = useAuth();
  const navigate = useNavigate();
  const unreadCount = notifications.length;

  const toggleProfileDropdown = () => setProfileDropdown(!profileDropdown);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      await markAsRead(notification.id);
      setShowDropdown(false);
      if (notification.data?.url) navigate(notification.data.url);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setShowDropdown(false);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between w-full z-10 relative">
      {/* Sidebar toggle (mobile) */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={30} />
      </button>

   
      <div className="flex items-center gap-4 ml-auto">
       
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative w-6 h-6 text-gray-500 focus:outline-none"
            aria-label="Notifications"
          >
            <img src={bell} alt="Notifications" className="w-full h-full" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                <span className="text-sm font-semibold text-gray-800">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-orange-600 hover:text-orange-800"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`px-4 py-3 text-sm border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !n.read_at ? "bg-orange-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read_at && (
                          <span className="w-2 h-2 mt-1.5 bg-orange-500 rounded-full" />
                        )}
                        <div>
                          {n.data.title && (
                            <strong className="block text-gray-800">
                              {n.data.title}
                            </strong>
                          )}
                          <p className="text-gray-600">{n.data.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    No notification
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

       
        <div className="relative flex items-center gap-2" ref={profileRef}>
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center gap-2 focus:outline-none hover:bg-gray-50 p-1 rounded-lg transition-colors"
          >
            <img
              src={user?.profile_photo || DefaultProfile}
              alt="Profile"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
            />
            <span className="hidden md:block text-sm font-medium text-gray-800 text-left">
              {user?.name ||
                `${user?.first_name || ""} ${user?.last_name || ""}` ||
                "User"}
              <br />
              <span className="text-xs text-gray-500">
                {user?.email}
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform ${
                profileDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileDropdown && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <button
                onClick={() => {
                  navigate("/settings");
                  setProfileDropdown(false);
                }}
                className="block w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 text-left"
              >
                Settings
              </button>
              <button
                onClick={async () => {
                  setProfileDropdown(false);
                  try {
                    await logout();
                  } catch (e) {
                    console.error("Logout failed", e);
                  }
                }}
                className="block w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 text-left border-t border-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
