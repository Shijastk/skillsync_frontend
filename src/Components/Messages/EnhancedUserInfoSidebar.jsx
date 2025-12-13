import React from "react";
import {
  X,
  PhoneCall,
  Video,
  RefreshCw,
  Zap,
  Bell,
  Flag,
  Ban,
  Archive,
  Calendar,
  Award,
  TrendingUp,
  Star,
  Users,
} from "lucide-react";
import { SWAP_STATUS_COLORS } from "../../data/constants";

const EnhancedUserInfoSidebar = ({ conversation, onClose }) => (
  <div className="fixed md:static inset-y-0 right-0 z-30 w-full md:w-96 bg-white border-l border-gray-200 flex flex-col">
    <div className="flex-shrink-0 p-4 border-b border-gray-200 flex items-center justify-between">
      <h3 className="font-semibold text-gray-900">User Details</h3>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
      >
        <X size={20} />
      </button>
    </div>
    <div className="flex-1 overflow-y-auto p-4">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-3xl mb-4">
          {conversation.avatar}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {conversation.name}
        </h3>
        <p className="text-gray-500 mb-2">{conversation.role}</p>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-sm text-gray-600">{conversation.company}</span>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">{conversation.location}</span>
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{conversation.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} className="text-gray-600" />
            <span className="font-medium">{conversation.totalSwaps} swaps</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center">
          <button className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
            <PhoneCall size={16} />
            Call
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Video size={16} />
            Video
          </button>
        </div>
      </div>

      {/* Swap Details */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
          <RefreshCw size={18} />
          Swap Details
        </h4>
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">You Teach:</span>
            <span className="font-medium text-gray-900">
              {conversation.swapDetails.skillToTeach}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">You Learn:</span>
            <span className="font-medium text-gray-900">
              {conversation.swapDetails.skillToLearn}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                SWAP_STATUS_COLORS[conversation.swapDetails.status]
              }`}
            >
              {conversation.swapDetails.status}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Next Session:</span>
            <span className="font-medium text-gray-900">
              {conversation.swapDetails.nextSession}
            </span>
          </div>

          {/* Progress Bar */}
          {conversation.swapDetails.progress > 0 && (
            <div className="pt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{conversation.swapDetails.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${conversation.swapDetails.progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {conversation.swapDetails.hoursCompleted}/
                {conversation.swapDetails.totalHours} hours completed
              </div>
            </div>
          )}

          {/* Swap Rating */}
          {conversation.swapDetails.swapRating && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-600">Swap Rating:</span>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="font-medium">
                  {conversation.swapDetails.swapRating}/5.0
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Zap size={18} />
          Quick Actions
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center">
            <Bell size={18} className="mx-auto mb-1 text-gray-700" />
            <span className="text-xs font-medium">Mute</span>
          </button>
          <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center">
            <Flag size={18} className="mx-auto mb-1 text-gray-700" />
            <span className="text-xs font-medium">Report</span>
          </button>
          <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center">
            <Ban size={18} className="mx-auto mb-1 text-gray-700" />
            <span className="text-xs font-medium">Block</span>
          </button>
          <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center">
            <Archive size={18} className="mx-auto mb-1 text-gray-700" />
            <span className="text-xs font-medium">Archive</span>
          </button>
          <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center">
            <Calendar size={18} className="mx-auto mb-1 text-gray-700" />
            <span className="text-xs font-medium">Reschedule</span>
          </button>
          <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center">
            <Award size={18} className="mx-auto mb-1 text-gray-700" />
            <span className="text-xs font-medium">End Swap</span>
          </button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
          <TrendingUp size={18} />
          Activity Stats
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-700">
              {conversation.totalSwaps}
            </div>
            <div className="text-xs text-blue-600">Total Swaps</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-700">
              {conversation.rating}
            </div>
            <div className="text-xs text-green-600">Average Rating</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-700">
              {conversation.swapDetails.hoursCompleted || 0}
            </div>
            <div className="text-xs text-purple-600">Hours Completed</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-700">
              {conversation.swapDetails.swapRating || "N/A"}
            </div>
            <div className="text-xs text-orange-600">Swap Rating</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default EnhancedUserInfoSidebar;
