import { ArmoyuLogger, ConsoleLogger } from './Logger';
import { RequestInterceptor } from './RequestInterceptor';
import { ResponseHandler } from './ResponseHandler';
import { HttpMethod, ApiConfig, ApiVersion, SessionHandlers } from './types';
import { AuthService, UserService, EventService, GroupService, GroupMemberService, SiteInformationService, ManagementService, RuleService, SchoolService, ChatService, SocialService, ProjectService, StoryService, PollService, BlockService, StationService, TeamService, StaffService, LocationService, PaymentService, BlogService, ShopService, ForumService, SupportService, SearchService, SocketService, MusicService, ReelsService, MediaService, EducationService, WorkplaceService, GiveawayService } from '../services';

export { HttpMethod, ApiVersion };
export type { ApiConfig, SessionHandlers };
export class ApiError extends Error {
  constructor(public message: string, public status?: number, public statusText?: string, public data?: any) {
    super(message); this.name = 'ApiError';
  }
}

export class ApiClient {
  private config: ApiConfig;
  private logger: ArmoyuLogger;
  public lastRaw: any = null;
  private sessionHandlers: SessionHandlers = {};
  private refreshing: Promise<boolean> | null = null;
  public readonly auth: AuthService; public readonly users: UserService; public readonly events: EventService;
  public readonly groups: GroupService; public readonly groupMembers: GroupMemberService;
  public readonly siteInfo: SiteInformationService;
  public readonly management: ManagementService; public readonly rules: RuleService;
  public readonly schools: SchoolService; public readonly projects: ProjectService;
  public readonly stories: StoryService; public readonly polls: PollService;
  public readonly blocks: BlockService; public readonly stations: StationService;
  public readonly teams: TeamService; public readonly staff: StaffService;
  public readonly locations: LocationService; public readonly payments: PaymentService;
  public readonly chat: ChatService; public readonly social: SocialService;
  public readonly blog: BlogService; public readonly shop: ShopService;
  public readonly forum: ForumService; public readonly support: SupportService;
  public readonly search: SearchService; public readonly socket: SocketService;
  public readonly media: MediaService;
  public readonly music: MusicService;
  public readonly reels: ReelsService;
  public readonly education: EducationService;
  public readonly workplaces: WorkplaceService;
  public readonly giveaways: GiveawayService;

  constructor(config: ApiConfig) {
    this.config = config; 
    this.logger = config.logger || new ConsoleLogger();

    const svc = (S: any) => new S(this, this.logger);
    this.auth = svc(AuthService); this.users = svc(UserService); this.events = svc(EventService);
    this.groups = svc(GroupService); this.groupMembers = svc(GroupMemberService);
    this.siteInfo = svc(SiteInformationService);
    this.management = svc(ManagementService); this.rules = svc(RuleService);
    this.schools = svc(SchoolService); this.projects = svc(ProjectService);
    this.stories = svc(StoryService); this.polls = svc(PollService);
    this.blocks = svc(BlockService); this.stations = svc(StationService);
    this.teams = svc(TeamService); this.staff = svc(StaffService);
    this.locations = svc(LocationService); this.payments = svc(PaymentService);
    this.chat = svc(ChatService); this.social = svc(SocialService);
    this.blog = svc(BlogService); this.shop = svc(ShopService);
    this.forum = svc(ForumService); this.support = svc(SupportService);
    this.search = svc(SearchService); this.socket = new SocketService(this.logger);
    this.media = svc(MediaService);
    this.music = svc(MusicService);
    this.reels = svc(ReelsService);
    this.education = svc(EducationService);
    this.workplaces = svc(WorkplaceService);
    this.giveaways = svc(GiveawayService);
  }

  private canRefresh(endpoint: string): boolean {
    return this.version === ApiVersion.CURRENT && !!this.config.token && !/\/auth\/(login|register|refresh)/.test(endpoint);
  }

  /** Eşzamanlı 401'ler tek yenilemeyi paylaşır: refresh token tek kullanımlıktır */
  private refreshSession(): Promise<boolean> {
    this.refreshing ??= this.doRefresh().finally(() => { this.refreshing = null; });
    return this.refreshing;
  }

  private async doRefresh(): Promise<boolean> {
    const refreshToken = this.config.refreshToken;

    if (refreshToken) {
      try {
        const response = await this.post<any>('/v1/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: nextRefreshToken } = response.aciklamadetay;
        this.config.token = accessToken;
        this.config.refreshToken = nextRefreshToken;
        this.sessionHandlers.onRefreshed?.(accessToken, nextRefreshToken);
        return true;
      } catch (err) {
        // Ağ/sunucu hatasında ve başka sekme yenilerken (409) oturum kapatılmaz
        const status = err instanceof ApiError ? err.status : undefined;
        if (!status || status >= 500 || status === 409) return false;
      }
    }

    this.config.token = null;
    this.config.refreshToken = null;
    this.sessionHandlers.onExpired?.();
    return false;
  }

  private async request<T>(endpoint: string, options: any = {}, retried: boolean = false): Promise<T> {
    const url = RequestInterceptor.buildUrl(this.config.baseUrl, endpoint, this.config, options.params);
    const { headers, body } = RequestInterceptor.prepareRequest(this.config, options, this.logger);
    
    const startTime = Date.now();
    if (this.config.debugMode) {
      this.logger.info(`[ARMOYU] [DEBUG] ${options.method || 'GET'} Request -> ${url}`);
    }

    try {
      const resp = await fetch(url, { ...options, headers, body });
      const duration = Date.now() - startTime;
      
      if (this.config.debugMode) {
        this.logger.info(`[ARMOYU] [DEBUG] ${options.method || 'GET'} Response (${resp.status}) [${duration}ms] <- ${url}`);
      }

      const rawData = await ResponseHandler.parseBody(resp);
      this.lastRaw = rawData;
      return ResponseHandler.processResponse<T>(resp, rawData);
    } catch (err) {
      const duration = Date.now() - startTime;
      if (this.config.debugMode) {
        this.logger.error(`[ARMOYU] [DEBUG] ${options.method || 'GET'} FAILED [${duration}ms] <- ${url} - Error: ${err instanceof Error ? err.message : 'Network Error'}`);
      }
      if (err instanceof ApiError) {
        if (err.status === 401 && !retried && this.canRefresh(endpoint) && await this.refreshSession()) {
          return this.request<T>(endpoint, options, true);
        }
        throw err;
      }
      throw new ApiError(err instanceof Error ? err.message : 'Unknown Network Error');
    }
  }

  async get<T>(e: string, o?: any) { return this.request<T>(e, { ...o, method: HttpMethod.GET }); }
  async post<T>(e: string, b?: any, o?: any) { return this.request<T>(e, { ...o, method: HttpMethod.POST, body: b }); }
  async put<T>(e: string, b?: any, o?: any) { return this.request<T>(e, { ...o, method: HttpMethod.PUT, body: b }); }
  async patch<T>(e: string, b?: any, o?: any) { return this.request<T>(e, { ...o, method: HttpMethod.PATCH, body: b }); }
  async delete<T>(e: string, b?: any, o?: any) { return this.request<T>(e, { ...o, method: HttpMethod.DELETE, body: b }); }

  setAuthToken(t: string | null) { this.config.token = t; }
  setRefreshToken(t: string | null) { this.config.refreshToken = t; }
  setSessionHandlers(h: SessionHandlers) { this.sessionHandlers = h; }
  getAuthToken() { return this.config.token || null; }
  setApiKey(k: string | null) { this.config.apiKey = k; }
  getApiKey() { return this.config.apiKey || null; }
  getBaseUrl() { return this.config.baseUrl; }
  get usePreviousVersion() { return this.config.usePreviousVersion ?? true; }
  get version() { return this.config.version || ApiVersion.OLD; }
}
