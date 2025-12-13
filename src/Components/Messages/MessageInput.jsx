import React, { useState, useRef } from "react";
import { Send, Paperclip, Smile, CheckCircle2, XCircle } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
// import { ATTACHMENT_OPTIONS, QUICK_REACTIONS } from "../../data/constants";
import { Image, FileText, Mic, Camera, MapPin } from "lucide-react";
import { ATTACHMENT_OPTIONS } from "../../data/constants";
import { QUICK_REACTIONS } from "../../data/mockConversations";

const MessageInput = ({
  isRequest,
  messageInput,
  setMessageInput,
  textareaRef,
  onKeyPress,
  onSendMessage,
  showAttachmentMenu,
  setShowAttachmentMenu,
  showEmojiPicker,
  setShowEmojiPicker,
  attachmentMenuRef,
  emojiPickerRef,
  onAttachment,
  onAcceptRequest,
  onRejectRequest,
}) => {
  const [quickReactions, setQuickReactions] = useState(QUICK_REACTIONS);

  const handleEmojiSelect = (emoji) => {
    setMessageInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const iconComponents = {
    Image,
    FileText,
    Mic,
    Camera,
    MapPin,
  };

  if (isRequest) {
    return (
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-orange-800 font-medium mb-2">
            Respond to this swap request
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={onAcceptRequest}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
            >
              <CheckCircle2 size={18} />
              Accept Request
            </button>
            <button
              onClick={onRejectRequest}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 flex items-center gap-2 transition-colors"
            >
              <XCircle size={18} />
              Decline
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
      <div className="relative">
        {/* Quick Reactions */}
        <div
          className="flex gap-2 mb-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "thin" }}
        >
          {quickReactions.map((reaction, index) => (
            <button
              key={index}
              onClick={() => setMessageInput((prev) => prev + reaction)}
              className="text-xl hover:scale-110 transition-transform p-1 flex-shrink-0"
            >
              {reaction}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyPress={onKeyPress}
              placeholder="Type your message here..."
              className="w-full pl-4 pr-12 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-black focus:bg-white text-gray-900 placeholder-gray-500 resize-none overflow-hidden max-h-32"
              rows={1}
            />
            <div className="absolute right-3 bottom-3 flex gap-1">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Smile size={20} />
              </button>
              <button
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Paperclip size={20} />
              </button>
            </div>
          </div>
          <button
            onClick={onSendMessage}
            disabled={!messageInput.trim()}
            className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <div
          ref={attachmentMenuRef}
          className="absolute bottom-24 right-24 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-40 w-48"
        >
          {ATTACHMENT_OPTIONS.map((option) => {
            const Icon = iconComponents[option.icon];
            return (
              <button
                key={option.type}
                onClick={() => onAttachment(option.type)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Icon size={18} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef}>
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
