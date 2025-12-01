import dbService from './db';

const quizService = {
    // Create a new quiz
    async createQuiz(quizData) {
        const quiz = {
            ...quizData,
            id: `quiz-${Date.now()}`,
            createdAt: Date.now(),
        };
        return await dbService.add('quizzes', quiz);
    },

    // Get quiz by ID
    async getQuiz(id) {
        return await dbService.get('quizzes', id);
    },

    // Get all quizzes
    async getAllQuizzes() {
        return await dbService.getAll('quizzes');
    },

    // Get quizzes for a lesson
    async getQuizzesByLesson(lessonId) {
        return await dbService.getAllByIndex('quizzes', 'lessonId', lessonId);
    },

    // Submit quiz answers
    async submitQuiz(submissionData) {
        const submission = {
            ...submissionData,
            id: `sub-${Date.now()}`,
            type: 'quiz',
            submittedAt: Date.now(),
        };

        // Auto-grade if possible
        if (submission.answers && submission.quiz) {
            let score = 0;
            let totalPoints = 0;

            submission.quiz.questions.forEach(q => {
                totalPoints += q.points;
                if (q.type === 'mcq' || q.type === 'true-false') {
                    if (submission.answers[q.id] === q.correctAnswer) {
                        score += q.points;
                    }
                }
            });

            submission.score = (score / totalPoints) * 100;
            submission.gradedAt = Date.now();
        }

        return await dbService.add('submissions', submission);
    },

    // Get student submissions
    async getStudentSubmissions(studentId) {
        return await dbService.getAllByIndex('submissions', 'studentId', studentId);
    }
};

export default quizService;
