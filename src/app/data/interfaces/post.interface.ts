import { Profile } from './profile.interface';

export interface PostCreateDto {
  title: string;
  content: string;
  authorId: string;
}
export interface Post {
  _id: string;
  id: string;
  title: string;
  content: string;
  authorId: Profile;
  images: string[];
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}
export interface Comment {
  id: number;
  text: string;
  author: {
    id: 0;
    username: string;
    avatar: string;
    subscribersAmount: 0;
  };
  postId: number;
  commentId: number;
  createAt: string;
  updateAt: number;
}
