import { LoginResponse, ServiceResponse, User, PasswordResetPreference } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { AuthServiceV1 } from '../v1/AuthServiceV1';
import { AuthServiceV2 } from '../v2/AuthServiceV2';

/**
 * Service for authentication, login, and registration.
 * Delegates requests to AuthServiceV1 or AuthServiceV2 based on ApiVersion.
 */
export class AuthService extends BaseService {
  private version: AuthServiceV1 | AuthServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new AuthServiceV1(client, logger)
      : new AuthServiceV2(client, logger);
  }

  /**
   * Log in with username and password.
   */
  async login(username: string, sifre: string): Promise<ServiceResponse<LoginResponse>> {
    return this.version.login(username, sifre);
  }

  /**
   * Register a new account.
   */
  async register(params: any): Promise<ServiceResponse<boolean>> {
    return this.version.register(params);
  }

  /**
   * Get current user profile.
   */
  async me(): Promise<ServiceResponse<User>> {
    return this.version.me();
  }

  /**
   * Log out and clear session.
   */
  async logout(): Promise<ServiceResponse<boolean>> {
    return this.version.logout();
  }

  /**
   * Request password reset code.
   */
  async forgotPassword(params: { username: string, email: string, birthday: string, preference: PasswordResetPreference | 'email' | 'sms' }): Promise<ServiceResponse<boolean>> {
    return this.version.forgotPassword(params);
  }

  /**
   * Verify code and reset password.
   */
  async verifyPasswordReset(params: { username: string, email: string, birthday: string, code: string, newPassword: any }): Promise<ServiceResponse<boolean>> {
    return this.version.verifyPasswordReset(params);
  }
}
