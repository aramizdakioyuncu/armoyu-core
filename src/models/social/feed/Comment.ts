export class Comment {
  id?: string | number;
  postId?: string | number;
  userId?: string | number;
  content?: string;
  createdAt?: string;

  constructor(data?: Partial<Comment>) {
    Object.assign(this, data);
  }
}
