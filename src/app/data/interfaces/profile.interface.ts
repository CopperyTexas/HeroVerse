export interface Profile {
  id: number;
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
