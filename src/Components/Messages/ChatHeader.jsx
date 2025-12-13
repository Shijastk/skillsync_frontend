import React from "react";
import {
  Phone,
  Video,
  Info,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { STATUS_COLORS } from "../../data/constants";

const ChatHeader = ({
  conversation,
  isMobile,
  onBack,
  onToggleUserInfo,
  isRequest,
  onSchedule,
  onAcceptRequest,
  onRejectRequest,
  onCall,
}) => (
  <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {isMobile && (
          <button
            onClick={onBack}
            className="p-2 md:hidden text-gray-600 hover:text-gray-900 flex-shrink-0"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-base">
              {conversation.avatar}
            </div>
            <div
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${STATUS_COLORS[conversation.status]
                } border-2 border-white rounded-full`}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 truncate text-base">
                {conversation.name}
              </h2>
              {conversation.online && (
                <span className="text-xs text-green-600 font-medium hidden sm:inline flex-shrink-0">
                  Online
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">
              {conversation.role} • {conversation.company}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onCall(true)} // Audio call
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Audio Call"
        >
          <Phone size={20} />
        </button>
        <button
          onClick={() => onCall(false)} // Video call 
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Video Call"
        >
          <Video size={20} />
        </button>
        <button
          onClick={onToggleUserInfo}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Info size={20} />
        </button>
      </div>
    </div>

    {/* Swap Info Bar */}
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          className="flex items-center gap-4 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="text-center flex-shrink-0">
            <div className="text-xs text-gray-500">You Teach</div>
            <div className="font-medium text-gray-900 text-sm whitespace-nowrap">
              {conversation.swapDetails.skillToTeach}
            </div>
          </div>
          <RefreshCw size={14} className="text-gray-400 flex-shrink-0" />
          <div className="text-center flex-shrink-0">
            <div className="text-xs text-gray-500">You Learn</div>
            <div className="font-medium text-gray-900 text-sm whitespace-nowrap">
              {conversation.swapDetails.skillToLearn}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
          <div className="text-left sm:text-right">
            <div className="text-xs text-gray-500">Next Session</div>
            <div className="font-medium text-gray-900 text-sm whitespace-nowrap">
              {conversation.swapDetails.nextSession}
            </div>
          </div>
          {isRequest ? (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={onAcceptRequest}
                className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center gap-1 transition-colors"
              >
                <CheckCircle2 size={16} />
                Accept
              </button>
              <button
                onClick={onRejectRequest}
                className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 flex items-center gap-1 transition-colors"
              >
                <XCircle size={16} />
                Reject
              </button>
            </div>
          ) : (
            <button
              onClick={onSchedule}
              className="px-3 py-1.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 flex items-center gap-1 transition-colors flex-shrink-0"
            >
              <Calendar size={16} />
              Schedule
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ChatHeader;
