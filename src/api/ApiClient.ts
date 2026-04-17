import { ArmoyuLogger, ConsoleLogger } from './Logger';
import { RequestInterceptor } from './RequestInterceptor';
import { ResponseHandler } from './ResponseHandler';
import { HttpMethod, ApiConfig } from './types';
import { AuthService, UserService, EventService, GroupService, SiteInformationService, ManagementService, RuleService, BusinessService, ChatService, SocialService, ProjectService, StoryService, PollService, BlockService, StationService, TeamService, StaffService, LocationService, PaymentService, BlogService, ShopService, ForumService, SupportService, SearchService, SocketService } from '../services';

export { HttpMethod };
export type { ApiConfig };
export class ApiError extends Error {
  constructor(public message: string, public status?: number, public statusText?: string, public data?: any) {
    super(message); this.name = 'ApiError';
  }
}

export class ApiClient {
  private config: ApiConfig;
  private logger: ArmoyuLogger;
  public lastRaw: any = null;
  public readonly auth: AuthService; public readonly users: UserService; public readonly events: EventService;
  public readonly groups: GroupService; public readonly siteInfo: SiteInformationService;
  public readonly management: ManagementService; public readonly rules: RuleService;
  public readonly business: BusinessService; public readonly projects: ProjectService;
  public readonly stories: StoryService; public readonly polls: PollService;
  public readonly blocks: BlockService; public readonly stations: StationService;
  public readonly teams: TeamService; public readonly staff: StaffService;
  public readonly locations: LocationService; public readonly payments: PaymentService;
  public readonly chat: ChatService; public readonly social: SocialService;
  public readonly blog: BlogService; public readonly shop: ShopService;
  public readonly forum: ForumService; public readonly support: SupportService;
  public readonly search: SearchService; public readonly socket: SocketService;

  constructor(config: ApiConfig) {
    this.config = config; this.logger = config.logger || new ConsoleLogger();
    const svc = (S: any) => new S(this, this.logger, this.config.usePreviousVersion);
    this.auth = svc(AuthService); this.users = svc(UserService); this.events = svc(EventService);
    this.groups = svc(GroupService); this.siteInfo = svc(SiteInformationService);
    this.management = svc(ManagementService); this.rules = svc(RuleService);
    this.business = svc(BusinessService); this.projects = svc(ProjectService);
    this.stories = svc(StoryService); this.polls = svc(PollService);
    this.blocks = svc(BlockService); this.stations = svc(StationService);
    this.teams = svc(TeamService); this.staff = svc(StaffService);
    this.locations = svc(LocationService); this.payments = svc(PaymentService);
    this.chat = svc(ChatService); this.social = svc(SocialService);
    this.blog = svc(BlogService); this.shop = svc(ShopService);
    this.forum = svc(ForumService); this.support = svc(SupportService);
    this.search = svc(SearchService); this.socket = new SocketService(this.logger);
  }

  private async request<T>(endpoint: string, options: any = {}): Promise<T> {
    const url = RequestInterceptor.buildUrl(this.config.baseUrl, endpoint, options.params);
    const { headers, body } = RequestInterceptor.prepareRequest(this.config, options, this.logger);
    try {
      const resp = await fetch(url, { ...options, headers, body });
      return this.lastRaw = await ResponseHandler.handleResponse<T>(resp);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(err instanceof Error ? err.message : 'Unknown Network Error');
    }
  }

  async get<T>(e: string, o?: any) { return this.request<T>(e, { ...o, method: HttpMethod.GET }); }
  async post<T>(e: string, b?: any, o?: any) { return this.request<T>(e, { ...o, method: HttpMethod.POST, body: b }); }
  async put<T>(e: string, b?: any, o?: any) { return this.request<T>(e, { ...o, method: HttpMethod.PUT, body: b }); }
  async patch<T>(e: string, b?: any, o?: any) { return this.request<T>(e, { ...o, method: HttpMethod.PATCH, body: b }); }
  async delete<T>(e: string, o?: any) { return this.request<T>(e, { ...o, method: HttpMethod.DELETE }); }

  setToken(t: string | null) { this.config.token = t; }
  getToken() { return this.config.token || null; }
  setApiKey(k: string | null) { this.config.apiKey = k; }
  getApiKey() { return this.config.apiKey || null; }
  getBaseUrl() { return this.config.baseUrl; }
}
