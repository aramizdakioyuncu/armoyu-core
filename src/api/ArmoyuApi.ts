import { ApiClient, type ApiConfig } from './ApiClient';
import { ArmoyuLogger, ConsoleLogger } from './Logger';
import { BaseMapper } from '../utils/mappers/BaseMapper';
import { AuthService, UserService, BlogService, ShopService, ForumService, SupportService, RuleService, SocketService, SearchService, EventService, SiteInformationService, GroupService, SocialService, ChatService, BusinessService, ProjectService, StoryService, PollService, BlockService, StationService, TeamService, StaffService, LocationService, PaymentService, ManagementService } from '../services';

/**
 * The main entry point for the ARMOYU platform API.
 */
export class ArmoyuApi {
  private client: ApiClient;
  private logger: ArmoyuLogger;

  constructor(apiKey: string, config?: Partial<Omit<ApiConfig, 'apiKey'>>) {
    if (!apiKey?.trim()) throw new Error('ArmoyuApi: API Key is required.');
    this.logger = config?.logger || new ConsoleLogger();
    
    // Set Global Mapper Mode (Strict by default)
    const useStrict = config?.usePreviousVersion ?? true;
    BaseMapper.setStrictMode(useStrict);

    this.client = new ApiClient({
      baseUrl: config?.baseUrl || 'https://api.aramizdakioyuncu.com',
      token: config?.token || null,
      apiKey,
      headers: config?.headers || {},
      logger: this.logger,
      usePreviousVersion: useStrict
    });
  }

  // Delegated Services from ApiClient
  get auth() { return this.client.auth; }
  get users() { return this.client.users; }
  get blog() { return this.client.blog; }
  get shop() { return this.client.shop; }
  get forum() { return this.client.forum; }
  get support() { return this.client.support; }
  get rules() { return this.client.rules; }
  get socket() { return this.client.socket; }
  get search() { return this.client.search; }
  get events() { return this.client.events; }
  get siteInfo() { return this.client.siteInfo; }
  get groups() { return this.client.groups; }
  get social() { return this.client.social; }
  get chat() { return this.client.chat; }
  get business() { return this.client.business; }
  get projects() { return this.client.projects; }
  get stories() { return this.client.stories; }
  get polls() { return this.client.polls; }
  get blocks() { return this.client.blocks; }
  get stations() { return this.client.stations; }
  get teams() { return this.client.teams; }
  get staff() { return this.client.staff; }
  get locations() { return this.client.locations; }
  get payments() { return this.client.payments; }
  get management() { return this.client.management; }

  setToken(t: string | null) { this.client.setToken(t); }
  setApiKey(k: string | null) { this.client.setApiKey(k); }
  setConfig(c: any) { (this.client as any).config = { ...(this.client as any).config, ...c }; }
  
  get last() { return this.client.lastRaw; }

  async get<T>(e: string, o?: any) { return this.client.get<T>(e, o); }
  async post<T>(e: string, b?: any, o?: any) { return this.client.post<T>(e, b, o); }
  async put<T>(e: string, b?: any, o?: any) { return this.client.put<T>(e, b, o); }
  async patch<T>(e: string, b?: any, o?: any) { return this.client.patch<T>(e, b, o); }
  async delete<T>(e: string, o?: any) { return this.client.delete<T>(e, o); }
}
