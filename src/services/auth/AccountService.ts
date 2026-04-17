import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles account creation and recovery actions.
 */
export class AccountService extends BaseService {
  async register(params: {
    username: string; firstName: string; lastName: string; email: string; password: string;
  }): Promise<ServiceResponse<boolean>> {
    try {
      const formData = new FormData();
      formData.append('kullaniciadi', params.username);
      formData.append('ad', params.firstName);
      formData.append('soyad', params.lastName);
      formData.append('email', params.email);
      formData.append('parola', params.password);
      formData.append('parolakontrol', params.password);

      const response = await this.client.post<any>(this.resolveBotPath('/kayit-ol/0/0/0/0/'), formData);
      return this.createSuccess(Number(response.durum) === 1, response.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async forgotPassword(params: {
    username: string; email: string; birthday: string; preference: string;
  }): Promise<ServiceResponse<boolean>> {
    try {
      const formData = new FormData();
      formData.append('kullaniciadi', params.username);
      formData.append('email', params.email);
      formData.append('dogumtarihi', params.birthday);
      formData.append('sifirlamatercihi', params.preference);

      const response = await this.client.post<any>(this.resolveBotPath('/sifremi-unuttum/0/0/0/0/'), formData);
      return this.createSuccess(Number(response.durum) === 1, response.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async verifyPasswordReset(params: {
    username: string; email: string; birthday: string; code: string; newPassword: string;
  }): Promise<ServiceResponse<boolean>> {
    try {
      const formData = new FormData();
      formData.append('kullaniciadi', params.username);
      formData.append('email', params.email);
      formData.append('dogumtarihi', params.birthday);
      formData.append('onaykodu', params.code);
      formData.append('yeniparola', params.newPassword);
      formData.append('yeniparolakontrol', params.newPassword);

      const response = await this.client.post<any>(this.resolveBotPath('/sifremi-unuttum-dogrula/0/0/0/0/'), formData);
      return this.createSuccess(Number(response.durum) === 1, response.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
