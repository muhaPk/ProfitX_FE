// Login request types
export interface LoginUserDto {
  email: string;
  password: string;
}

// Register request types
export interface RegisterUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Login response types (based on your actual API response)
export interface LoginResponse {
  token: string;
  refresh_token?: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
    createdAt: string;
  };
}

// User type
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}
