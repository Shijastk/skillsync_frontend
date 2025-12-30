import {
  Menu,
  X,
  Bell,
  Plus,
  Search,
  User,
  Settings,
  LogOut,
  Wallet,
  RefreshCw,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import CreateGroupModal from './modals/CreateGroupModal';

const Navbar = () => {
  const location = useLocation();
  const { pathname } = useLocation();
  const firstPath = pathname.split("/")[1];
  const { user, logout } = useAuthContext();
  const { data: notificationsData } = useNotifications();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(firstPath);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const avatarRef = useRef(null);
  const notifRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const notifications = notificationsData || [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Sync activeNav with location pathname
  useEffect(() => {
    const path = pathname.split("/")[1] || "";
    setActiveNav(path);
  }, [pathname]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setAvatarOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setAvatarOpen(false);
    }, 200);
  };

  const navItems = [
    { id: "home", label: "Feed" },
    { id: "discover", label: "Discover" },
    { id: "groups", label: "Groups" },
    { id: "messages", label: "Messages" },
    { id: "community", label: "Community" },
    { id: "schedule", label: "Schedule" },
  ];



  const userInitials = (user?.firstName?.[0] || '') + (user?.lastName?.[0] || 'U');

  return (
    <>
      <nav className="sticky top-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link to="/home" className="text-2xl font-bold text-gray-900">
              SkillSwap
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/${item.id}`}
                  onClick={() => setActiveNav(item.id)}
                  className={`text-sm font-medium transition-colors ${activeNav === item.id
                    ? "text-gray-900 underline underline-offset-4 decoration-2"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search (Desktop) */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search skills, people..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <Search size={22} />
            </button>

            {/* New Post Button (Desktop) */}
            <Link to="/community" className="hidden md:flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all active:scale-[0.98]">
              <Plus size={18} />
              New Post
            </Link>

            {/* Notification */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Bell size={22} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border border-gray-200 p-0 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                    <span className="text-xs text-gray-500">
                      You have {notifications.length} unread
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <p className="text-sm text-gray-800">{notif.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notif.time}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 text-center border-t border-gray-100">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => navigate("/profile")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                id="user-menu-button"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-gray-800 to-black text-white rounded-full flex items-center justify-center text-sm font-semibold uppercase">
                  {userInitials}
                </div>
              </button>

              {avatarOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl border border-gray-200 p-2 z-50"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="p-3 border-b border-gray-100">
                    <div className="font-semibold text-gray-900 truncate">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </div>
                  </div>

                  <div className="py-2">
                    {[
                      { icon: <User size={16} />, label: "Profile", link: "/profile" },
                      { icon: <Wallet size={16} />, label: "Wallet", link: "/wallet" },
                      { icon: <RefreshCw size={16} />, label: "My Swaps", link: "/my-swaps" },
                    ].map((item) => (
                      <Link
                        to={item.link}
                        key={item.label}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden px-4 py-3 border-t border-gray-200 bg-white">
            <div className="flex items-center relative">
              <Search className="absolute left-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search skills, people, topics..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-black"
                autoFocus
              />
              <button
                onClick={() => setShowMobileSearch(false)}
                className="absolute right-3 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/${item.id}`}
                  onClick={() => {
                    setActiveNav(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${activeNav === item.id
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Floating Action Button */}
      {/* Mobile Speed Dial FAB */}
      <div className="md:hidden fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {activeNav === 'groups' && (
          <button
            onClick={() => setShowCreateGroupModal(true)}
            className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all"
          >
            <Plus size={26} />
          </button>
        )}

        {/* Default FAB behavior (hide on groups and messages) */}
        {activeNav !== 'groups' && activeNav !== 'messages' && (
          <Link to="/community" className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all">
            <Plus size={26} />
          </Link>
        )}
      </div>

      {/* Global Modals */}
      {showCreateGroupModal && (
        <CreateGroupModal
          isOpen={showCreateGroupModal}
          onClose={() => setShowCreateGroupModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;
