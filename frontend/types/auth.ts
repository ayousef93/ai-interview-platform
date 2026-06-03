export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserDto;
  message?: string;
}
