import { PostDTO, PostOwnerDTO, PostMediaDTO, PostLikerDTO, PostCommentDTO } from '../../dto/social/PostDTO';

export class Post implements PostDTO {
  id: number;
  owner: PostOwnerDTO;
  content: string;
  location?: string;
  date: string;
  timeLabel?: string;
  editDate?: string | null;
  topLikers: PostLikerDTO[];
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  reportsCount: number;
  isLiked: boolean;
  isCommented: boolean;
  isReposted: boolean;
  isReported: boolean;
  mappedMedia: PostMediaDTO[];
  topComments: PostCommentDTO[];

  constructor(data: PostDTO) {
    this.id = data.id;
    this.owner = data.owner;
    this.content = data.content;
    this.location = data.location;
    this.date = data.date;
    this.timeLabel = data.timeLabel;
    this.editDate = data.editDate;
    this.topLikers = data.topLikers;
    this.likesCount = data.likesCount;
    this.commentsCount = data.commentsCount;
    this.repostsCount = data.repostsCount;
    this.reportsCount = data.reportsCount;
    this.isLiked = data.isLiked;
    this.isCommented = data.isCommented;
    this.isReposted = data.isReposted;
    this.isReported = data.isReported;
    this.mappedMedia = data.mappedMedia;
    this.topComments = data.topComments;
  }

  /**
   * Returns true if the post has any media attached.
   */
  get hasMedia(): boolean {
    return this.mappedMedia.length > 0;
  }

  /**
   * Returns a clean URL for the post.
   */
  get postUrl(): string {
    return `/p/${this.id}`;
  }

  /**
   * Simple helper to check if author is the current user (if current username provided).
   */
  isAuthor(currentUsername: string): boolean {
    return this.owner.username === currentUsername;
  }

  /**
   * Returns a summary of the content (first 100 chars).
   */
  get summary(): string {
    if (this.content.length <= 100) return this.content;
    return this.content.substring(0, 97) + '...';
  }

  /**
   * Factory method to create a Post from a DTO.
   */
  static fromJSON(data: PostDTO): Post {
    return new Post(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): PostDTO {
    return {
      id: this.id,
      owner: this.owner,
      content: this.content,
      location: this.location,
      date: this.date,
      timeLabel: this.timeLabel,
      editDate: this.editDate,
      topLikers: this.topLikers,
      likesCount: this.likesCount,
      commentsCount: this.commentsCount,
      repostsCount: this.repostsCount,
      reportsCount: this.reportsCount,
      isLiked: this.isLiked,
      isCommented: this.isCommented,
      isReposted: this.isReposted,
      isReported: this.isReported,
      mappedMedia: this.mappedMedia,
      topComments: this.topComments
    };
  }
}
