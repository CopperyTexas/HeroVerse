export interface Profile {
  _id: string;
  username: string;
  password: string | number;
  name: string;
  nickname: string;
  description: string;
  power: string[];
  avatar: string;
  subscriptionsAmount: number;
  subscribers: { _id: string; [key: string]: any }[];
  isActive: boolean;
}
