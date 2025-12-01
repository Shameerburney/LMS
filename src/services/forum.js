import dbService from './db';

const forumService = {
    // Create a new thread
    async createThread(threadData) {
        const thread = {
            ...threadData,
            id: `thread-${Date.now()}`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            views: 0,
            upvotes: 0,
            replies: [],
            isPinned: false,
        };
        return await dbService.add('forum', thread);
    },

    // Get all threads
    async getAllThreads() {
        return await dbService.getAll('forum');
    },

    // Get thread by ID
    async getThread(id) {
        return await dbService.get('forum', id);
    },

    // Add reply to thread
    async addReply(threadId, replyData) {
        const thread = await this.getThread(threadId);
        if (!thread) throw new Error('Thread not found');

        const reply = {
            ...replyData,
            id: `reply-${Date.now()}`,
            createdAt: Date.now(),
            upvotes: 0,
            isBestAnswer: false,
        };

        const updatedThread = {
            ...thread,
            replies: [...thread.replies, reply],
            updatedAt: Date.now(),
        };

        return await dbService.update('forum', updatedThread);
    },

    // Toggle upvote (simplified for demo)
    async toggleUpvote(threadId) {
        const thread = await this.getThread(threadId);
        if (!thread) return;

        const updatedThread = {
            ...thread,
            upvotes: thread.upvotes + 1,
        };

        return await dbService.update('forum', updatedThread);
    }
};

export default forumService;
