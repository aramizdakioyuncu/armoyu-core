import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { StoryQueryService } from './story/StoryQueryService';
import { StoryActionService } from './story/StoryActionService';

/**
 * Service for managing user stories (Legacy).
 */
export class StoryService extends BaseService {
  private readonly _query: StoryQueryService;
  private readonly _action: StoryActionService;

  constructor(client: ApiClient, logger: ArmoyuLogger, usePreviousVersion: boolean = false) {
    super(client, logger, usePreviousVersion);
    this._query = new StoryQueryService(client, logger, usePreviousVersion);
    this._action = new StoryActionService(client, logger, usePreviousVersion);
  }

  // Queries
  getStories(p: number, l?: number) { return this._query.getStories(p, l); }
  getStoryViewers(p: number, id: any, l?: number) { return this._query.getStoryViewers(p, id, l); }
  getStoryLikers(p: number, id: any, l?: number) { return this._query.getStoryLikers(p, id, l); }

  // Actions
  addStory(u: string) { return this._action.addStory(u); }
  deleteStory(id: any) { return this._action.deleteStory(id); }
  hideStory(id: any) { return this._action.hideStory(id); }
  viewStory(id: any) { return this._action.viewStory(id); }
  addLike(id: any) { return this._action.addLike(id); }
  removeLike(id: any) { return this._action.removeLike(id); }
}
