import { User } from '../models/auth/User';
import { Session } from '../models/auth/Session';
export declare class AuthService {
    private static currentUser;
    private static session;
    /**
     * Authenticate a user with username and password.
     */
    static login(username: string, password: string): Promise<{
        user: User;
        session: Session;
    }>;
    /**
     * Register a new user.
     */
    static register(data: any): Promise<{
        user: User;
    }>;
    /**
     * Logout the current user.
     */
    static logout(): Promise<void>;
    /**
     * Get the currently authenticated user's profile.
     */
    static me(): Promise<User | null>;
    static getCurrentUser(): User | null;
    static getSession(): Session | null;
    static isAuthenticated(): boolean;
}
