import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    connect(userId) {
        if (this.socket && this.connected) {
            console.log('Socket already connected');
            return this.socket;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No auth token found for socket connection');
            return null;
        }

        this.socket = io(SOCKET_URL, {
            auth: {
                token
            },
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected:', this.socket.id);
            this.connected = true;

            // Join user's personal room
            if (userId) {
                this.socket.emit('join', { userId });
            }
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            this.connected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    }

    // Join conversation room
    joinConversation(conversationId) {
        if (this.socket && this.connected) {
            this.socket.emit('join_conversation', { conversationId });
        }
    }

    // Leave conversation room
    leaveConversation(conversationId) {
        if (this.socket && this.connected) {
            this.socket.emit('leave_conversation', { conversationId });
        }
    }

    // Send typing indicator
    sendTyping(conversationId, userId) {
        if (this.socket && this.connected) {
            this.socket.emit('typing', { conversationId, userId });
        }
    }

    // Stop typing indicator
    stopTyping(conversationId, userId) {
        if (this.socket && this.connected) {
            this.socket.emit('stop_typing', { conversationId, userId });
        }
    }

    // Listen for new messages
    onMessage(callback) {
        if (this.socket) {
            this.socket.on('receive_message', callback);
        }
    }

    // Listen for typing
    onTyping(callback) {
        if (this.socket) {
            this.socket.on('user_typing', callback);
        }
    }

    // Listen for stop typing
    onStopTyping(callback) {
        if (this.socket) {
            this.socket.on('user_stopped_typing', callback);
        }
    }

    // Listen for notifications
    onNotification(callback) {
        if (this.socket) {
            this.socket.on('notification', callback);
        }
    }

    // Listen for user online status
    onUserOnline(callback) {
        if (this.socket) {
            this.socket.on('user_online', callback);
        }
    }

    // Listen for user offline status
    onUserOffline(callback) {
        if (this.socket) {
            this.socket.on('user_offline', callback);
        }
    }

    // Remove event listener
    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    // Get socket instance
    getSocket() {
        return this.socket;
    }

    // Check if connected
    isConnected() {
        return this.connected;
    }
}

// Export singleton instance
export default new SocketService();
