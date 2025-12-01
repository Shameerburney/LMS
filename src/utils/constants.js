export const ROLES = {
    STUDENT: 'student',
    INSTRUCTOR: 'instructor',
    ADMIN: 'admin',
};

export const CATEGORIES = {
    AI: 'AI',
    PYTHON: 'Python',
    DATA_SCIENCE: 'Data Science',
    ML: 'Machine Learning',
    DL: 'Deep Learning',
    GEN_AI: 'Generative AI',
};

export const DIFFICULTY_LEVELS = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced',
};

export const LESSON_TYPES = {
    VIDEO: 'video',
    READING: 'reading',
    QUIZ: 'quiz',
    ASSIGNMENT: 'assignment',
};

export const NOTIFICATION_TYPES = {
    ACHIEVEMENT: 'achievement',
    COURSE: 'course',
    FORUM: 'forum',
    ANNOUNCEMENT: 'announcement',
};

export const BADGE_TYPES = {
    FIRST_COURSE: 'first_course',
    FIVE_COURSES: 'five_courses',
    PERFECT_QUIZ: 'perfect_quiz',
    WEEK_STREAK: 'week_streak',
    MONTH_STREAK: 'month_streak',
    HELPFUL_ANSWER: 'helpful_answer',
    TOP_LEARNER: 'top_learner',
};

export const XP_REWARDS = {
    COMPLETE_LESSON: 10,
    COMPLETE_QUIZ: 20,
    PERFECT_QUIZ: 50,
    SUBMIT_ASSIGNMENT: 30,
    COMPLETE_COURSE: 100,
    FORUM_POST: 5,
    HELPFUL_ANSWER: 15,
    DAILY_LOGIN: 5,
};

export const LEVEL_THRESHOLDS = [
    0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000,
];
