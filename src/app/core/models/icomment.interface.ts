export interface Icomment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  image?: string;
  parentComment: null;
  likes: any[];
  createdAt: string;
  repliesCount: number;
  replies?: Icomment[];
}

interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}
