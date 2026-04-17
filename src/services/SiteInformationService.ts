import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { SiteContentService } from './site/SiteContentService';
import { SiteSearchService } from './site/SiteSearchService';
import { SiteStatsService } from './site/SiteStatsService';

/**
 * Service for fetching site-wide information, content pages, statistics, and announcements.
 */
export class SiteInformationService extends BaseService {
  private readonly _content: SiteContentService;
  private readonly _search: SiteSearchService;
  private readonly _stats: SiteStatsService;

  constructor(client: ApiClient, logger: ArmoyuLogger, usePreviousVersion: boolean = false) {
    super(client, logger, usePreviousVersion);
    this._content = new SiteContentService(client, logger, usePreviousVersion);
    this._search = new SiteSearchService(client, logger, usePreviousVersion);
    this._stats = new SiteStatsService(client, logger, usePreviousVersion);
  }

  // Content
  getPageContent(p: string, c: string = 'home') { return this._content.getPageContent(p, c); }
  getAboutContent(c: string = 'home') { return this._content.getAboutContent(c); }
  getPrivacyPolicy(c: string = 'home') { return this._content.getPrivacyPolicy(c); }
  getTermsOfService(c: string = 'home') { return this._content.getTermsOfService(c); }

  // Search
  searchTags(p: number, params: any) { return this._search.searchTags(p, params); }
  search(p: number, params: any) { return this._search.search(p, params); }

  // Stats and Messages
  getStatistics(c: string = 'aktifoyuncu') { return this._stats.getStatistics(c); }
  getSessionLogs() { return this._stats.getSessionLogs(); }
  getSiteMessages(id?: number) { return this._stats.getSiteMessages(id); }
  getSiteMessageDetail(id?: number) { return this._stats.getSiteMessageDetail(id); }
}
