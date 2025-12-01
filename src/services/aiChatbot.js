import dbService from './db';
import courseService from './courses';

// AI Chatbot Service - Custom implementation without external APIs
class AIChatbotService {
    constructor() {
        this.patterns = {
            greeting: /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
            progress: /(progress|how am i doing|my performance|track|status)/i,
            recommendation: /(recommend|suggest|what should i|next course|what to learn)/i,
            help: /(help|stuck|don't understand|confused|explain)/i,
            motivation: /(motivate|encourage|give up|tired|frustrated)/i,
            courseInfo: /(tell me about|what is|explain|course)/i,
            quiz: /(quiz|test|assessment|exam)/i,
            certificate: /(certificate|certification|credential)/i,
        };

        this.responses = {
            greeting: [
                "Hello! 👋 I'm your AI learning assistant. How can I help you today?",
                "Hi there! Ready to continue your learning journey? What can I help you with?",
                "Hey! Great to see you. What would you like to know about your progress?",
            ],
            fallback: [
                "I'm here to help! You can ask me about:\n• Your progress and performance\n• Course recommendations\n• Learning tips and motivation\n• Course information",
                "I can help you with progress tracking, course recommendations, and learning support. What would you like to know?",
            ],
        };
    }

    async chat(userId, message) {
        const lowerMessage = message.toLowerCase();

        // Detect intent
        if (this.patterns.greeting.test(lowerMessage)) {
            return this.getRandomResponse(this.responses.greeting);
        }

        if (this.patterns.progress.test(lowerMessage)) {
            return await this.getProgressResponse(userId);
        }

        if (this.patterns.recommendation.test(lowerMessage)) {
            return await this.getRecommendationResponse(userId);
        }

        if (this.patterns.motivation.test(lowerMessage)) {
            return this.getMotivationResponse();
        }

        if (this.patterns.help.test(lowerMessage)) {
            return this.getHelpResponse();
        }

        if (this.patterns.certificate.test(lowerMessage)) {
            return await this.getCertificateResponse(userId);
        }

        // Default fallback
        return this.getRandomResponse(this.responses.fallback);
    }

    async getProgressResponse(userId) {
        try {
            const allProgress = await dbService.getAll('progress');
            const userProgress = allProgress.filter(p => p.userId === userId);

            if (userProgress.length === 0) {
                return "You haven't enrolled in any courses yet! 📚 Check out our course library to get started on your learning journey.";
            }

            const totalCourses = userProgress.length;
            const avgProgress = userProgress.reduce((sum, p) => sum + p.overallProgress, 0) / totalCourses;
            const completedCourses = userProgress.filter(p => p.overallProgress === 100).length;

            let response = `📊 **Your Learning Progress:**\n\n`;
            response += `• Enrolled in ${totalCourses} course${totalCourses > 1 ? 's' : ''}\n`;
            response += `• Completed ${completedCourses} course${completedCourses !== 1 ? 's' : ''}\n`;
            response += `• Average progress: ${avgProgress.toFixed(0)}%\n\n`;

            if (avgProgress < 30) {
                response += "💡 Tip: Try to dedicate at least 30 minutes daily to maintain momentum!";
            } else if (avgProgress < 70) {
                response += "🎯 You're making great progress! Keep up the consistent effort!";
            } else {
                response += "🌟 Excellent work! You're crushing it! Keep going!";
            }

            return response;
        } catch (error) {
            return "I couldn't fetch your progress right now. Please try again!";
        }
    }

    async getRecommendationResponse(userId) {
        try {
            const allCourses = await courseService.getAllCourses();
            const allProgress = await dbService.getAll('progress');
            const userProgress = allProgress.filter(p => p.userId === userId);

            // Get enrolled course IDs
            const enrolledCourseIds = userProgress.map(p => p.courseId);

            // Get courses user is NOT enrolled in
            const availableCourses = allCourses.filter(c => !enrolledCourseIds.includes(c.id));

            if (availableCourses.length === 0) {
                return "🎉 Wow! You're enrolled in all available courses! Check back later for new content.";
            }

            // Simple recommendation: highest rated courses
            const topCourses = availableCourses
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 3);

            let response = "📚 **Recommended Courses for You:**\n\n";
            topCourses.forEach((course, index) => {
                response += `${index + 1}. **${course.title}**\n`;
                response += `   ⭐ ${course.rating} | ${course.category} | ${course.difficulty}\n`;
                response += `   ${course.description.substring(0, 80)}...\n\n`;
            });

            response += "💡 These courses are highly rated and perfect for your learning path!";
            return response;
        } catch (error) {
            return "I couldn't generate recommendations right now. Please try again!";
        }
    }

    getMotivationResponse() {
        const motivationalQuotes = [
            "💪 Remember: Every expert was once a beginner. You're doing great by showing up!",
            "🌟 Learning is a journey, not a race. Take it one step at a time!",
            "🚀 The fact that you're here means you're already ahead of 90% of people. Keep going!",
            "🎯 Consistency beats perfection. Even 15 minutes of learning today is progress!",
            "✨ Your future self will thank you for the effort you're putting in today!",
            "🔥 Challenges are what make life interesting. Overcoming them is what makes it meaningful!",
            "💡 The only way to learn is to do. You're on the right path!",
        ];

        return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    }

    getHelpResponse() {
        return `🤝 **I'm here to help!**\n\nYou can ask me about:\n\n• **Progress**: "How am I doing?" or "Show my progress"\n• **Recommendations**: "What should I learn next?"\n• **Motivation**: "I need motivation"\n• **Certificates**: "How do I get a certificate?"\n\nJust type your question naturally, and I'll do my best to assist you!`;
    }

    async getCertificateResponse(userId) {
        try {
            const certificates = await dbService.getAll('certificates');
            const userCerts = certificates.filter(c => c.userId === userId);

            if (userCerts.length === 0) {
                return "🎓 You haven't earned any certificates yet. Complete a course with 100% progress to earn your first certificate!";
            }

            let response = `🏆 **Your Certificates:**\n\n`;
            response += `You've earned ${userCerts.length} certificate${userCerts.length > 1 ? 's' : ''}!\n\n`;
            response += "Keep completing courses to earn more credentials and boost your portfolio!";

            return response;
        } catch (error) {
            return "I couldn't fetch your certificates right now. Please try again!";
        }
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    async saveMessage(userId, message, isBot = false) {
        try {
            const chatMessage = {
                id: `msg-${Date.now()}-${Math.random()}`,
                userId,
                message,
                isBot,
                timestamp: Date.now(),
            };

            await dbService.add('chatHistory', chatMessage);
            return chatMessage;
        } catch (error) {
            console.error('Error saving message:', error);
        }
    }

    async getChatHistory(userId) {
        try {
            const allMessages = await dbService.getAll('chatHistory');
            return allMessages
                .filter(m => m.userId === userId)
                .sort((a, b) => a.timestamp - b.timestamp);
        } catch (error) {
            console.error('Error fetching chat history:', error);
            return [];
        }
    }

    async clearHistory(userId) {
        try {
            const allMessages = await dbService.getAll('chatHistory');
            const userMessages = allMessages.filter(m => m.userId === userId);

            for (const msg of userMessages) {
                await dbService.delete('chatHistory', msg.id);
            }
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    }
}

export default new AIChatbotService();
