import React from 'react';
import { Calendar, Clock, MessageCircle, Users, Star } from 'lucide-react';
import { Avatar, Badge, Button, Card } from '../common';


const SwapCard = ({ swap }) => {
    const { participants, skills, status, meta, sessions, actions, isTriangle, progress } = swap;


    // Progress section component
    const ProgressSection = () => (
        <Card noPadding className="bg-gray-50 p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-900">Progress</span>
                <span className="text-sm text-gray-600">{progress}% Complete</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div
                    className="h-full bg-gradient-to-r from-gray-700 to-gray-900 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            {sessions && sessions.length > 0 && (
                <div className="space-y-2">
                    {sessions.map((session, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center p-3 bg-white rounded-md ${session.status === 'Today' ? 'ring-2 ring-yellow-200' : ''
                                }`}
                        >
                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                <Calendar size={16} />
                                {session.date}
                            </span>
                            <Badge
                                variant={
                                    session.status === 'Completed'
                                        ? 'success'
                                        : session.status === 'Today'
                                            ? 'warning'
                                            : 'info'
                                }
                                size="sm"
                            >
                                {session.status}
                            </Badge>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );

    // Triangle Swap (3-way)
    if (isTriangle) {
        return (
            <Card className="border-2 border-purple-500">
                <div className="flex items-center justify-between mb-3">
                    <Badge variant="primary" className="bg-gradient-to-r from-indigo-500 to-purple-600">
                        TRIANGLE SWAP
                    </Badge>
                    <Badge variant={status === 'Active' ? 'success' : 'default'}>{status}</Badge>
                </div>

                <p className="text-sm text-gray-600 mb-5">3-way skill exchange</p>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    {participants.map((participant, index) => (
                        <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                            <Avatar
                                src={participant.avatar}
                                initials={participant.initials}
                                name={participant.name}
                                size="md"
                                className="mx-auto mb-3"
                            />
                            <div className="text-sm font-semibold mb-1 truncate">{participant.name}</div>
                            <div className="text-xs text-gray-600 mb-2 truncate">{participant.role}</div>
                            <div className="text-xs text-gray-500 mb-1">↓ Teaching</div>
                            <div className="text-sm font-medium truncate">{participant.teaches}</div>
                        </div>
                    ))}
                </div>

                <Card noPadding className="bg-gray-100 p-3 mb-4 text-center">
                    <div className="text-sm text-gray-600">
                        You're learning: <strong>SEO & Marketing</strong> from David
                    </div>
                </Card>

                <ProgressSection />

                <div className="flex flex-wrap gap-4 py-4 border-t border-gray-200 mb-4 text-sm text-gray-600">
                    {meta.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {index === 0 && <Calendar size={16} />}
                            {index === 1 && <Clock size={16} />}
                            {index === 2 && <Users size={16} />}
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    {actions.map((action, index) => (
                        <Button key={index} variant={action.variant} size="md" fullWidth>
                            {action.label}
                        </Button>
                    ))}
                </div>
            </Card>
        );
    }

    // Regular 1:1 Swap
    return (
        <Card hoverable>
            {/* Participants Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    {participants.map((participant, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <div className="text-2xl text-gray-300 mx-2">⟷</div>}
                            <div className="flex items-center gap-3 min-w-0">
                                <Avatar
                                    src={participant.avatar}
                                    initials={participant.initials}
                                    name={participant.name}
                                    size="lg"
                                />
                                <div className="min-w-0 overflow-hidden">
                                    <h3 className="text-base font-semibold truncate">{participant.name}</h3>
                                    <p className="text-xs text-gray-600 truncate">{participant.role}</p>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <Badge variant={status === 'Active' ? 'success' : 'default'}>{status}</Badge>
            </div>

            {/* Skills Exchange */}
            <div className="grid lg:grid-cols-3 items-center gap-6 bg-gray-50 p-5 rounded-lg mb-5">
                <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        {status === 'Completed' ? 'You Taught' : 'You Teach'}
                    </div>
                    <div className="font-semibold text-gray-900 mb-1 truncate">{skills.teach}</div>
                    <div className="text-sm text-gray-600 truncate">{skills.teachMeta}</div>
                </div>
                <div className="text-center text-2xl text-gray-400">⟷</div>
                <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        {status === 'Completed' ? 'You Learned' : 'You Learn'}
                    </div>
                    <div className="font-semibold text-gray-900 mb-1 truncate">{skills.learn}</div>
                    <div className="text-sm text-gray-600 truncate">{skills.learnMeta}</div>
                </div>
            </div>

            {/* Progress */}
            {status !== 'Pending' && <ProgressSection />}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 py-4 border-t border-gray-200 mb-4 text-sm text-gray-600">
                {meta.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {index === 0 && <Calendar size={16} />}
                        {index === 1 && <Clock size={16} />}
                        {index === 2 && (item.label.includes('Rating') ? <Star size={16} /> : <MessageCircle size={16} />)}
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        variant={action.variant}
                        size="md"
                        fullWidth
                        onClick={action.onClick}
                    >
                        {action.label}
                    </Button>
                ))}
            </div>
        </Card>
    );
};

export default SwapCard;
