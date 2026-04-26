import { ForumCategoryDTO } from '../../dto/community/ForumDTO';

export class ForumCategory implements ForumCategoryDTO {
  id: number;
  name: string;
  description?: string;
  topicCount?: number;
  postCount?: number;
  slug?: string;

  constructor(data: ForumCategoryDTO) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.topicCount = data.topicCount;
    this.postCount = data.postCount;
    this.slug = data.slug;
  }

  /**
   * Returns a friendly URL for the forum category.
   */
  get forumUrl(): string {
    return `/forum/${this.slug || this.id}`;
  }

  /**
   * Returns a summary of topic/post counts.
   */
  get statsSummary(): string {
    return `${this.topicCount || 0} Konu, ${this.postCount || 0} Mesaj`;
  }

  /**
   * Factory method to create a ForumCategory from a DTO.
   */
  static fromJSON(data: ForumCategoryDTO): ForumCategory {
    return new ForumCategory(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): ForumCategoryDTO {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      topicCount: this.topicCount,
      postCount: this.postCount,
      slug: this.slug
    };
  }
}
