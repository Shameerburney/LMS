import dbService from './db';

const gamificationService = {
    // Get user gamification data
    async getUserStats(userId) {
        const user = await dbService.get('users', userId);
        return user?.gamification || {
            xp: 0,
            level: 1,
            badges: [],
            streak: 0,
        };
    },

    // Award XP
    async awardXP(userId, amount, reason) {
        const user = await dbService.get('users', userId);
        if (!user) return;

        const currentStats = user.gamification || { xp: 0, level: 1, badges: [], streak: 0 };
        const newXP = currentStats.xp + amount;

        // Calculate level (simple formula: level = floor(sqrt(xp/100)) + 1)
        const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
        const leveledUp = newLevel > currentStats.level;

        const updatedStats = {
            ...currentStats,
            xp: newXP,
            level: newLevel,
        };

        await dbService.update('users', { ...user, gamification: updatedStats });

        return {
            newXP,
            newLevel,
            leveledUp,
            reason
        };
    },

    // Award Badge
    async awardBadge(userId, badgeId) {
        const user = await dbService.get('users', userId);
        if (!user) return;

        const currentStats = user.gamification || { xp: 0, level: 1, badges: [], streak: 0 };

        // Check if already has badge
        if (currentStats.badges.some(b => b.id === badgeId)) return;

        const badges = [
            { id: 'first-course', name: 'First Steps', icon: '🎓', description: 'Completed your first course' },
            { id: 'quiz-master', name: 'Quiz Master', icon: '💯', description: 'Scored 100% on a quiz' },
            { id: 'streak-7', name: 'Week Warrior', icon: '🔥', description: '7-day learning streak' },
            { id: 'social-butterfly', name: 'Helper', icon: '💬', description: 'Posted 10 forum replies' },
        ];

        const badge = badges.find(b => b.id === badgeId);
        if (!badge) return;

        const updatedStats = {
            ...currentStats,
            badges: [...currentStats.badges, { ...badge, earnedAt: Date.now() }],
        };

        await dbService.update('users', { ...user, gamification: updatedStats });
        return badge;
    },

    // Get Leaderboard
    async getLeaderboard() {
        const users = await dbService.getAll('users');
        return users
            .filter(u => u.role === 'student')
            .map(u => ({
                id: u.id,
                name: u.profile.name,
                xp: u.gamification?.xp || 0,
                level: u.gamification?.level || 1,
                badges: u.gamification?.badges?.length || 0,
            }))
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 10); // Top 10
    }
};

export default gamificationService;
