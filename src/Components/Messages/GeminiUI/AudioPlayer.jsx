import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, AlertCircle } from 'lucide-react';

export const AudioPlayer = ({ url, duration, isOwn }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [waveform, setWaveform] = useState([]);
    const audioRef = useRef(null);

    useEffect(() => {
        const generateWaveform = async () => {
            try {
                // If url is a blob url, we can try to fetch it
                // If it's a remote url, CORS might be an issue for AudioContext decoding if not configured
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                const rawData = audioBuffer.getChannelData(0);
                const samples = 40;
                const blockSize = Math.floor(rawData.length / samples);
                const peaks = [];

                for (let i = 0; i < samples; i++) {
                    let blockStart = blockSize * i;
                    let sum = 0;
                    for (let j = 0; j < blockSize; j++) {
                        sum = sum + Math.abs(rawData[blockStart + j]);
                    }
                    peaks.push(sum / blockSize);
                }

                const max = Math.max(...peaks);
                const normalized = peaks.map(p => Math.max(4, (p / max) * 18));
                setWaveform(normalized);
                await audioContext.close();
            } catch (err) {
                console.error("Waveform generation error:", err);
                setWaveform([...Array(40)].map(() => 4 + Math.random() * 12));
            }
        };

        setIsPlaying(false);
        setProgress(0);
        setHasError(false);
        generateWaveform();

        if (audioRef.current) {
            audioRef.current.load();
        }
    }, [url]);

    const togglePlay = () => {
        if (hasError) return;
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play().catch(() => {
                setHasError(true);
                setIsPlaying(false);
            });
        }
        setIsPlaying(!isPlaying);
    };

    const onTimeUpdate = () => {
        if (audioRef.current && audioRef.current.duration) {
            const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(p || 0);
        }
    };

    return (
        <div className={`flex items-center gap-4 py-2 pr-2 min-w-[280px]`}>
            <button
                onClick={togglePlay}
                disabled={hasError}
                className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm
          ${hasError ? 'bg-red-50 text-red-400 cursor-not-allowed' :
                        isOwn ? 'bg-white text-slate-900 active:bg-slate-100' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}
        `}
            >
                {hasError ? <AlertCircle size={24} /> :
                    isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>

            <div className="flex-grow flex flex-col gap-2 justify-center">
                <div className="h-[28px] flex items-center gap-[3px] relative w-full overflow-hidden">
                    {waveform.length > 0 ? (
                        waveform.map((height, i) => {
                            const barProgress = (i / waveform.length) * 100;
                            const isActive = progress > barProgress;
                            return (
                                <div
                                    key={i}
                                    className={`w-[3px] rounded-full transition-all duration-300 ${hasError ? 'bg-red-100' :
                                            isActive
                                                ? (isOwn ? 'bg-indigo-400' : 'bg-indigo-600')
                                                : (isOwn ? 'bg-white/20' : 'bg-slate-200')
                                        }`}
                                    style={{ height: `${height}px` }}
                                />
                            );
                        })
                    ) : (
                        <div className="flex items-center gap-[3px] animate-pulse">
                            {[...Array(40)].map((_, i) => (
                                <div key={i} className="w-[3px] h-3 bg-slate-100 rounded-full" />
                            ))}
                        </div>
                    )}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={progress}
                        disabled={hasError}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (audioRef.current && audioRef.current.duration) {
                                audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
                                setProgress(val);
                            }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full z-10"
                    />
                </div>

                <div className={`text-[10px] font-bold tracking-[0.15em] uppercase flex items-center justify-between ${hasError ? 'text-red-400' : isOwn ? 'text-white/40' : 'text-slate-400'}`}>
                    <span>{hasError ? 'Load Error' : (duration || '0:00')}</span>
                    <span className="opacity-60">Exchange Note</span>
                </div>
            </div>

            <audio
                ref={audioRef}
                src={url}
                onTimeUpdate={onTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onError={() => setHasError(true)}
                preload="metadata"
                className="hidden"
            />
        </div>
    );
};
