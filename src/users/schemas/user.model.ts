export interface CreateUserDto {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role?: string;
  createdAt?: Date;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
}
