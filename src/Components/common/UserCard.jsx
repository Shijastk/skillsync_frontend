import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User } from 'lucide-react';
import { Avatar, Badge, Button, Card, Rating } from '../common';

/**
 * UserCard - Reusable user card component for discovery/listings
 */
const UserCard = ({ user, onRequest, viewMode = 'grid' }) => {
    const isListMode = viewMode === 'list';

    return (
        <Card
            className="hover:shadow-lg transition-all duration-200 border-gray-200 h-full"
            noPadding
        >
            <div className={`
                h-full
                ${isListMode ? 'flex items-center p-6 gap-6' : 'flex flex-col p-6'}
            `}>

                {/* 1. Avatar Section */}
                <div className={`
                    flex-shrink-0
                    ${isListMode ? '' : 'text-center mb-4 flex flex-col items-center'}
                `}>
                    <Avatar
                        name={user.name}
                        initials={user.initials}
                        size={isListMode ? 'xl' : 'lg'}
                        className="mb-2"
                    />

                    {!isListMode && (
                        <div className="flex items-center gap-1 mt-1">
                            <Rating value={user.rating} size="sm" />
                            <span className="text-sm font-medium text-gray-700 ml-1">
                                {user.rating}
                            </span>
                        </div>
                    )}
                </div>

                {/* 2. Info Section */}
                <div className={`
                    flex-1 
                    ${isListMode ? 'min-w-0' : 'text-center flex flex-col items-center w-full'}
                `}>
                    <div className="mb-1">
                        <h3 className="font-bold text-lg text-gray-900 truncate">
                            {user.name}
                        </h3>
                        {isListMode && (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-600">{user.role}</span>
                                <span className="text-gray-300">•</span>
                                <Rating value={user.rating} size="xs" />
                                <span className="text-xs text-gray-500">({user.swaps} swaps)</span>
                            </div>
                        )}
                    </div>

                    {!isListMode && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{user.role}</p>
                    )}

                    <div className={`flex items-center gap-1 text-gray-500 text-sm mb-4 ${isListMode ? '' : 'justify-center'}`}>
                        <MapPin size={14} />
                        <span>{user.location}</span>
                    </div>

                    {/* Skills */}
                    <div className="mb-4 w-full">
                        {!isListMode && (
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                Teaches
                            </div>
                        )}
                        <div className={`flex flex-wrap gap-2 ${isListMode ? '' : 'justify-center'}`}>
                            {user.skills?.slice(0, isListMode ? 6 : 3).map((skill, idx) => (
                                <Badge key={idx} variant="secondary" size="sm" className="bg-gray-100 text-gray-700 border-gray-200">
                                    {skill}
                                </Badge>
                            ))}
                            {user.skills?.length > (isListMode ? 6 : 3) && (
                                <span className="text-xs text-gray-400 py-1 px-2">+more</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Actions Section */}
                <div className={`
                    ${isListMode ? 'flex-shrink-0 w-36 flex flex-col gap-3 ml-auto' : 'mt-auto grid grid-cols-2 gap-2 w-full pt-2'}
                `}>
                    <Link to={`/profile/${user.id}`} className={isListMode ? 'w-full' : ''}>
                        <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            leftIcon={isListMode ? null : <User size={16} />}
                        >
                            View
                        </Button>
                    </Link>
                    <Button
                        variant={user.hasActiveSwap ? "secondary" : "primary"}
                        size="sm"
                        fullWidth
                        onClick={() => !user.hasActiveSwap && onRequest(user)}
                        disabled={user.hasActiveSwap}
                    >
                        {user.hasActiveSwap ? (user.swapStatus === 'pending' ? 'Requested' : 'Active') : 'Request'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default UserCard;
