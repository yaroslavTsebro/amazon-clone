export interface UpdateUserDto{
  email: string;
  password?: string;
  name?: string;
  avatarPath: string;
  phone?: string;
}