import React from "react";

const TypingIndicator = ({ avatar, name }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 max-w-[75%]">
      <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
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
      <div>
        <div className="text-xs text-gray-500 mb-1 px-2">
          {name} • typing...
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3">
          <div className="flex gap-1">
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TypingIndicator;
