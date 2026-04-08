import { User } from '../models/auth/User';
import { Session } from '../models/auth/Session';
import { BaseService } from './BaseService';
export declare class AuthService extends BaseService {
    private currentUser;
    private session;
    /**
     * Authenticate a user with username and password.
     */
    login(username: string, password: string): Promise<{
        user: User;
        session: Session;
    }>;
    /**
     * Register a new user.
     */
    register(data: any): Promise<{
        user: User;
    }>;
    /**
     * Logout the current user.
     */
    logout(): Promise<void>;
    /**
     * Get the currently authenticated user's profile.
     */
    me(): Promise<User | null>;
    getCurrentUser(): User | null;
    getSession(): Session | null;
    isAuthenticated(): boolean;
}
