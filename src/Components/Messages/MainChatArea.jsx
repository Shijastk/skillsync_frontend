import React from "react";
import { MessageSquare } from "lucide-react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";

const MainChatArea = ({
  isMobile,
  selectedChat,
  selectedConversation,
  showUserInfo,
  user,
  onBack,
  onToggleUserInfo,
  onSchedule,
  isTyping,
  messagesEndRef,
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
  isRequest,
  onAcceptRequest,
  onRejectRequest,
  onCall,
}) => {
  if (!selectedConversation) {
    return (
      <div
        className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${!selectedChat && !isMobile ? "hidden md:flex" : "flex"
          }`}
      >
        <MessageSquare size={64} className="text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No conversation selected
        </h3>
        <p className="text-gray-500">
          Select a conversation from the sidebar to start messaging, or start a
          new skill swap!
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">47</div>
            <div className="text-sm text-gray-600">Total Swaps</div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">4.9</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col ${!selectedChat && !isMobile ? "hidden md:flex" : "flex"
        } min-w-0`}
    >
      {/* Chat Header */}
      <ChatHeader
        conversation={selectedConversation}
        isMobile={isMobile}
        onBack={onBack}
        onToggleUserInfo={onToggleUserInfo}
        isRequest={isRequest}
        onSchedule={onSchedule}
        onAcceptRequest={onAcceptRequest}
        onRejectRequest={onRejectRequest}
        onCall={onCall}
      />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-4xl">
          {selectedConversation.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender === user.id}
              senderAvatar={
                message.sender === user.id
                  ? user.avatar
                  : selectedConversation.avatar
              }
              senderName={selectedConversation.name}
            />
          ))}
          {isTyping && (
            <TypingIndicator
              avatar={selectedConversation.avatar}
              name={selectedConversation.name}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageInput
        isRequest={isRequest}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        textareaRef={textareaRef}
        onKeyPress={onKeyPress}
        onSendMessage={onSendMessage}
        showAttachmentMenu={showAttachmentMenu}
        setShowAttachmentMenu={setShowAttachmentMenu}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        attachmentMenuRef={attachmentMenuRef}
        emojiPickerRef={emojiPickerRef}
        onAttachment={onAttachment}
        onAcceptRequest={onAcceptRequest}
        onRejectRequest={onRejectRequest}
      />
    </div>
  );
};

export default MainChatArea;
