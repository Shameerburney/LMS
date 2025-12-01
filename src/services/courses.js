import dbService from './db';
import { generateId } from '../utils/helpers';
import { CATEGORIES, DIFFICULTY_LEVELS } from '../utils/constants';

// Sample course data
const sampleCourses = [
    {
        id: generateId(),
        title: 'Introduction to Artificial Intelligence',
        description: 'Learn the fundamentals of AI, including machine learning, neural networks, and deep learning. Perfect for beginners who want to understand how AI works.',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2MzY2ZjE7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxNGI4YTY7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QUkgRnVuZGFtZW50YWxzPC90ZXh0Pjwvc3ZnPg==',
        instructor: 'instructor-1',
        category: CATEGORIES.AI,
        difficulty: DIFFICULTY_LEVELS.BEGINNER,
        duration: 40,
        lessons: [],
        enrolledStudents: [],
        rating: 4.8,
        reviews: [],
        tags: ['AI', 'Machine Learning', 'Neural Networks'],
        prerequisites: ['Basic programming knowledge'],
        learningOutcomes: [
            'Understand AI fundamentals',
            'Learn about machine learning algorithms',
            'Build simple AI models',
        ],
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now(),
        published: true,
    },
    {
        id: generateId(),
        title: 'Python for Data Science',
        description: 'Master Python programming for data analysis, visualization, and machine learning. Includes NumPy, Pandas, Matplotlib, and Scikit-learn.',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlYzQ4OTk7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2MzY2ZjE7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UHl0aG9uIERhdGEgU2NpZW5jZTwvdGV4dD48L3N2Zz4=',
        instructor: 'instructor-1',
        category: CATEGORIES.PYTHON,
        difficulty: DIFFICULTY_LEVELS.BEGINNER,
        duration: 35,
        lessons: [],
        enrolledStudents: [],
        rating: 4.9,
        reviews: [],
        tags: ['Python', 'Data Science', 'Pandas', 'NumPy'],
        prerequisites: ['None'],
        learningOutcomes: [
            'Master Python programming',
            'Analyze data with Pandas',
            'Create visualizations',
        ],
        createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now(),
        published: true,
    },
    {
        id: generateId(),
        title: 'Deep Learning with Neural Networks',
        description: 'Advanced course on deep learning, covering CNNs, RNNs, LSTMs, and Transformers. Build state-of-the-art AI models.',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4YjVjZjY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlYzQ4OTk7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RGVlcCBMZWFybmluZzwvdGV4dD48L3N2Zz4=',
        instructor: 'instructor-1',
        category: CATEGORIES.DL,
        difficulty: DIFFICULTY_LEVELS.ADVANCED,
        duration: 60,
        lessons: [],
        enrolledStudents: [],
        rating: 4.7,
        reviews: [],
        tags: ['Deep Learning', 'Neural Networks', 'CNN', 'RNN'],
        prerequisites: ['Python', 'Machine Learning basics'],
        learningOutcomes: [
            'Build deep neural networks',
            'Implement CNNs and RNNs',
            'Work with Transformers',
        ],
        createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now(),
        published: true,
    },
    {
        id: generateId(),
        title: 'Generative AI and Large Language Models',
        description: 'Explore the world of Generative AI, including GPT, DALL-E, and Stable Diffusion. Learn to build AI applications.',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxNGI4YTY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmNTllMGI7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R2VuZXJhdGl2ZSBBSTwvdGV4dD48L3N2Zz4=',
        instructor: 'instructor-1',
        category: CATEGORIES.GEN_AI,
        difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
        duration: 45,
        lessons: [],
        enrolledStudents: [],
        rating: 4.9,
        reviews: [],
        tags: ['Generative AI', 'LLM', 'GPT', 'AI Applications'],
        prerequisites: ['Python', 'Deep Learning basics'],
        learningOutcomes: [
            'Understand LLMs',
            'Build AI applications',
            'Fine-tune models',
        ],
        createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now(),
        published: true,
    },
];

export const courseService = {
    async initializeSampleData() {
        try {
            const existingCourses = await dbService.getAll('courses');
            if (existingCourses.length === 0) {
                for (const course of sampleCourses) {
                    await dbService.add('courses', course);
                }
                console.log('Sample courses initialized');
            }
        } catch (error) {
            console.error('Error initializing sample data:', error);
        }
    },

    async getAllCourses() {
        return await dbService.getAll('courses');
    },

    async getCourse(id) {
        return await dbService.get('courses', id);
    },

    async getCoursesByCategory(category) {
        const courses = await dbService.getAll('courses');
        return courses.filter((c) => c.category === category && c.published);
    },

    async enrollInCourse(userId, courseId) {
        const course = await dbService.get('courses', courseId);
        if (!course.enrolledStudents.includes(userId)) {
            course.enrolledStudents.push(userId);
            await dbService.update('courses', course);

            // Create progress record
            const progress = {
                id: generateId(),
                userId,
                courseId,
                completedLessons: [],
                quizScores: [],
                assignmentSubmissions: [],
                overallProgress: 0,
                timeSpent: 0,
                lastAccessed: Date.now(),
                certificateIssued: false,
                startedAt: Date.now(),
            };
            await dbService.add('progress', progress);
        }
    },

    async createCourse(courseData) {
        const course = {
            ...courseData,
            id: generateId(),
            lessons: [],
            enrolledStudents: [],
            rating: 0,
            reviews: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        await dbService.add('courses', course);
        return course;
    },

    async updateCourse(courseId, updates) {
        const course = await dbService.get('courses', courseId);
        const updatedCourse = {
            ...course,
            ...updates,
            updatedAt: Date.now(),
        };
        await dbService.update('courses', updatedCourse);
        return updatedCourse;
    },
};

export default courseService;
