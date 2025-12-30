import React from 'react';
import { Check, CheckCheck, Download, Mic, Play, Pause, Video as VideoIcon } from 'lucide-react';
import { format } from 'date-fns';

const MessageBubble = ({ message, isOwn, currentUser }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const audioRef = React.useRef(null);

    const isRead = message.readBy?.some(id => id !== message.sender?.id && id !== message.sender?._id);
    const isImage = message.type === 'image' && message.attachmentUrl;
    const isVideo = message.type === 'video' && message.attachmentUrl;
    const isVoice = message.type === 'voice' || (message.attachmentUrl && (
        message.attachmentUrl.includes('.webm') ||
        message.attachmentUrl.includes('.mp3') ||
        message.attachmentUrl.includes('.ogg') ||
        message.attachmentUrl.includes('.m4a') ||
        message.content?.includes('🎤')
    ));
    const isFile = message.type === 'file' && message.attachmentUrl;

    const toggleAudio = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    React.useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        const handleEnded = () => setIsPlaying(false);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('pause', handlePause);
        };
    }, []);

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
            <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwn
                    ? 'bg-black text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
            >
                {/* Sender Name (for group chats) */}
                {!isOwn && message.sender && (
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                        {message.sender.firstName || message.sender.name}
                    </p>
                )}

                {/* Voice Message */}
                {isVoice && (
                    <div className="flex items-center gap-3 min-w-[200px]">
                        <button
                            onClick={toggleAudio}
                            className={`p-2 rounded-full ${isOwn ? 'bg-white/20 hover:bg-white/30' : 'bg-black/10 hover:bg-black/20'
                                } transition-colors`}
                        >
                            {isPlaying ? (
                                <Pause size={20} className={isOwn ? 'text-white' : 'text-gray-900'} />
                            ) : (
                                <Play size={20} className={isOwn ? 'text-white' : 'text-gray-900'} />
                            )}
                        </button>

                        <div className="flex-1">
                            <div className={`h-1 rounded-full ${isOwn ? 'bg-white/30' : 'bg-gray-300'} overflow-hidden`}>
                                <div className={`h-full ${isOwn ? 'bg-white' : 'bg-black'} w-0`} id={`audio-progress-${message.id || message._id}`}></div>
                            </div>
                        </div>

                        <Mic size={16} className={isOwn ? 'text-white/70' : 'text-gray-500'} />

                        {message.metadata?.duration && (
                            <span className="text-xs">{Math.floor(message.metadata.duration)}s</span>
                        )}

                        <audio ref={audioRef} src={message.attachmentUrl} preload="metadata" />
                    </div>
                )}

                {/* Video Message */}
                {isVideo && (
                    <div className="mb-2 max-w-sm">
                        <video
                            src={message.attachmentUrl}
                            poster={message.metadata?.thumbnail}
                            controls
                            style={{}}
                            className="w-full rounded-lg max-h-[300px]"
                        />
                        {message.metadata?.duration && (
                            <div className="flex items-center gap-1 text-xs mt-1 opacity-70">
                                <VideoIcon size={12} />
                                <span>{Math.floor(message.metadata.duration)}s</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Image Message */}
                {isImage && !isVoice && (
                    <div className="mb-2">
                        <img
                            src={message.attachmentUrl}
                            alt="Attachment"
                            className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity max-h-[300px] object-cover"
                            onClick={() => window.open(message.attachmentUrl, '_blank')}
                        />
                        {message.metadata?.width && message.metadata?.height && (
                            <div className="text-xs mt-1 opacity-70">
                                {message.metadata.width}x{message.metadata.height}
                            </div>
                        )}
                    </div>
                )}

                {/* File Download */}
                {isFile && (
                    <a
                        href={message.attachmentUrl}
                        download={message.metadata?.fileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 p-2 rounded-lg ${isOwn ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200/50 hover:bg-gray-200'
                            } transition-colors`}
                    >
                        <Download size={20} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {message.metadata?.fileName || 'Download File'}
                            </p>
                            {message.metadata?.fileSize && (
                                <p className="text-xs opacity-70">
                                    {(message.metadata.fileSize / 1024).toFixed(0)} KB
                                </p>
                            )}
                        </div>
                    </a>
                )}

                {/* Text Content */}
                {message.content && !isVoice && (
                    <p className={`text-sm whitespace-pre-wrap break-words ${(isImage || isVideo || isFile) ? 'mt-2' : ''}`}>
                        {message.content}
                    </p>
                )}

                {/* Timestamp and Read Status */}
                <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                    <span className="text-xs">
                        {(() => {
                            const dateStr = message.createdAt || message.timestamp;
                            if (!dateStr) return 'Now';

                            const date = new Date(dateStr);
                            if (isNaN(date.getTime())) return 'Now';

                            return format(date, 'HH:mm');
                        })()}
                    </span>
                    {isOwn && (
                        <span>
                            {isRead ? (
                                <CheckCheck size={14} className="text-blue-400" />
                            ) : (
                                <Check size={14} />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
