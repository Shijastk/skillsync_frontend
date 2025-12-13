import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Hooks
import useResponsive from "../../hooks/useResponsive";
import useClickOutside from "../../hooks/useClickOutside";
import { useAuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead
} from "../../hooks/useMessages";
import { useUsers } from "../../hooks/useUsers";
import { useSwaps } from "../../hooks/useSwaps";

// Components
import Sidebar from "./Sidebar";
import EnhancedUserInfoSidebar from "./EnhancedUserInfoSidebar";
import MainChatArea from "./MainChatArea";
import SchedulerModal from "./SchedulerModal";
import LoadingSpinner from "../common/LoadingSpinner";
import VideoCallModal from "../modals/VideoCallModal";

const MessagesPage = () => {
  // State management
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [schedulerDate, setSchedulerDate] = useState("");
  const [schedulerTime, setSchedulerTime] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoRoomId, setVideoRoomId] = useState(null);
  const [isAudioCall, setIsAudioCall] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const emojiPickerRef = useRef(null);



  // Custom hooks
  const { isMobile } = useResponsive();
  const { user: currentUser } = useAuthContext();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  // Queries
  const { data: conversationsData, isLoading: isLoadingConversations } = useConversations();
  const { data: messagesData, isLoading: isLoadingMessages } = useMessages(selectedChat);
  const { data: usersData } = useUsers();
  const { data: swapsData } = useSwaps();

  // Mutations
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();

  // Process Interactions
  const conversations = useMemo(() => {
    if (!conversationsData || !usersData || !currentUser) return [];

    return conversationsData.map(conv => {
      // Find other participant
      // Access participants safely, ensuring it's an array
      const participants = Array.isArray(conv.participants) ? conv.participants : [];
      const otherId = participants.find(id => id !== currentUser.id);
      const otherUser = usersData.find(u => u.id === otherId) || {};

      // Match with real swap data
      let relatedSwap = null;
      if (swapsData) {
        if (conv.contextId) {
          relatedSwap = swapsData.find(s => s.id === conv.contextId);
        }
        if (!relatedSwap && participants.length === 2) {
          // Try to find a swap between these two users
          relatedSwap = swapsData.find(s =>
            (s.requesterId === currentUser.id && s.receiverId === otherUser.id) ||
            (s.requesterId === otherUser.id && s.receiverId === currentUser.id) ||
            (s.requesterId === currentUser.id && s.recipientId === otherUser.id) // check recipientId legacy field
          );
        }
      }

      const learnSkill = relatedSwap ? (relatedSwap.learnSkill || relatedSwap.skillRequested || 'React') : 'React';
      const teachSkill = relatedSwap ? (relatedSwap.teachSkill || relatedSwap.skillOffered || 'Design') : 'Design';

      return {
        ...conv,
        id: conv.id || Math.random().toString(), // Ensure ID
        userId: otherUser.id,
        name: otherUser.name || 'Unknown User',
        role: otherUser.role || 'Member',
        company: otherUser.company || 'SkillSwap',
        avatar: otherUser.initials || (otherUser.name ? otherUser.name[0] : '?'), // Use initials as avatar
        unread: conv.unreadCount || 0,
        lastMessage: conv.lastMessage || '',
        timestamp: conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        swapDetails: conv.swapDetails || {
          status: relatedSwap?.status || 'in-progress',
          skillToLearn: learnSkill,
          skillToTeach: teachSkill,
          nextSession: relatedSwap?.scheduledDate || 'Tue, 4 PM'
        }
      };
    });
  }, [conversationsData, usersData, currentUser, swapsData]);

  const selectedConversation = useMemo(() => {
    if (!selectedChat || !conversations) return null;
    const conv = conversations.find(c => c.id === selectedChat);
    if (!conv) return null;

    // Map messages to UI format
    const mappedMessages = (messagesData || []).map(msg => ({
      id: msg.id,
      sender: msg.senderId,
      text: msg.content,
      time: msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      read: msg.isRead,
      type: msg.type || 'text',
      attachmentUrl: msg.attachmentUrl
    }));

    return {
      ...conv,
      messages: mappedMessages
    };
  }, [selectedChat, conversations, messagesData]);


  // Filters configuration
  const filters = useMemo(
    () => [
      { id: "all", label: "All", count: conversations.length },
      {
        id: "unread",
        label: "Unread",
        count: conversations.filter((c) => c.unread > 0).length,
      },
      // Simplified filters for MVP
    ],
    [conversations]
  );

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      if (activeFilter === "unread") return conv.unread > 0;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          conv.name.toLowerCase().includes(query) ||
          conv.role.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [conversations, activeFilter, searchQuery]);

  // Effects
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation?.messages]);

  useEffect(() => {
    if (isMobile && selectedChat) {
      setIsSidebarOpen(false);
    }
  }, [selectedChat, isMobile]);

  // Click outside handlers
  useClickOutside(attachmentMenuRef, () => setShowAttachmentMenu(false));
  useClickOutside(emojiPickerRef, () => setShowEmojiPicker(false));

  // Event handlers
  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !selectedConversation || !currentUser) return;

    const messageData = {
      conversationId: selectedChat,
      senderId: currentUser.id,
      content: messageInput,
      type: 'text',
      timestamp: new Date().toISOString(),
      isRead: false
    };

    try {
      await sendMessageMutation.mutateAsync(messageData);
      setMessageInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      error("Failed to send message");
    }
  }, [messageInput, selectedConversation, selectedChat, currentUser, sendMessageMutation, error]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const markAsRead = useCallback((conversationId) => {
    // Ideally call mutation here
    // markAsReadMutation.mutate(conversationId) // Need to implement correctly per message or conversation
  }, []);

  const handleSelectChat = useCallback(
    (chatId) => {
      setSelectedChat(chatId);
      markAsRead(chatId);
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    },
    [isMobile, markAsRead]
  );

  const handleAttachment = useCallback(async (type) => {
    setShowAttachmentMenu(false);

    // Simulate upload delay for "proper handling" feel
    info(`Uploading ${type}...`);

    setTimeout(async () => {
      const messageData = {
        conversationId: selectedChat,
        senderId: currentUser.id,
        content: `Sent a ${type}`,
        type: type.toLowerCase(), // image, file, audio
        attachmentUrl: type.toLowerCase() === 'image' || type.toLowerCase() === 'camera'
          ? `https://picsum.photos/seed/${Date.now()}/400/300`
          : type.toLowerCase() === 'audio' || type.toLowerCase() === 'mic'
            ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Mock audio
            : `https://example.com/file.pdf`,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      try {
        await sendMessageMutation.mutateAsync(messageData);
        success(`${type} sent`);
      } catch (err) {
        error("Failed to send attachment");
      }
    }, 1500);

  }, [selectedChat, currentUser, sendMessageMutation, success, error, info]);

  if (isLoadingConversations) {
    return <LoadingSpinner />;
  }

  // Component rendering
  return (
    <div className="flex h-[90vh] bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen && (!selectedChat || !isMobile)}
        isMobile={isMobile}
        selectedChat={selectedChat}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filters={filters}
        filteredConversations={filteredConversations}
        onSelectChat={handleSelectChat}
        onMarkAsRead={markAsRead}
        onNewChat={() => navigate('/discover')}
        user={{ ...currentUser, avatar: currentUser?.initials || currentUser?.name?.[0] }}
      />

      {/* Main Chat Area */}
      <MainChatArea
        isMobile={isMobile}
        selectedChat={selectedChat}
        selectedConversation={selectedConversation}
        showUserInfo={showUserInfo}
        user={{ ...currentUser, avatar: currentUser?.initials || currentUser?.name?.[0] }}
        onBack={() => {
          setSelectedChat(null);
          setIsSidebarOpen(true);
          setShowUserInfo(false);
        }}
        onToggleUserInfo={() => setShowUserInfo(!showUserInfo)}
        onSchedule={() => setShowScheduler(true)}
        isTyping={isTyping}
        messagesEndRef={messagesEndRef}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        textareaRef={textareaRef}
        onKeyPress={handleKeyPress}
        onSendMessage={handleSendMessage}
        showAttachmentMenu={showAttachmentMenu}
        setShowAttachmentMenu={setShowAttachmentMenu}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        attachmentMenuRef={attachmentMenuRef}
        emojiPickerRef={emojiPickerRef}
        onAttachment={handleAttachment}
        isRequest={selectedConversation?.swapDetails?.status === "request"}
        onAcceptRequest={() => info("Accept request logic pending")}
        onRejectRequest={() => info("Reject request logic pending")}
        onCall={(audioOnly) => {
          // Generate a unique room ID
          const roomId = `SkillSwap-${selectedChat}-${Date.now()}`;
          setVideoRoomId(roomId);
          setIsAudioCall(audioOnly);
          setShowVideoCall(true);

          // Send system message to chat
          const callMessage = {
            conversationId: selectedChat,
            senderId: currentUser.id,
            content: `${audioOnly ? 'Audio' : 'Video'} Call started`,
            type: 'call',
            attachmentUrl: roomId, // Storing roomId here if needed for joining
            timestamp: new Date().toISOString(),
            isRead: false
          };

          sendMessageMutation.mutate(callMessage);
        }}
      />

      {/* User Info Sidebar */}
      {showUserInfo && selectedConversation && (
        <EnhancedUserInfoSidebar
          conversation={selectedConversation}
          onClose={() => setShowUserInfo(false)}
        />
      )}

      {/* Scheduler Modal */}
      {showScheduler && (
        <SchedulerModal
          date={schedulerDate}
          time={schedulerTime}
          onDateChange={setSchedulerDate}
          onTimeChange={setSchedulerTime}
          onSubmit={() => info("Schedule request sent")}
          onClose={() => {
            setShowScheduler(false);
          }}
        />
      )}

      {/* Mobile Sidebar Toggle */}
      {isMobile && !isSidebarOpen && !selectedChat && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-20 p-2 bg-black text-white rounded-lg shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Video Call Modal */}
      {showVideoCall && (
        <VideoCallModal
          roomName={videoRoomId}
          userName={currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : "User"}
          isAudioOnly={isAudioCall}
          onClose={() => setShowVideoCall(false)}
        />
      )}
    </div>
  );
}; // End of MessagesPage component

export default MessagesPage;
