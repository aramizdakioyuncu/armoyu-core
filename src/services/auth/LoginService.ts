import { User } from '../../models/auth/User';
import { BaseService } from '../BaseService';
import { UserMapper } from '../../utils/mappers/UserMapper';
import { LoginResponse } from '../../models/auth/LoginResponse';
import { MeResponse } from '../../models/auth/MeResponse';

/**
 * Handles user login, logout, and session state.
 */
export class LoginService extends BaseService {
  private currentUser: User | null = null;

  async login(username: string, password: string): Promise<LoginResponse> {
    if (this.isAuthenticated()) return this.createError('Zaten giriş yapılmış.') as any;
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('kullaniciadi', username);
      formData.append('parola', password);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/0/'), formData);
      const icerik = this.handle<any>(response);
      if (!icerik) return this.createError('API Hatası: Kullanıcı bilgileri alınamadı.') as any;

      this.currentUser = UserMapper.mapUser(icerik.user || icerik, this.usePreviousVersion);
      const token = this.extractToken(response, icerik);
      if (token) this.client.setToken(token);

      return this.createSuccess({ user: this.currentUser, token }, response.aciklama) as any;
    } catch (error: any) {
      return this.createError(error.message) as any;
    }
  }

  private extractToken(response: any, icerik: any): string | null {
    if (typeof response.aciklama === 'string' && response.aciklama.length > 20 && !response.aciklama.includes(' ')) return response.aciklama;
    if (response.aciklama && typeof response.aciklama === 'object') return response.aciklama.token || response.aciklama.session_token || response.aciklama.sessionID || '';
    return icerik?.token || icerik?.session_token || icerik?.sessionID || response.aciklamadetay?.token || null;
  }

  async logout(): Promise<any> {
    try { await this.client.post('/auth/logout', {}); } catch {}
    this.currentUser = null;
    this.client.setToken(null);
    return this.createSuccess(undefined, 'Çıkış yapıldı.');
  }

  async me(): Promise<MeResponse> {
    try {
      const response = (this.client.getApiKey() && this.client.getToken()) 
        ? await this.client.post<any>(this.resolveBotPath('/0/0/0/0/0/'), { token: this.client.getToken() })
        : await this.client.get<any>('/auth/me');

      this.currentUser = UserMapper.mapUser(this.handle(response), this.usePreviousVersion);
      return this.createSuccess(this.currentUser) as any;
    } catch (error: any) {
      this.currentUser = null;
      return this.createError(error.message) as any;
    }
  }

  getCurrentUser() { return this.currentUser; }
  isAuthenticated() { return !!this.currentUser && !!this.client.getToken(); }
}
