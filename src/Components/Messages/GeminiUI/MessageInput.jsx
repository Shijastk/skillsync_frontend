import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Trash2, Plus, Image as ImageIcon, File as FileIcon } from 'lucide-react';
import { VoiceWaveform } from './VoiceWaveform';

export const MessageInput = ({ onSendMessage, onSendVoice, onSendFile }) => {
    const [text, setText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [displayTime, setDisplayTime] = useState(0);
    const [analyser, setAnalyser] = useState(null);
    const [showAttachMenu, setShowAttachMenu] = useState(false);

    const fileInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const recordingTimeRef = useRef(0);
    const audioContextRef = useRef(null);
    const shouldSendRef = useRef(true);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [text]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSend = () => {
        if (text.trim()) {
            onSendMessage(text);
            setText('');
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onSendFile(file);
            setShowAttachMenu(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaStreamSource(stream);
            const analyserNode = audioCtx.createAnalyser();
            analyserNode.fftSize = 256;
            source.connect(analyserNode);

            audioContextRef.current = audioCtx;
            setAnalyser(analyserNode);

            const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
            const recorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];
            recordingTimeRef.current = 0;
            setDisplayTime(0);
            shouldSendRef.current = true;

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                if (shouldSendRef.current === true && chunksRef.current.length > 0) {
                    const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType });
                    const durationStr = formatTime(Math.max(1, recordingTimeRef.current));
                    onSendVoice(audioBlob, durationStr);
                }
                stream.getTracks().forEach(track => track.stop());
                if (audioCtx.state !== 'closed') audioCtx.close();
                setAnalyser(null);
                setDisplayTime(0);
                chunksRef.current = [];
            };

            recorder.start();
            setIsRecording(true);
            timerRef.current = window.setInterval(() => {
                recordingTimeRef.current += 1;
                setDisplayTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            alert("Microphone access is required for voice briefs.");
        }
    };

    const stopRecording = (send = true) => {
        shouldSendRef.current = send;
        if (timerRef.current) clearInterval(timerRef.current);
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className={`bg-white px-4 md:px-6 py-4 flex ${isRecording ? 'items-center' : 'items-end'} gap-3 md:gap-5 relative min-h-[72px] transition-all duration-300`}>
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {showAttachMenu && (
                <div className="absolute bottom-[80px] left-4 sm:left-6 bg-white border border-slate-100 p-2 rounded-[24px] shadow-2xl flex flex-col gap-1 z-50 animate-in slide-in-from-bottom-4 duration-300 min-w-[220px]">
                    <div className="fixed inset-0 -z-10" onClick={() => setShowAttachMenu(false)} />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-4 px-4 py-4 hover:bg-slate-50 rounded-[20px] text-slate-700 transition-all group"
                    >
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                            <ImageIcon size={20} />
                        </div>
                        <span className="text-[14px] font-bold">Media Content</span>
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-4 px-4 py-4 hover:bg-slate-50 rounded-[20px] text-slate-700 transition-all group"
                    >
                        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center transition-colors group-hover:bg-slate-900 group-hover:text-white">
                            <FileIcon size={20} />
                        </div>
                        <span className="text-[14px] font-bold">Briefs & Docs</span>
                    </button>
                </div>
            )}

            {!isRecording ? (
                <>
                    <button
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        className={`p-2.5 mb-0.5 transition-all rounded-full flex-shrink-0 active:scale-90 ${showAttachMenu ? 'bg-slate-900 text-white shadow-lg rotate-45' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <Plus size={26} />
                    </button>

                    <div className="flex-grow flex items-center bg-slate-50 rounded-[22px] px-5 py-2 border border-transparent focus-within:bg-white focus-within:border-slate-200 focus-within:shadow-md transition-all min-h-[46px]">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Send professional brief..."
                            className="w-full bg-transparent text-slate-900 outline-none text-[15px] font-semibold placeholder:text-slate-400 resize-none py-2 custom-scrollbar leading-snug"
                            style={{ maxHeight: '120px' }}
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 mb-0.5">
                        {text.trim() ? (
                            <button
                                onClick={handleSend}
                                className="bg-slate-900 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
                            >
                                <Send size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={startRecording}
                                className="text-slate-400 hover:text-indigo-600 transition-all p-2.5 hover:bg-indigo-50 rounded-full active:scale-90"
                            >
                                <Mic size={28} />
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex items-center w-full gap-4 animate-in slide-in-from-bottom-2 duration-300">
                    <button
                        onClick={() => stopRecording(false)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-3 rounded-full flex-shrink-0 active:scale-90"
                    >
                        <Trash2 size={24} />
                    </button>

                    <div className="flex-grow flex items-center gap-4 bg-slate-900 text-white px-6 py-3.5 rounded-full overflow-hidden shadow-2xl">
                        <div className="flex items-center gap-3.5 flex-shrink-0">
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
                            <span className="text-white font-mono text-[17px] font-bold tracking-tight">{formatTime(displayTime)}</span>
                        </div>
                        <div className="flex-grow flex justify-center items-center h-8 overflow-hidden opacity-90">
                            <VoiceWaveform analyser={analyser} isRecording={isRecording} />
                        </div>
                    </div>

                    <button
                        onClick={() => stopRecording(true)}
                        className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-indigo-500 shadow-xl shadow-indigo-200 transition-all active:scale-90 flex-shrink-0"
                    >
                        <Send size={20} fill="currentColor" />
                    </button>
                </div>
            )}
        </div>
    );
};
