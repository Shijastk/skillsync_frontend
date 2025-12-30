import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Info, Calendar, ArrowLeft, Check, X, Star, ExternalLink, MoreVertical,
  Send, Clock, ShieldCheck, Code, Award, Trophy, AlertCircle, Monitor,
  MapPin, MessageCircle, ArrowRightLeft, UserCheck, ShieldAlert, Video, CheckCircle, XCircle
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import { format, isSameDay } from 'date-fns';

// Hooks
import { useSocket } from '../../context/SocketContext';
import { useAuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkMessageAsRead
} from "../../hooks/useMessages";
import { useUsers } from "../../hooks/useUsers";
import { useSwaps, useUpdateSwap } from "../../hooks/useSwaps";
import useResponsive from "../../hooks/useResponsive";

// Gemini UI Components
import { MessageInput } from './GeminiUI/MessageInput';
import { AudioPlayer } from './GeminiUI/AudioPlayer';
import { ConversationList } from './GeminiUI/ConversationList';
import { FilePreview } from './GeminiUI/FilePreview';
import { ScheduleModal } from './GeminiUI/ScheduleModal';
import { MessageContent } from './GeminiUI/MessageContent';
import { VoiceWaveform } from './GeminiUI/VoiceWaveform';

const MessagesPage = () => {
  // State
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const scrollRef = useRef(null);

  // Hooks & Context
  const { user: currentUser } = useAuthContext();
  const { isMobile } = useResponsive();
  const { success, error, info } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Queries
  const { data: conversationsData } = useConversations();
  const { data: messagesData } = useMessages(selectedChat);
  const { data: usersData } = useUsers();
  const { data: swapsData } = useSwaps();

  // Mutations
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkMessageAsRead();
  const updateSwapMutation = useUpdateSwap();

  // --- Data Processing ---
  const conversations = useMemo(() => {
    if (!conversationsData || !currentUser) return [];

    const mapped = conversationsData.map(conv => {
      const participants = Array.isArray(conv.participants) ? conv.participants : [];

      // Find other participant
      const otherParticipant = participants.find(p => {
        const participantId = typeof p === 'object' ? p._id : p;
        return participantId !== currentUser.id && participantId !== currentUser._id;
      });

      // Extract participant data
      let otherUser = {};
      if (otherParticipant) {
        if (typeof otherParticipant === 'object') {
          otherUser = {
            userId: otherParticipant._id,
            name: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
            avatar: otherParticipant.avatar,
            role: otherParticipant.role,
            bio: otherParticipant.bio,
            level: otherParticipant.level,
            location: otherParticipant.location
          };
        } else {
          const foundUser = usersData?.find(u => u.id === otherParticipant || u._id === otherParticipant);
          if (foundUser) {
            otherUser = {
              userId: foundUser.id || foundUser._id,
              name: `${foundUser.firstName} ${foundUser.lastName}`,
              avatar: foundUser.avatar,
              role: foundUser.role,
              bio: foundUser.bio,
              level: foundUser.level,
              location: foundUser.location
            };
          }
        }
      }

      // Match with swap data to find "relatedSwap"
      let relatedSwap = null;
      if (swapsData) {
        if (conv.contextId) {
          relatedSwap = swapsData.find(s => s.id === conv.contextId || s._id === conv.contextId);
        }
        if (!relatedSwap && otherUser.userId) {
          // Fallback: find any active swap between these two users
          relatedSwap = swapsData.find(s =>
            ((s.requesterId === currentUser.id || s.requester?._id === currentUser.id) && (s.receiverId === otherUser.userId || s.recipient?._id === otherUser.userId || s.recipient === otherUser.userId)) ||
            ((s.requesterId === otherUser.userId || s.requester?._id === otherUser.userId) && (s.receiverId === currentUser.id || s.recipient?._id === currentUser.id || s.recipient === currentUser.id))
          );
        }
      }

      const learnSkill = relatedSwap ? (relatedSwap.learnSkill || relatedSwap.skillRequested || 'N/A') : 'N/A';
      const teachSkill = relatedSwap ? (relatedSwap.teachSkill || relatedSwap.skillOffered || 'N/A') : 'N/A';

      const unreadCount = conv.unreadCounts?.[currentUser.id] || conv.unreadCounts?.[currentUser._id] || 0;

      return {
        ...otherUser,
        id: conv.id || conv._id,
        userId: otherUser.userId,
        teaching: teachSkill,
        learning: learnSkill,
        bio: otherUser.bio || 'No bio available',
        rating: otherUser.level ? `Lvl ${otherUser.level}` : 'New',
        location: otherUser.location || 'Unknown',
        isVerified: true,
        lastMessage: conv.lastMessage || '',
        lastTimestamp: conv.lastMessageTime ? new Date(conv.lastMessageTime) : null,
        unreadCount,
        swapStatus: relatedSwap?.status || 'pending',
        relatedSwap,
      };
    });

    // Deduplicate by userId (keep most recent)
    const uniqueConversations = new Map();
    mapped.forEach(conv => {
      if (!conv.userId) return;

      const existing = uniqueConversations.get(conv.userId);
      if (!existing || (conv.lastTimestamp && existing.lastTimestamp && conv.lastTimestamp > existing.lastTimestamp)) {
        uniqueConversations.set(conv.userId, conv);
      } else if (!existing && !conv.lastTimestamp) {
        // If neither has timestamp, just take the first one
        uniqueConversations.set(conv.userId, conv);
      }
    });

    return Array.from(uniqueConversations.values()).sort((a, b) => {
      return (b.lastTimestamp || 0) - (a.lastTimestamp || 0);
    });

  }, [conversationsData, usersData, currentUser, swapsData]);

  const filteredSwappers = useMemo(() =>
    conversations.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.teaching.toLowerCase().includes(searchTerm.toLowerCase())),
    [conversations, searchTerm]
  );

  const selectedSwapper = useMemo(() =>
    conversations.find(s => s.id === selectedChat) || {},
    [selectedChat, conversations]
  );

  const currentMessages = useMemo(() => {
    let rawMessages = messagesData || [];

    // Synthesize Swap Request Message if it doesn't exist
    if (selectedSwapper.relatedSwap && selectedChat) {
      const hasSwapRequestMsg = rawMessages.some(m => m.type === 'swap_request' || m.content?.includes(selectedSwapper.relatedSwap.skillRequested));

      if (!hasSwapRequestMsg) {
        const swap = selectedSwapper.relatedSwap;
        // Determine sender based on who requested
        const isRequester = swap.requester === currentUser.id || swap.requester?._id === currentUser.id || swap.requesterId === currentUser.id;

        const syntheticSwapMsg = {
          id: `synthetic-${swap._id || swap.id}`, // Unique enough
          sender: isRequester ? (currentUser.id || currentUser._id) : (selectedSwapper.id),
          type: 'swap_request',
          content: swap.description || `Proposed exchange: ${swap.skillOffered || 'Skill'} for ${swap.skillRequested || 'Skill'}`,
          timestamp: new Date(swap.createdAt || Date.now()),
          status: 'sent',
          isSynthetic: true // Flag to know it's fake
        };

        // Insert at the beginning or sort later
        rawMessages = [syntheticSwapMsg, ...rawMessages];
      }
    }

    // Process messages
    const processed = rawMessages.map(msg => {
      // Handle ID variations
      const senderVal = msg.sender;
      const senderId = (typeof senderVal === 'object' && senderVal !== null)
        ? (senderVal._id || senderVal.id)
        : senderVal;

      const currentUserId = currentUser?.id || currentUser?._id;
      const isOwn = senderId === currentUserId;

      return {
        id: msg.id || msg._id,
        sender: isOwn ? 'user' : 'ai',
        type: msg.type || 'text',
        content: msg.content || '',
        timestamp: new Date(msg.timestamp || msg.createdAt),
        attachment: msg.attachmentUrl ? {
          url: msg.attachmentUrl,
          type: (msg.type === 'image' || msg.attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) ? 'image' : 'file',
          name: msg.metadata?.fileName || 'Attachment',
          size: msg.metadata?.fileSize ? `${(msg.metadata.fileSize / 1024).toFixed(1)} KB` : 'File'
        } : undefined,
        status: msg.status,
        sessionDate: msg.metadata?.sessionDate,
        modality: msg.metadata?.modality,
        sessionDetail: msg.metadata?.sessionDetail,
        isSynthetic: msg.isSynthetic
      };
    });

    // Sort by timestamp
    return processed.sort((a, b) => a.timestamp - b.timestamp);

  }, [messagesData, currentUser, selectedSwapper, selectedChat]);

  // --- Effects ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentMessages]);

  useEffect(() => {
    if (selectedChat && isMobile) {
      setIsMobileListOpen(false);
    }
  }, [selectedChat, isMobile]);

  const lastMarkedMessageRef = useRef(null);

  // Reset tracked message when chat changes
  useEffect(() => {
    lastMarkedMessageRef.current = null;
  }, [selectedChat]);

  // Mark conversation as read when opened
  useEffect(() => {
    // Check if we have unread messages and a valid partner message to mark
    if (selectedChat && selectedSwapper?.unreadCount > 0 && currentMessages.length > 0) {
      // Find the last REAL message from the partner (not synthetic)
      const lastPartnerMessage = [...currentMessages].reverse().find(m =>
        m.sender === 'ai' &&
        !m.isSynthetic &&
        !m.id.toString().startsWith('synthetic-')
      );

      if (lastPartnerMessage &&
        lastPartnerMessage.id !== lastMarkedMessageRef.current &&
        !markAsReadMutation.isPending) {

        // Prevent duplicate calls for the same message
        lastMarkedMessageRef.current = lastPartnerMessage.id;

        // Calling markAsRead on any message resets the conversation unread count in the backend
        markAsReadMutation.mutate({
          messageId: lastPartnerMessage.id,
          conversationId: selectedChat
        });
      }
    }
  }, [selectedChat, currentMessages, selectedSwapper, markAsReadMutation]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !selectedChat) return;
    const handleNewMessage = (message) => {
      if (message.conversationId === selectedChat) {
        queryClient.invalidateQueries(['conversation', selectedChat, 'messages']);
        // Mark as read if not own
        const senderId = message.sender?._id || message.sender?.id || message.sender;
        const currentUserId = currentUser?.id || currentUser?._id;
        if (senderId !== currentUserId) {
          markAsReadMutation.mutate({ messageId: message._id || message.id, conversationId: selectedChat });
        }
      }
      queryClient.invalidateQueries(['conversations']);
    };
    socket.on('receive_message', handleNewMessage);
    return () => socket.off('receive_message', handleNewMessage);
  }, [socket, selectedChat, currentUser, markAsReadMutation, queryClient]);


  // --- Handlers ---
  const handleSendMessage = async (text) => {
    if (!text.trim() || !selectedChat) return;
    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedChat,
        content: text,
        type: 'text'
      });
    } catch (err) {
      console.error("Failed to send message", err);
      error("Failed to send message: " + err.message);
    }
  };

  const handleSendVoice = async (blob, duration) => {
    if (!selectedChat) return;
    const formData = new FormData();
    formData.append('conversationId', selectedChat);
    formData.append('type', 'voice');

    // Determine extension from blob type or default to webm
    const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
    formData.append('attachment', blob, `voice_message.${ext}`);
    formData.append('content', duration);

    try {
      await sendMessageMutation.mutateAsync(formData);
    } catch (err) {
      console.error("Failed to send voice message", err);
      error("Failed to send voice message: " + err.message);
    }
  };

  const handleSendFile = async (file) => {
    if (!selectedChat) return;
    const type = file.type.startsWith('image/') ? 'image' : 'file';
    const formData = new FormData();
    formData.append('conversationId', selectedChat);
    formData.append('type', type);
    formData.append('attachment', file);

    try {
      await sendMessageMutation.mutateAsync(formData);
    } catch (err) {
      console.error("Failed to send file", err);
      error("Failed to send file: " + err.message);
    }
  };

  const handleScheduleSession = async (date, modality, detail, isoDate) => {
    if (!selectedChat) return;

    console.log("Scheduling session:", { date, modality, detail, isoDate });

    try {
      // 1. Send the message to chat
      await sendMessageMutation.mutateAsync({
        conversationId: selectedChat,
        type: 'session_scheduled',
        content: 'Collaboration Proposed',
        metadata: { sessionDate: date, modality, sessionDetail: detail }
      });

      // 2. Update the actual swap record so it appears on the Schedule Page
      if (selectedSwapper.relatedSwap) {
        const validDate = isoDate || new Date(date).toISOString();

        await updateSwapMutation.mutateAsync({
          id: selectedSwapper.relatedSwap.id || selectedSwapper.relatedSwap._id,
          data: {
            status: 'scheduled',
            scheduledDate: validDate,
            modality: modality,
            meetingLink: modality === 'online' ? detail : undefined,
            location: modality === 'in-person' ? detail : undefined
          }
        });
        success("Session scheduled and calendar updated!");
      }

      // Force refresh messages
      queryClient.invalidateQueries(['conversation', selectedChat, 'messages']);

    } catch (err) {
      console.error("Failed to schedule session", err);
      // error("Failed to schedule: " + err.message);
    }
  };

  const handleAcceptSwap = async (swapId) => {
    console.log("Attempting to accept swap:", swapId);
    if (!swapId) {
      console.error("No swap ID found to accept");
      error("Cannot accept: Swap ID missing. Please refresh.");
      return;
    }
    try {
      await updateSwapMutation.mutateAsync({
        id: swapId,
        data: { status: 'accepted' }
      });

      await sendMessageMutation.mutateAsync({
        conversationId: selectedChat,
        type: 'system',
        content: 'The skill swap proposal has been accepted! You can now schedule a session.'
      });

      success("Swap proposal accepted!");
    } catch (err) {
      console.error("Failed to accept swap", err);
      error("Failed to accept swap: " + (err.message || "Unknown error"));
    }
  };

  const handleDeclineSwap = async (swapId) => {
    console.log("Attempting to decline swap:", swapId);
    if (!swapId) return;

    try {
      await updateSwapMutation.mutateAsync({
        id: swapId,
        data: { status: 'rejected' }
      });

      await sendMessageMutation.mutateAsync({
        conversationId: selectedChat,
        type: 'system',
        content: 'The skill swap proposal was declined.'
      });

      info("Swap proposal declined.");
    } catch (err) {
      console.error("Failed to decline swap", err);
      error("Failed to decline swap");
    }
  };

  return (
    <div className="flex h-[90vh] bg-white overflow-hidden relative text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(156, 163, 175, 0.8); }
        .whatsapp-bg {
            background-color: #e5ddd5;
            background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
            opacity: 0.1;
        }
      `}</style>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleSession}
        swapperName={selectedSwapper.name}
      />

      {/* Profile Sidebar */}
      <aside className={`fixed md:absolute top-0 right-0 h-full w-full sm:w-[350px] bg-white border-l border-slate-100 z-50 transition-transform transform shadow-2xl duration-300 ${isProfileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-8 sm:p-10 overflow-y-auto custom-scrollbar">
          <button onClick={() => setIsProfileOpen(false)} className="self-end p-2 text-slate-300 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-50"><X size={26} /></button>
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <img src={selectedSwapper.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="w-32 h-32 rounded-[40px] border-4 border-slate-50 shadow-2xl object-cover" alt="" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                <ShieldCheck size={20} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">{selectedSwapper.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-[11px]"><Star size={12} fill="currentColor" /> {selectedSwapper.rating}</div>
              {selectedSwapper.location && <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-[11px]"><MapPin size={12} /> {selectedSwapper.location}</div>}
            </div>
          </div>
          <div className="space-y-10">
            <section className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
              <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-5 tracking-[0.2em]">Asset Exchange</h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Teaching</span>
                  <span className="text-[14px] font-extrabold text-indigo-600 leading-tight">{selectedSwapper.teaching}</span>
                </div>
                <div className="h-px bg-slate-200/50" />
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Learning</span>
                  <span className="text-[14px] font-extrabold text-slate-900 leading-tight">{selectedSwapper.learning}</span>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-[0.2em]">Objective</h3>
              <p className="text-slate-600 text-[14px] leading-relaxed italic font-medium">"{selectedSwapper.bio}"</p>
            </section>
            <button className="w-full py-5 bg-slate-900 text-white font-bold uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3">
              View Portfolio <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Conversation List */}
      <div className={`${isMobileListOpen ? 'fixed inset-0 z-40 md:relative' : 'hidden md:flex'} w-full md:w-auto overflow-hidden`}>
        <ConversationList
          swappers={filteredSwappers}
          selectedId={selectedChat}
          onSelect={(id) => { setSelectedChat(id); setIsMobileListOpen(false); }}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {/* Main Chat Area */}
      <div className={`flex flex-col flex-grow relative w-full md:w-auto h-full ${isProfileOpen ? 'md:mr-[350px]' : ''} transition-all duration-300`}>
        {selectedChat && selectedSwapper.id ? (
          <>
            <header className="bg-white/95 backdrop-blur-xl h-[84px] flex items-center justify-between px-4 sm:px-6 border-b border-slate-100 z-20">
              <div className="flex items-center gap-4 min-w-0">
                <button onClick={() => setIsMobileListOpen(true)} className="md:hidden text-slate-400 p-2 hover:bg-slate-50 rounded-full transition-colors"><ArrowLeft size={24} /></button>
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <img src={selectedSwapper.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} onClick={() => setIsProfileOpen(true)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover cursor-pointer shadow-sm border border-slate-100 flex-shrink-0" alt="" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-slate-900 font-extrabold text-[15px] sm:text-[16px] tracking-tight truncate">{selectedSwapper.name}</span>
                    <div className="flex items-center gap-2 mt-0.5 sm:mt-1 overflow-hidden">
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-widest flex-shrink-0">{selectedSwapper.swapStatus === 'completed' ? 'Archived' : 'Active'}</span>
                      <span className="text-[9px] sm:text-[10px] font-extrabold text-indigo-600 truncate">{selectedSwapper.teaching} ↔ {selectedSwapper.learning}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={`p-2.5 sm:p-3 rounded-2xl transition-all ${isProfileOpen ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><Info size={20} /></button>
            </header>

            <div className="relative flex-grow overflow-hidden bg-slate-50/20">
              <div className="absolute inset-0 whatsapp-bg" />
              <main ref={scrollRef} className="relative z-10 h-full overflow-y-auto px-4 sm:px-10 lg:px-20 py-8 custom-scrollbar space-y-6">
                {currentMessages.length > 0 ? currentMessages.map((msg, index) => {
                  const showDate = index === 0 || !isSameDay(new Date(msg.timestamp), new Date(currentMessages[index - 1].timestamp));

                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-6 sticky top-2 z-10 opacity-90 hover:opacity-100 transition-opacity">
                          <span className="bg-slate-200/80 backdrop-blur-sm text-slate-600 text-[10px] font-bold px-4 py-1.5 rounded-full shadow-sm uppercase tracking-wider border border-white/50">
                            {format(new Date(msg.timestamp), 'MMMM d, yyyy')}
                          </span>
                        </div>
                      )}

                      <div className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[92%] sm:max-w-[80%] min-w-[120px] relative ${(msg.type === 'text' || msg.type === 'voice' || msg.type === 'file' || msg.type === 'image') ? 'rounded-2xl px-4 sm:px-5 pt-3 sm:pt-4 pb-7' : ''} ${msg.sender === 'user' && (msg.type === 'text' || msg.type === 'voice' || msg.type === 'file' || msg.type === 'image') ? 'bg-slate-900 text-white message-bubble-user rounded-tr-none' : ''} ${msg.sender === 'ai' && (msg.type === 'text' || msg.type === 'voice' || msg.type === 'file' || msg.type === 'image') ? 'bg-white text-slate-800 border border-slate-100 message-bubble-ai rounded-tl-none' : ''}`}>
                          {msg.type === 'text' && <MessageContent content={msg.content} isOwn={msg.sender === 'user'} />}
                          {msg.type === 'voice' && <AudioPlayer url={(msg.attachment && msg.attachment.url) || msg.content} duration={msg.content?.length < 10 ? msg.content : '0:30'} isOwn={msg.sender === 'user'} />}
                          {(msg.type === 'file' || msg.type === 'image') && msg.attachment && <FilePreview attachment={msg.attachment} isOwn={msg.sender === 'user'} />}

                          {msg.type === 'swap_request' && (
                            <div className="bg-white border-2 border-slate-100 rounded-[32px] overflow-hidden shadow-2xl w-full max-w-[420px] mx-auto sm:mx-0">
                              <div className="p-6 bg-slate-900 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Award className="text-indigo-400" size={24} />
                                  <div className="flex flex-col">
                                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">SkillSwap Brief</span>
                                    <span className="text-white font-extrabold text-sm tracking-tight">Collaboration Proposal</span>
                                  </div>
                                </div>
                              </div>
                              <div className="p-8">
                                <p className="text-slate-800 text-[16px] mb-8 leading-relaxed font-bold italic text-center">"{msg.content}"</p>
                                <div className="flex items-center justify-between gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/30">
                                  <div className="text-center flex-1">
                                    <span className="text-[9px] text-indigo-400 uppercase font-extrabold tracking-widest block mb-1">Teaching</span>
                                    <span className="text-indigo-900 text-[13px] font-extrabold">{selectedSwapper.teaching}</span>
                                  </div>
                                  <ArrowRightLeft className="text-indigo-300" size={20} />
                                  <div className="text-center flex-1">
                                    <span className="text-[9px] text-indigo-400 uppercase font-extrabold tracking-widest block mb-1">Learning</span>
                                    <span className="text-indigo-900 text-[13px] font-extrabold">{selectedSwapper.learning}</span>
                                  </div>
                                </div>
                              </div>

                              {msg.sender === 'ai' && (
                                <>
                                  {selectedSwapper.swapStatus === 'pending' ? (
                                    <div className="flex border-t border-slate-50 divide-x divide-slate-50">
                                      <button
                                        onClick={() => handleDeclineSwap(selectedSwapper.relatedSwap?.id || selectedSwapper.relatedSwap?._id)}
                                        className="flex-1 py-4 text-slate-400 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                                      >
                                        <X size={16} /> Decline
                                      </button>
                                      <button
                                        onClick={() => handleAcceptSwap(selectedSwapper.relatedSwap?.id || selectedSwapper.relatedSwap?._id)}
                                        className="flex-1 py-4 text-indigo-600 text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                                      >
                                        <Check size={16} /> Accept
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="p-4 text-center border-t border-slate-50 bg-slate-50/50">
                                      {selectedSwapper.swapStatus === 'accepted' && (
                                        <span className="text-green-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"><CheckCircle size={16} /> Proposal Accepted</span>
                                      )}
                                      {selectedSwapper.swapStatus === 'rejected' && (
                                        <span className="text-red-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"><XCircle size={16} /> Proposal Declined</span>
                                      )}
                                      {(selectedSwapper.swapStatus !== 'accepted' && selectedSwapper.swapStatus !== 'rejected' && selectedSwapper.swapStatus !== 'pending') && (
                                        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">Status: {selectedSwapper.swapStatus}</span>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}

                          {msg.type === 'session_scheduled' && (
                            <div className="bg-slate-900 text-white border border-slate-800 rounded-[28px] p-6 shadow-2xl space-y-5 min-w-[260px] sm:min-w-[300px] relative group">
                              <button
                                onClick={() => setIsScheduleModalOpen(true)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                title="Reschedule Session"
                              >
                                <div className="w-1 h-1 bg-current rounded-full shadow-[4px_0_0_currentColor,-4px_0_0_currentColor]" />
                              </button>
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center">
                                  {msg.modality === 'online' ? <Monitor size={24} /> : <MapPin size={24} />}
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">{msg.modality || 'Session'} Exchange Phase</span>
                                  <p className="text-[16px] font-extrabold mt-0.5 tracking-tight">{msg.sessionDate || 'Date not available'}</p>
                                </div>
                              </div>
                              <div className="pt-4 border-t border-white/5 space-y-4">
                                {msg.modality === 'online' ? (
                                  <a href={msg.sessionDetail || '#'} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl active:scale-95">
                                    <Video size={16} /> Join Secure Meeting
                                  </a>
                                ) : (
                                  <span className="text-sm font-bold block text-center bg-slate-800 p-2 rounded-xl">{msg.sessionDetail || 'Details not available'}</span>
                                )}
                              </div>
                            </div>
                          )}

                          {(msg.type === 'text' || msg.type === 'voice' || msg.type === 'file' || msg.type === 'image') && (
                            <div className={`absolute bottom-2 right-4 flex items-center gap-1.5 text-[9px] font-bold whitespace-nowrap ${msg.sender === 'user' ? 'text-white/40' : 'text-slate-300'}`}>
                              <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {msg.sender === 'user' && <Check size={12} className="text-indigo-400" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                }) : (
                  <div className="flex h-full items-center justify-center flex-col text-slate-400 gap-4 opacity-50">
                    <MessageCircle size={48} />
                    <span className="text-sm font-bold">No messages yet. Start the conversation!</span>
                  </div>
                )}
              </main>
            </div>

            <footer className="bg-white border-t border-slate-100 relative z-20">
              {selectedSwapper.swapStatus === 'pending' ? (
                <div className="p-6 text-center">
                  <p className="text-sm font-bold text-slate-500 mb-2">Wait for the request to be accepted</p>
                  <p className="text-xs text-slate-400">Messaging is disabled until the skill swap request is ratified.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center px-4 sm:px-6 py-3.5 gap-3 bg-slate-50/50 overflow-x-auto no-scrollbar border-b border-slate-50">
                    <button onClick={() => setIsScheduleModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap shadow-sm bg-white border border-slate-200 text-slate-700 hover:border-indigo-200 hover:text-indigo-600">
                      <Calendar size={14} /> Schedule Session
                    </button>
                    <button onClick={() => info('Verification started')} className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-[10px] sm:text-[11px] font-bold uppercase tracking-widest whitespace-nowrap shadow-lg bg-slate-100 text-slate-300 shadow-none hover:bg-slate-200 hover:text-slate-500">
                      <Trophy size={14} /> Finalize Protocol
                    </button>
                  </div>
                  <MessageInput onSendMessage={handleSendMessage} onSendVoice={handleSendVoice} onSendFile={handleSendFile} />
                </>
              )}
            </footer>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50/30 text-slate-300">
            <div className="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center mb-6 shadow-sm">
              <MessageCircle size={48} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Select a Protocol Log</h2>
            <p className="text-sm font-semibold text-center mt-2 opacity-60">Choose a SkillSwap partner to begin the exchange protocol process.</p>
          </div>
        )}
      </div>

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleSession}
        swapperName={selectedSwapper?.name || 'Partner'}
        initialData={selectedSwapper?.relatedSwap}
      />
    </div>
  );
};

export default MessagesPage;
