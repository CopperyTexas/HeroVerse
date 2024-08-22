export interface Profile {
  _id: number;
  username: string;
  password: string | number;
  name: string;
  nickname: string;
  description: string;
  power: string[];
  avatar: string;
  subscriptionsAmount: number;
  isActive: boolean;
}
