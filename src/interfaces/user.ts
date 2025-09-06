export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
}

export interface UserError {
  error: string;
  message: string;
  details?: Array<Record<string, unknown>>;
}
