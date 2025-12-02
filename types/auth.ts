export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  token: string; // Storing the access token
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    refreshToken: string;
  };
  accessToken: string;
}