export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}
