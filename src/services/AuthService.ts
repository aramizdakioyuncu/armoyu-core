import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { LoginService } from './auth/LoginService';
import { AccountService } from './auth/AccountService';

/**
 * Service for managing user authentication, registration, and session lifecycle.
 */
export class AuthService extends BaseService {
  private readonly _login: LoginService;
  private readonly _account: AccountService;

  constructor(client: ApiClient, logger: ArmoyuLogger, usePreviousVersion: boolean = false) {
    super(client, logger, usePreviousVersion);
    this._login = new LoginService(client, logger, usePreviousVersion);
    this._account = new AccountService(client, logger, usePreviousVersion);
  }

  // Session Lifecycle
  login(u: string, p: string) { return this._login.login(u, p); }
  logout() { return this._login.logout(); }
  me() { return this._login.me(); }
  getCurrentUser() { return this._login.getCurrentUser(); }
  isAuthenticated() { return this._login.isAuthenticated(); }

  // Account Actions
  register(p: any) { return this._account.register(p); }
  forgotPassword(p: any) { return this._account.forgotPassword(p); }
  verifyPasswordReset(p: any) { return this._account.verifyPasswordReset(p); }
}
