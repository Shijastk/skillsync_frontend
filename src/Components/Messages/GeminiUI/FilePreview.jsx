import React from 'react';
import { FileText, Download, Image as ImageIcon, FileCode } from 'lucide-react';

export const FilePreview = ({ attachment, isOwn }) => {
    const isImage = attachment.type === 'image' || attachment.type.startsWith('image/');
    const isPdf = attachment.type === 'application/pdf' || (attachment.name && attachment.name.endsWith('.pdf'));

    const handleDownload = (e) => {
        e.stopPropagation();
        // Construct download URL: inject fl_attachment for Cloudinary
        let downloadUrl = attachment.url;
        if (downloadUrl.includes('cloudinary.com') && downloadUrl.includes('/upload/')) {
            downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
        }

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = attachment.name || 'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isImage) {
        return (
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow" onClick={handleDownload}>
                <img
                    src={attachment.url}
                    className="w-full max-h-[350px] object-contain bg-white transition-transform duration-500 group-hover:scale-105"
                    alt={attachment.name}
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white p-4 rounded-full shadow-xl active:scale-95 transition-transform">
                        <Download className="text-slate-900" size={24} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all overflow-hidden w-full max-w-full
      ${isOwn ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-sm'}
    `}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
        ${isOwn ? 'bg-white text-slate-900' : 'bg-slate-50 text-indigo-600'}
      `}>
                {isPdf ? <FileText size={22} /> : <FileCode size={22} />}
            </div>
            <div className="flex-grow min-w-0 flex flex-col justify-center">
                <p className="text-[14px] font-bold truncate tracking-tight">{attachment.name}</p>
                <p className={`text-[10px] font-semibold uppercase tracking-widest mt-0.5 ${isOwn ? 'text-white/40' : 'text-slate-400'}`}>{attachment.size}</p>
            </div>
            <button
                onClick={handleDownload}
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isOwn ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
            >
                <Download size={19} />
            </button>
        </div>
    );
};
