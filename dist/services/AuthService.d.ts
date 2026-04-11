import { User } from '../models/auth/User';
import { Session } from '../models/auth/Session';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { PasswordResetPreference } from '../models/social/AuthEnums';
/**
 * Service for managing user authentication, registration, and session lifecycle.
 * @checked 2026-04-12
 */
export declare class AuthService extends BaseService {
    private currentUser;
    private session;
    constructor(client: ApiClient, logger: ArmoyuLogger);
    /**
     * Authenticate a user with username and password.
     */
    login(username: string, password: string): Promise<{
        user: User;
        session: Session;
    }>;
    /**
     * Register a new user (Legacy).
     */
    register(params: {
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }): Promise<boolean>;
    /**
     * Request a password reset (Legacy).
     */
    forgotPassword(params: {
        username: string;
        email: string;
        birthday: string;
        preference: PasswordResetPreference | string;
    }): Promise<boolean>;
    /**
     * Verify and complete password reset (Legacy).
     */
    verifyPasswordReset(params: {
        username: string;
        email: string;
        birthday: string;
        code: string;
        newPassword: string;
    }): Promise<boolean>;
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
