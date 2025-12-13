import React, { useState, useRef, useEffect } from "react";
import {
  Search as SearchIcon,
  Settings,
  Users,
  Star,
  MessageCircle,
  RefreshCw,
  X,
  Plus,
} from "lucide-react";
import CreateGroupModal from "../Components/modals/CreateGroupModal";
import { useGroups } from "../hooks/useGroups";
import LoadingSpinner from "../Components/common/LoadingSpinner";

const Groups = () => {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const searchRef = useRef(null);

  // Data Fetching
  const { data: groupsData, isLoading } = useGroups();
  const groups = groupsData || [];

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    };
    if (isSearchExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded]);

  // Filter chips
  const filterChips = [
    "All",
    "Design",
    "Development",
    "Data Science",
    "Marketing",
    "Product",
    "DevOps",
    "Content",
    "Photography",
    "Languages",
  ];

  // Experience levels (reused for group activity levels)
  const activityLevels = [
    { id: "low", label: "Low Activity", count: 12 },
    { id: "medium", label: "Medium Activity", count: 45 },
    { id: "high", label: "High Activity", count: 78 },
  ];

  // Group sizes
  const groupSizes = [
    { id: "small", label: "Small (1-50)", count: 23 },
    { id: "medium", label: "Medium (51-200)", count: 56 },
    { id: "large", label: "Large (200+)", count: 34 },
  ];

  // Group types
  const groupTypes = [
    { id: "open", label: "Open Groups" },
    { id: "private", label: "Private Groups" },
    { id: "invite", label: "Invite-Only" },
  ];

  // Ratings
  const ratings = [
    { id: "5star", label: "⭐⭐⭐⭐⭐ 5.0" },
    { id: "4star", label: "⭐⭐⭐⭐ 4.0+" },
    { id: "3star", label: "⭐⭐⭐ 3.0+" },
  ];

  // Close mobile filters on outside click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsMobileFiltersOpen(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">

      {/* Hero */}
      <section className="bg-white py-10 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold mb-2">Groups</h1>
          <p className="text-gray-600 mb-6">
            Join communities to collaborate, share knowledge, and find swap
            partners.
          </p>
          <p className="text-sm text-gray-500">
            Use the search bar below to find groups by topic or activity.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 bg-white py-4 border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-3 items-center">
            {/* Expandable Search Container */}
            <div ref={searchRef} className="relative flex items-center">
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${isSearchExpanded
                  ? "bg-gray-100"
                  : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {isSearchExpanded ? (
                  <X size={20} className="text-gray-600" />
                ) : (
                  <SearchIcon size={20} className="text-gray-600" />
                )}
              </button>
              <div
                className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-100 rounded-full border-2 border-transparent focus-within:border-gray-900 transition-all duration-300 overflow-hidden ${isSearchExpanded
                  ? "opacity-100 w-64 pl-10 pr-4 py-2.5"
                  : "opacity-0 w-0 p-0"
                  }`}
              >
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-sm placeholder:text-gray-500"
                  placeholder="Search groups by name or topic..."
                />
              </div>
            </div>

            <div
              className={`overflow-x-auto scrollbar-hide transition-all duration-300 ${isSearchExpanded ? "flex-1" : "flex-1"
                }`}
            >
              <div className="flex gap-2 min-w-max">
                {filterChips.map((chip, index) => (
                  <button
                    key={index}
                    className={`px-5 py-2 bg-gray-100 border-2 border-transparent rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors ${chip === "All"
                      ? "bg-gray-900 text-white border-gray-900"
                      : ""
                      }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors md:hidden"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Settings size={20} />
            </button>
            <select className="hidden md:block px-4 py-2 border-2 border-gray-200 rounded-full text-sm bg-white">
              <option>Relevance</option>
              <option>Most Active</option>
              <option>Highest Rated</option>
              <option>Newest</option>
              <option>Largest</option>
            </select>
          </div>
        </div>
      </section>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={handleBackdropClick}
        >
          <div
            className="absolute inset-0 bg-white translate-y-full transition-transform duration-300 ease-out"
            style={{ transform: "translateY(0)" }}
          >
            <div className="p-6 space-y-6 overflow-y-auto h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Activity Level */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
                  Activity Level
                </h3>
                {activityLevels.map((level) => (
                  <label
                    key={level.id}
                    className="flex items-center justify-between py-2 cursor-pointer block"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 h-4 w-4 text-gray-600 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-700">
                        {level.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({level.count})
                    </span>
                  </label>
                ))}
              </div>

              {/* Group Size */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
                  Group Size
                </h3>
                {groupSizes.map((size) => (
                  <label
                    key={size.id}
                    className="flex items-center justify-between py-2 cursor-pointer block"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 h-4 w-4 text-gray-600 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-700">
                        {size.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({size.count})
                    </span>
                  </label>
                ))}
              </div>

              {/* Group Type */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
                  Group Type
                </h3>
                {groupTypes.map((type) => (
                  <label
                    key={type.id}
                    className="flex items-center py-2 cursor-pointer block"
                  >
                    <input
                      type="checkbox"
                      className="mr-3 h-4 w-4 text-gray-600 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
                  Rating
                </h3>
                {ratings.map((rating) => (
                  <label
                    key={rating.id}
                    className="flex items-center py-2 cursor-pointer block"
                  >
                    <input
                      type="checkbox"
                      className="mr-3 h-4 w-4 text-gray-600 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">
                      {rating.label}
                    </span>
                  </label>
                ))}
              </div>

              <button
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                Clear All
              </button>
              <button
                className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar - Your Groups */}
        <aside className="hidden lg:block sticky top-32 self-start h-fit space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Users size={18} />
              Your Groups
            </h3>
            <div className="space-y-2">
              <button className="w-full py-2 px-3 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-between">
                React Devs{" "}
                <span className="text-xs text-gray-500">45 members</span>
              </button>
              <button className="w-full py-2 px-3 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-between">
                UX Circle{" "}
                <span className="text-xs text-gray-500">23 members</span>
              </button>
              <button className="w-full py-2 px-3 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-between">
                Data Nerds{" "}
                <span className="text-xs text-gray-500">67 members</span>
              </button>
            </div>
            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="w-full py-2.5 mt-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} className="inline mr-2" />
              Create Group
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="text-sm font-semibold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center py-3">
                <div className="text-xl font-semibold text-gray-900">8</div>
                <div className="text-xs text-gray-500">Joined</div>
              </div>
              <div className="text-center py-3">
                <div className="text-xl font-semibold text-gray-900">4.8</div>
                <div className="text-xs text-gray-500">Avg Rating</div>
              </div>
              <div className="text-center py-3">
                <div className="text-xl font-semibold text-gray-900">156</div>
                <div className="text-xs text-gray-500">Total Members</div>
              </div>
              <div className="text-center py-3">
                <div className="text-xl font-semibold text-gray-900">92%</div>
                <div className="text-xs text-gray-500">Engagement</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="space-y-8">
          {/* Featured Banner */}
          <div className="bg-gray-900 text-white p-8 rounded-xl grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <Users size={24} />
                Join the Conversation
              </h2>
              <p className="opacity-90">
                Discover active groups and start swapping skills today.
              </p>
            </div>
            <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors whitespace-nowrap">
              Browse All
            </button>
          </div>

          {/* Results Header */}
          <div className="flex justify-between items-center">
            <div className="text-2xl font-semibold">{groups.length} Groups Found</div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                  ? "bg-gray-900 text-white"
                  : "bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-900"
                  }`}
              >
                ▦
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                  ? "bg-gray-900 text-white"
                  : "bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-900"
                  }`}
              >
                ☰
              </button>
            </div>
          </div>

          {/* Groups Cards */}
          {groups.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-5"
                  : "space-y-4"
              }
            >
              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${viewMode === "list" ? "p-5 flex gap-5 items-start" : ""
                    }`}
                >
                  {/* Banner */}
                  <div className={`${group.bannerColor || 'bg-gray-200'} relative h-32`}>
                    <div
                      className={`absolute -bottom-10 left-5 w-20 h-20 rounded-full border-4 border-white flex items-center justify-center text-white text-2xl font-bold ${group.avatarColor || 'bg-gray-400'}`}
                    >
                      <Users size={32} />
                    </div>
                    <div className="absolute top-3 right-3 px-3 py-1 bg-white rounded-xl text-xs font-bold flex items-center gap-1">
                      <Star
                        size={12}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      {group.rating || 0}
                    </div>
                  </div>

                  <div
                    className={
                      viewMode === "list" ? "flex-1 min-w-0" : "pt-12 px-5 pb-5"
                    }
                  >
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold mb-1">{group.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {group.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <Users size={14} />
                        {group.memberCount || 0} members • {group.activity || 'New'} activity
                      </div>
                    </div>

                    {/* Skills/Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(group.skills || []).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex justify-around py-3 border-t border-gray-100 mb-4 text-center">
                      <div>
                        <div className="text-lg font-semibold">
                          {group.memberCount || 0}
                        </div>
                        <div className="text-xs uppercase text-gray-500">
                          Members
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {group.rating || 0}
                        </div>
                        <div className="text-xs uppercase text-gray-500">
                          Rating
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      className={`grid ${viewMode === "list"
                        ? "grid-cols-1 gap-2"
                        : "grid-cols-2 gap-2"
                        }`}
                    >
                      <button className="py-2.5 border-2 border-gray-200 rounded-lg text-sm font-medium hover:border-gray-900 transition-colors">
                        <MessageCircle size={16} className="inline mr-2" />
                        View
                      </button>
                      <button className="py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        <RefreshCw size={16} className="inline mr-2" />
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500 mb-4">No groups found</p>
              <button
                onClick={() => setShowCreateGroupModal(true)}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg"
              >
                Create First Group
              </button>
            </div>
          )}

          {/* Load More */}
          {groups.length > 5 && (
            <div className="text-center py-10">
              <button className="px-8 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Load More
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <CreateGroupModal
          isOpen={showCreateGroupModal}
          onClose={() => setShowCreateGroupModal(false)}
        />
      )}
    </div>
  );
};

export default Groups;
