export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenInfo {
  token: string;
  expires: string;
}

export interface TokenResponse {
  tokens: {
    access: TokenInfo;
    refresh: TokenInfo;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthError {
  error: string;
  message: string;
  details?: Array<Record<string, unknown>>;
}
