import apiClient from './apiClient';

// Authentication Services
export const authService = {
    login: async (credentials) => {
        // Fetch all users and find matching credentials
        const { data: users } = await apiClient.get('/users');
        const user = users.find(
            (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
            const { password, ...userWithoutPassword } = user;
            return {
                success: true,
                user: userWithoutPassword,
                token: `fake-jwt-token-${user.id}`,
            };
        } else {
            throw new Error('Invalid email or password');
        }
    },

    register: async (userData) => {
        // Check if user already exists
        const { data: users } = await apiClient.get('/users');
        const existingUser = users.find((u) => u.email === userData.email);

        if (existingUser) {
            throw new Error('User already exists');
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            avatar: `https://i.pravatar.cc/150?img=${users.length + 1}`,
            bio: '',
            location: '',
            skillsToTeach: [],
            skillsToLearn: [],
            credits: 50,
            joinedDate: new Date().toISOString(),
            isActive: true,
        };

        const { data: createdUser } = await apiClient.post('/users', newUser);
        const { password, ...userWithoutPassword } = createdUser;

        return {
            success: true,
            user: userWithoutPassword,
            token: `fake-jwt-token-${createdUser.id}`,
        };
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },
};

// Users Services
export const usersService = {
    getAll: async () => {
        const { data } = await apiClient.get('/users');
        return data;
    },

    getById: async (id) => {
        const { data } = await apiClient.get(`/users/${id}`);
        return data;
    },

    update: async (id, userData) => {
        const { data } = await apiClient.patch(`/users/${id}`, userData);
        return data;
    },

    delete: async (id) => {
        const { data } = await apiClient.delete(`/users/${id}`);
        return data;
    },
};

// Swaps Services
export const swapsService = {
    getAll: async () => {
        const { data } = await apiClient.get('/swaps');
        return data;
    },

    getById: async (id) => {
        const { data } = await apiClient.get(`/swaps/${id}`);
        return data;
    },

    create: async (swapData) => {
        const { data } = await apiClient.post('/swaps', swapData);
        return data;
    },

    update: async (id, swapData) => {
        const { data } = await apiClient.patch(`/swaps/${id}`, swapData);
        return data;
    },

    delete: async (id) => {
        const { data } = await apiClient.delete(`/swaps/${id}`);
        return data;
    },

    getUserSwaps: async (userId) => {
        const [reqRes, recRes] = await Promise.all([
            apiClient.get(`/swaps?requesterId=${userId}`),
            apiClient.get(`/swaps?receiverId=${userId}`)
        ]);
        const allSwaps = [...reqRes.data, ...recRes.data];
        // Dedup based on ID
        const uniqueSwaps = Array.from(new Map(allSwaps.map(item => [item.id, item])).values());
        return uniqueSwaps;
    },
};

// Groups Services
export const groupsService = {
    getAll: async () => {
        const { data } = await apiClient.get('/groups');
        return data;
    },

    getById: async (id) => {
        const { data } = await apiClient.get(`/groups/${id}`);
        return data;
    },

    create: async (groupData) => {
        const { data } = await apiClient.post('/groups', groupData);
        return data;
    },

    update: async (id, groupData) => {
        const { data } = await apiClient.patch(`/groups/${id}`, groupData);
        return data;
    },

    delete: async (id) => {
        const { data } = await apiClient.delete(`/groups/${id}`);
        return data;
    },
};

// Messages Services
export const messagesService = {
    getConversations: async () => {
        const { data } = await apiClient.get('/conversations');
        return data;
    },

    getMessages: async (conversationId) => {
        const { data } = await apiClient.get(`/messages?conversationId=${conversationId}`);
        return data;
    },

    sendMessage: async (messageData) => {
        const { data } = await apiClient.post('/messages', messageData);
        return data;
    },

    markAsRead: async (messageId) => {
        const { data } = await apiClient.patch(`/messages/${messageId}`, { isRead: true });
        return data;
    },

    createConversation: async (conversationData) => {
        const { data } = await apiClient.post('/conversations', conversationData);
        return data;
    },
};

// Transactions Services
export const transactionsService = {
    getAll: async () => {
        const { data } = await apiClient.get('/transactions');
        return data;
    },

    getUserTransactions: async (userId) => {
        const { data } = await apiClient.get(`/transactions?userId=${userId}`);
        return data;
    },

    create: async (transactionData) => {
        const { data } = await apiClient.post('/transactions', transactionData);
        return data;
    },
};

// Posts Services
export const postsService = {
    getAll: async () => {
        const { data } = await apiClient.get('/posts?_sort=timestamp&_order=desc');
        return data;
    },
    create: async (postData) => {
        const { data } = await apiClient.post('/posts', postData);
        return data;
    },
    update: async (id, postData) => {
        const { data } = await apiClient.patch(`/posts/${id}`, postData);
        return data;
    },
    addComment: async (postId, comment) => {
        // Fetch post first to get current comments
        const { data: post } = await apiClient.get(`/posts/${postId}`);
        const updatedComments = [...(post.comments || []), comment];
        const { data } = await apiClient.patch(`/posts/${postId}`, { comments: updatedComments });
        return data;
    }
};
