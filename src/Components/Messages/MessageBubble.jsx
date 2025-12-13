import React, { useState } from "react";
import { Check, CheckCheck, FileText, Play, Pause, Download } from "lucide-react";

const MessageBubble = ({ message, isOwn, senderAvatar, senderName }) => {
  const displayText = message.text || "";
  const [isPlaying, setIsPlaying] = useState(false);

  const renderContent = () => {
    const type = (message.type || 'text').toLowerCase();

    switch (type) {
      case 'image':
      case 'camera':
        return (
          <div className="space-y-1">
            {message.attachmentUrl && (
              <img
                src={message.attachmentUrl}
                alt="Attachment"
                className="rounded-lg max-w-full h-auto max-h-60 object-cover cursor-pointer hover:opacity-95"
              />
            )}
            {displayText && <p className="mt-1">{displayText}</p>}
          </div>
        );

      case 'audio':
      case 'mic':
        return (
          <div className="flex items-center gap-3 min-w-[200px] py-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-full transition-colors ${isOwn ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
            <div className={`h-1 flex-1 rounded-full overflow-hidden ${isOwn ? 'bg-white/30' : 'bg-gray-200'}`}>
              <div
                className={`h-full duration-1000 transition-all ${isOwn ? 'bg-white' : 'bg-gray-800'}`}
                style={{ width: isPlaying ? '60%' : '0%' }}
              ></div>
            </div>
            <span className={`text-xs font-mono mb-0.5 ${isOwn ? 'text-white/80' : 'text-gray-500'}`}>
              {isPlaying ? '0:08' : '0:15'}
            </span>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <a
              href={message.attachmentUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors no-underline group
                              ${isOwn
                  ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                  : 'bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-900'}`
              }
            >
              <div className={`p-2 rounded-lg ${isOwn ? 'bg-white/20' : 'bg-blue-100 text-blue-600'}`}>
                <FileText size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate pr-2">document.pdf</p>
                <p className={`text-xs ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>1.2 MB</p>
              </div>
              <Download size={18} className={isOwn ? 'text-white/70' : 'text-gray-400 group-hover:text-gray-600'} />
            </a>
            {displayText && <p>{displayText}</p>}
          </div>
        );

      case 'call':
        return (
          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className={`flex items-center gap-3 font-semibold ${isOwn ? 'text-white' : 'text-gray-900'}`}>
              <div className={`p-2 rounded-full ${isOwn ? 'bg-white/20' : 'bg-gray-100'}`}>
                <Play size={20} fill="currentColor" />
              </div>
              <span>{message.text || "Video Call Started"}</span>
            </div>
            {!isOwn && message.attachmentUrl && (
              <button
                onClick={() => window.open(message.attachmentUrl, '_blank')} // Fallback or handle inside app
                className="mt-1 w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                Join Call
              </button>
            )}
            {/* Note: In a real app the join button would trigger the local join function, 
                    currently handled via global state when the user clicks */}
          </div>
        );

      default:
        return <p>{displayText}</p>;
    }
  };

  return (
    <div className={`mb-4 flex ${isOwn ? "justify-end" : "justify-start"}`}>
      {/* Avatar for other user */}
      {!isOwn && (
        <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-2">
          {senderAvatar}
        </div>
      )}

      {/* Message Container */}
      <div className="min-w-0 max-w-[85%] md:max-w-[75%]">
        {/* Sender Name & Time */}
        <div className="text-xs text-gray-500 mb-1 px-1">
          {isOwn ? "You" : senderName} • {message.time || "Just now"}
        </div>

        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-base break-words whitespace-pre-wrap ${isOwn
            ? "bg-black text-white rounded-br-none"
            : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
            }`}
        >
          {renderContent()}
        </div>

        {/* Read / Delivered Icons */}
        {isOwn && (
          <div className="flex items-center gap-1 mt-1 px-1">
            {message.read ? (
              <CheckCheck className="text-blue-500" size={14} />
            ) : (
              <Check className="text-gray-400" size={14} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
