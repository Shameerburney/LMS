import bcrypt from 'bcryptjs';
import dbService from './db';
import { generateId } from '../utils/helpers';
import { ROLES } from '../utils/constants';

export const authService = {
    async register(email, password, name, role = ROLES.STUDENT) {
        console.log('[authService] Registering user:', email);
        try {
            // Check if user already exists
            console.log('[authService] Checking existing users...');
            // OPTIMIZATION: Use query instead of downloading all users
            const existingUsers = await dbService.getAllByIndex('users', 'email', email);
            const userExists = existingUsers.length > 0;

            if (userExists) {
                throw new Error('User with this email already exists');
            }

            // Hash password
            console.log('[authService] Hashing password...');
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user object
            const user = {
                id: generateId(),
                email,
                password: hashedPassword,
                role,
                profile: {
                    name,
                    avatar: null,
                    bio: '',
                    joinedDate: Date.now(),
                },
                gamification: {
                    xp: 0,
                    level: 1,
                    badges: [],
                    streak: 0,
                },
                preferences: {
                    theme: 'light',
                    notifications: true,
                    language: 'en',
                },
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };

            // Save to database
            console.log('[authService] Saving user to DB...');
            await dbService.add('users', user);
            console.log('[authService] User saved!');

            // Return user without password
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            console.error('[authService] Registration error:', error);
            throw error;
        }
    },

    async login(email, password) {
        try {
            const users = await dbService.getAll('users');
            const user = users.find((u) => u.email === email);

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Check if user is suspended
            if (user.suspended) {
                throw new Error('Your account has been suspended. Please contact the administrator.');
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                throw new Error('Invalid email or password');
            }

            // Return user without password
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    },

    async getCurrentUser() {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    },

    async setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },

    async logout() {
        localStorage.removeItem('currentUser');
    },

    async updateProfile(userId, updates) {
        try {
            // We can use the new updatePartial method in dbService for efficiency
            // But first we need to structure the data correctly for Firestore
            // Firestore update paths can be 'profile.name', etc.

            // For now, let's stick to the safe full update pattern or simple merge
            const user = await dbService.get('users', userId);
            if (!user) {
                throw new Error('User not found');
            }

            const updatedProfile = {
                ...user.profile,
                ...updates,
            };

            // Update only the profile field
            await dbService.updatePartial('users', userId, {
                profile: updatedProfile,
                updatedAt: Date.now()
            });

            const updatedUser = { ...user, profile: updatedProfile };
            const { password: _, ...userWithoutPassword } = updatedUser;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    },

    async changePassword(userId, oldPassword, newPassword) {
        try {
            const user = await dbService.get('users', userId);
            if (!user) {
                throw new Error('User not found');
            }

            const isValidPassword = await bcrypt.compare(oldPassword, user.password);
            if (!isValidPassword) {
                throw new Error('Current password is incorrect');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await dbService.updatePartial('users', userId, {
                password: hashedPassword,
                updatedAt: Date.now()
            });

            return true;
        } catch (error) {
            throw error;
        }
    },
};

export default authService;
