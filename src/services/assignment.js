import dbService from './db';

const assignmentService = {
    // Create a new assignment
    async createAssignment(assignmentData) {
        const assignment = {
            ...assignmentData,
            id: `assign-${Date.now()}`,
            createdAt: Date.now(),
        };
        return await dbService.add('assignments', assignment);
    },

    // Get assignment by ID
    async getAssignment(id) {
        return await dbService.get('assignments', id);
    },

    // Get assignments for a lesson
    async getAssignmentsByLesson(lessonId) {
        return await dbService.getAllByIndex('assignments', 'lessonId', lessonId);
    },

    // Submit assignment
    async submitAssignment(submissionData) {
        const submission = {
            ...submissionData,
            id: `sub-${Date.now()}`,
            type: 'assignment',
            submittedAt: Date.now(),
            graded: false,
        };
        return await dbService.add('submissions', submission);
    },

    // Grade submission
    async gradeSubmission(submissionId, gradeData) {
        const submission = await dbService.get('submissions', submissionId);
        if (!submission) throw new Error('Submission not found');

        const updatedSubmission = {
            ...submission,
            ...gradeData,
            graded: true,
            gradedAt: Date.now(),
        };

        return await dbService.update('submissions', updatedSubmission);
    }
};

export default assignmentService;
