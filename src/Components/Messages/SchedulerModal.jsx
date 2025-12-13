import React from "react";
import { X, Calendar } from "lucide-react";
import { Datepicker } from "flowbite-react";

const SchedulerModal = ({
  date,
  time,
  onDateChange,
  onTimeChange,
  onSubmit,
  onClose,
}) => (
  <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Schedule Session
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
        >
          <X size={20} />
        </button>
      </div>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Date
          </label>
          <Datepicker
            onSelectedDateChanged={(date) =>
              onDateChange(date.toISOString().split("T")[0])
            }
            minDate={new Date()}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-black focus:bg-white text-gray-900"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={!date || !time}
          className="flex-1 px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Schedule Session
        </button>
      </div>
    </div>
  </div>
);

export default SchedulerModal;
