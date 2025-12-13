import React from "react";
import {
  Search,
  UserPlus,
  MoreVertical,
  MessageSquare,
  Users,
} from "lucide-react";
import ConversationItem from "./ConversationItem";

const Sidebar = ({
  isOpen,
  isMobile,
  selectedChat,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  filters,
  filteredConversations,
  onSelectChat,
  onMarkAsRead,
  onNewChat,
  user,
}) => (
  <div
    className={`
      fixed md:static inset-0 z-30 w-full md:w-96 bg-white border-r border-gray-200 
      transform transition-transform duration-300 ease-in-out flex flex-col
      ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      ${selectedChat && isMobile ? "hidden" : "flex"}
    `}
  >
    <div className="flex-shrink-0 p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
            title="Start New Chat"
          >
            <UserPlus size={20} />
          </button>

          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors">
              <MoreVertical size={20} />
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block z-50">
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Mark all as read
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Archived Chats
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-black focus:bg-white text-gray-900 placeholder-gray-500 transition-all"
        />
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: "none" }}
      >
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0
              ${activeFilter === filter.id
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {filter.label}
            {filter.count > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-white bg-opacity-20 rounded">
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>

    <div className="flex-1 overflow-y-auto">
      {filteredConversations.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
          <p>No conversations match your filter.</p>
        </div>
      ) : (
        filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedChat === conversation.id}
            onClick={onSelectChat}
            onMarkAsRead={onMarkAsRead}
          />
        ))
      )}
    </div>

    <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
            {user.avatar}
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">{user.firstName ? `${user.firstName} ${user.lastName}` : (user.name || "User")}</div>
          <div className="text-sm text-gray-500 truncate">{user.role || "Member"}</div>
        </div>
        <div className="relative group">
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 flex-shrink-0 transition-colors">
            <MoreVertical size={20} />
          </button>
          {/* Dropdown Menu */}
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block overflow-hidden z-50">
            <div className="py-1">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                My Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                Settings
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Sidebar;
