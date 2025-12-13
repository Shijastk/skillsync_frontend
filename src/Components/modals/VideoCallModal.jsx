import React, { useRef, useState, useEffect } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Video, PhoneOff, Mic, MicOff, Camera, CameraOff } from 'lucide-react';

const VideoCallModal = ({ roomName, userName, onClose, isAudioOnly = false }) => {
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(isAudioOnly);
    const apiRef = useRef(null);

    const handleReadyToClose = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
            {/* Custom Header/Controls Overlay could go here if minimizing */}
            <div className="relative flex-1">
                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={roomName}
                    configOverwrite={{
                        startWithAudioMuted: false,
                        startWithVideoMuted: isAudioOnly,
                        disableDeepLinking: true,
                        prejoinPageEnabled: false,
                        toolbarButtons: [
                            'camera',
                            'chat',
                            'closedcaptions',
                            'desktop',
                            'download',
                            'embedmeeting',
                            'etherpad',
                            'feedback',
                            'filmstrip',
                            'fullscreen',
                            'hangup',
                            'help',
                            'highlight',
                            'invite',
                            'linktosalesforce',
                            'livestreaming',
                            'microphone',
                            'noisesuppression',
                            'participants-pane',
                            'profile',
                            'raisehand',
                            'recording',
                            'security',
                            'select-background',
                            'settings',
                            'shareaudio',
                            'sharedvideo',
                            'shortcuts',
                            'stats',
                            'tileview',
                            'toggle-camera',
                            'videoquality',
                            'whiteboard',
                        ],
                    }}
                    userInfo={{
                        displayName: userName
                    }}
                    onApiReady={(externalApi) => {
                        apiRef.current = externalApi;
                        // Listener for hangup
                        externalApi.on('videoConferenceLeft', handleReadyToClose);
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '100%';
                        iframeRef.style.width = '100%';
                    }}
                />
            </div>

            {/* Fallback Close button if Jitsi UI fails or is confusing */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg z-[60]"
                title="End Call"
            >
                <PhoneOff size={24} />
            </button>
        </div>
    );
};

export default VideoCallModal;
