import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { PostService } from './social/PostService';
import { CommentService } from './social/CommentService';
import { SocialInteractionService } from './social/SocialInteractionService';

export class SocialService extends BaseService {
  private readonly _posts: PostService;
  private readonly _comments: CommentService;
  private readonly _interactions: SocialInteractionService;

  constructor(client: ApiClient, logger: ArmoyuLogger, usePreviousVersion: boolean = false) {
    super(client, logger, usePreviousVersion);
    this._posts = new PostService(client, logger, usePreviousVersion);
    this._comments = new CommentService(client, logger, usePreviousVersion);
    this._interactions = new SocialInteractionService(client, logger, usePreviousVersion);
  }

  // Posts
  getPosts(p: number, params: any = {}) { return this._posts.getPosts(p, params); }
  createPost(c: string, m?: number[]) { return this._posts.createPost(c, m); }
  deletePost(id: number | string) { return this._posts.deletePost(id); }

  // Comments
  getComments(postId: number | string) { return this._comments.getComments(postId); }
  createComment(p: any) { return this._comments.createComment(p); }
  deleteComment(id: number | string) { return this._comments.deleteComment(id); }

  // Interactions
  getLikers(p: any) { return this._interactions.getLikers(p); }
  getPostLikers(id: number | string) { return this._interactions.getLikers({ postId: id }); }
  addLike(p: any) { return this._interactions.addLike(p); }
  removeLike(p: any) { return this._interactions.removeLike(p); }
  getSocialNotifications(p: any) { return this._interactions.getSocialNotifications(p); }
}
