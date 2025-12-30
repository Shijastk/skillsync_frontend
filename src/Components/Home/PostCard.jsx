import React from 'react';
import {
  Heart, MessageCircle, Bookmark, RefreshCw, MoreVertical,
  Clock, Target, Calendar, Award, UserCheck, Share2
} from 'lucide-react';


const PostCard = ({ post, isLiked, isSaved, onLike, onSave, onSwap, onReport, hasActiveSwap, swapStatus }) => {

  const renderContentSpecifics = () => {
    switch (post.type) {
      case "swap":
        return (
          <div className="mt-4 bg-gray-50/80 border border-gray-100 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 text-green-700 rounded-lg">
                  <Target size={16} />
                </div>
                <span className="text-sm font-semibold text-gray-900">Skill Exchange</span>
              </div>
              <div className="flex items-center gap-3">
                {post.isOnline && (
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-100 text-green-700 text-xs font-medium rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Online
                  </span>
                )}
                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">{post.distance}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Vertical Separator for Desktop */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -ml-px"></div>

              <div>
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Teaches</h5>
                <div className="flex flex-wrap gap-2">
                  {post.teaches?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Wants to Learn</h5>
                <div className="flex flex-wrap gap-2">
                  {post.wants?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-500">
                <Clock size={14} />
                <span className="text-xs font-medium">{post.duration}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Match Score</span>
                <span className={`text-lg font-bold ${post.matchScore >= 90 ? 'text-green-600' :
                    post.matchScore >= 75 ? 'text-indigo-600' :
                      'text-amber-600'
                  }`}>
                  {post.matchScore}%
                </span>
              </div>
            </div>
          </div>
        );

      case "achievement":
        return (
          <div className="mt-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-6">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Award size={120} />
            </div>
            <div className="relative z-10 flex items-center gap-5">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm text-amber-500 border border-amber-100">
                <Award size={32} />
              </div>
              <div>
                <div className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-1">Milestone Unlocked</div>
                <h3 className="text-2xl font-bold text-gray-900">{post.badge}</h3>
                <p className="text-amber-700/80 text-sm mt-1">Completed {post.achievementCount} successful swaps</p>
              </div>
            </div>
          </div>
        );

      case "event":
        return (
          <div className="mt-4 bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-xl border border-blue-100 shadow-sm text-blue-600">
                  <span className="text-xs font-bold uppercase">Fri</span>
                  <span className="text-lg font-bold">12</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{post.eventDetails?.type}</h4>
                  <div className="flex items-center gap-2 text-sm text-blue-800 mt-1">
                    <Clock size={14} />
                    <span>{post.eventDetails?.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {post.eventDetails?.spotsLeft} spots left
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                Register Now
              </button>
              <button className="px-6 py-2.5 bg-white text-blue-700 border border-blue-200 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                Details
              </button>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="mt-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck size={18} className="text-emerald-600" />
              <span className="font-bold text-gray-900">Success Story</span>
              {post.verified && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Verified</span>}
            </div>
            <div className="flex flex-col md:flex-row gap-4 bg-white/60 rounded-xl p-4 border border-emerald-100/50">
              <div className="flex-1">
                <span className="text-xs text-emerald-800 font-medium">Learned</span>
                <div className="font-semibold text-gray-900">{post.learned}</div>
              </div>
              <div className="hidden md:block w-px bg-emerald-200"></div>
              <div className="flex-1">
                <span className="text-xs text-emerald-800 font-medium">Outcome</span>
                <div className="font-semibold text-gray-900">{post.outcome}</div>
              </div>
            </div>
          </div>
        )

      default:
        return null;
    }
  };

  return (
    <article className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${post.avatar.color} flex items-center justify-center text-white font-bold text-lg shadow-sm ring-4 ring-gray-50`}>
              {post.avatar.icon || post.avatar.initials}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">{post.user}</h3>
              <p className="text-xs text-gray-500 font-medium">{post.role}</p>
              <p className="text-xs text-gray-400 mt-0.5">{post.time}</p>
            </div>
          </div>
          <button
            onClick={() => onReport && onReport(post.id)}
            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
            title="Report"
          >
            <MoreVertical size={20} />
          </button>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-2">
          {post.content}
        </p>

        {/* Image Display - from backend */}
        {post.image && (
          <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
            <img
              src={post.image}
              alt="Post image"
              className="w-full h-auto object-cover max-h-96"
              loading="lazy"
            />
          </div>
        )}

        {renderContentSpecifics()}

        {post.tags && (
          <div className="flex flex-wrap gap-2 mt-5">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-xs font-medium text-gray-500 hover:text-indigo-600 cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex gap-6">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-rose-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-pulse" : ""} />
            <span>{post.metrics.likes}</span>
          </button>

          <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            <MessageCircle size={20} />
            <span>{post.metrics.comments || 0}</span>
          </button>

          <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            <Share2 size={20} />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSave(post.id)}
            className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-yellow-50 text-yellow-500' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
          >
            <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
          </button>
          {post.type === 'swap' && (
            <button
              onClick={() => !hasActiveSwap && onSwap && onSwap(post)}
              disabled={hasActiveSwap}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm
                  ${hasActiveSwap
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
            >
              {hasActiveSwap ? (
                <>
                  <Clock size={16} />
                  <span>{swapStatus === 'pending' ? 'Request Sent' : 'Active'}</span>
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  <span>Swap</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;