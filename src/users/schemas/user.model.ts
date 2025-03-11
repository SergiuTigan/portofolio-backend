export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  role?: string;
  createdAt?: Date;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  newPassword?: string;
  avatar?: string;
  bio?: string;
  role?: string;
}
