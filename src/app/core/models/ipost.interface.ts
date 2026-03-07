export interface Ipost {
  _id: string;
  body: string;
  image: string;
  privacy: string;
  user: User;
  sharedPost: null | Ipost;
  likes: any[];
  createdAt: string;
  commentsCount: number;
  topComment: TopComment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  isLiked?: boolean;
  bookmarked: boolean;
}

interface TopComment {
  _id: string;
  content: string;
  commentCreator: User;
  post: string;
  parentComment: null;
  likes: any[];
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
}
