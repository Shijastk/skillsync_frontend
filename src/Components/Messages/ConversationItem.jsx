import React from "react";
import { STATUS_COLORS, SWAP_STATUS_COLORS } from "../../data/constants";

const ConversationItem = ({
  conversation,
  isSelected,
  onClick,
  onMarkAsRead,
}) => {
  const {
    id,
    name,
    avatar,
    role,
    unread,
    lastMessage,
    timestamp,
    online,
    status,
    swapDetails,
  } = conversation;


  return (
    <div
      onClick={() => {
        onClick(id);
        onMarkAsRead(id);
      }}
      className={`
        p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50
        ${isSelected ? "bg-gray-50 border-l-4 border-l-black" : ""}
      `}
    >
      <div className="flex gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
            {avatar && (avatar.startsWith('http://') || avatar.startsWith('https://')) ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails to load, show initials instead
                  e.target.style.display = 'none';
                  e.target.parentElement.textContent = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
                }}
              />
            ) : (
              // Show initials (first letters of name)
              name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || avatar || '?'
            )}
          </div>
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 ${STATUS_COLORS[status]} border-2 border-white rounded-full`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
              {online && (
                <span className="text-xs text-green-600 font-medium flex-shrink-0">
                  • Online
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {timestamp}
              </span>
              {unread > 0 && (
                <span className="w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 truncate mb-2">{lastMessage}</p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${SWAP_STATUS_COLORS[swapDetails.status]
                  }`}
              >
                {swapDetails.status === 'pending'
                  ? (swapDetails.isIncomingRequest ? 'Incoming Request' : 'Pending Approval')
                  : swapDetails.status}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {swapDetails.skillToLearn}
              </span>
            </div>
            {unread > 0 && (
              <span className="px-2 py-0.5 bg-black text-white text-xs font-medium rounded-full min-w-[20px] text-center flex-shrink-0">
                {unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
