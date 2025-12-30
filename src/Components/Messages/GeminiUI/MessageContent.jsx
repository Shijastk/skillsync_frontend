import React from 'react';
import { Code } from 'lucide-react';

export const MessageContent = ({ content, isOwn }) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return (
        <div className="space-y-3">
            {parts.map((part, i) => {
                if (part.startsWith('```')) {
                    const code = part.replace(/```/g, '').trim();
                    return (
                        <div key={i} className={`rounded-xl overflow-hidden my-2 border ${isOwn ? 'border-white/10 bg-black/30' : 'border-slate-100 bg-slate-900 text-slate-50'}`}>
                            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Technical Script</span>
                                <Code size={12} className="opacity-50" />
                            </div>
                            <pre className="p-4 text-[13px] font-mono overflow-x-auto custom-scrollbar leading-relaxed">
                                <code>{code}</code>
                            </pre>
                        </div>
                    );
                }
                return <p key={i} className="text-[14.5px] leading-relaxed whitespace-pre-wrap font-medium">{part}</p>;
            })}
        </div>
    );
};
