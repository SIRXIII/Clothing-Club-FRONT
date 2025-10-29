import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu } from "lucide-react";
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
    <header className="bg-white shadow-sm px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between w-full z-10 relative">
      {/* Sidebar toggle (mobile) */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={26} />
      </button>

      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative w-6 h-6 text-gray-500 focus:outline-none"
            aria-label="Notifications"
          >
            <img src={bell} alt="Notifications" className="w-full h-full" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-orange-500 rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-64 sm:w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-fadeIn
              max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200">
                <span className="text-sm font-semibold text-gray-800">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-orange-600 hover:text-orange-800"
                  >
                    Mark all
                  </button>
                )}
              </div>
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`px-3 py-2 text-sm border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
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
                        <p className="text-gray-600 text-xs sm:text-sm break-words">
                          {n.data.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No notifications
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative flex items-center gap-2" ref={profileRef}>
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center gap-1 sm:gap-2 focus:outline-none hover:bg-gray-50 p-1 rounded-lg transition-colors"
          >
            <img
              src={user?.profile_photo || DefaultProfile}
              alt="Profile"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover"
            />
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-sm font-medium text-gray-800 truncate max-w-[100px] sm:max-w-[150px]">
                {user?.name ||
                  `${user?.first_name || ""} ${user?.last_name || ""}` ||
                  "User"}
              </span>
              <span className="text-[11px] text-gray-500 truncate max-w-[100px] sm:max-w-[150px]">
                {user?.email}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform ${
                profileDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {profileDropdown && (
            <div className="absolute right-0 top-full mt-1 w-40 sm:w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-fadeIn">
              <button
                onClick={() => {
                  navigate("/settings");
                  setProfileDropdown(false);
                }}
                className="block w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 text-left"
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
                className="block w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 text-left border-t border-gray-100"
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
