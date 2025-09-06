import { axiosClient } from "../api";
import {
  RegisterRequest,
  LoginRequest,
  TokenResponse,
  User,
} from "../../interfaces/auth";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export class AuthService {
  private static readonly AUTH_BASE_URL = "/auth";

  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<User> {
    try {
      const response = await axiosClient.post<User>(
        `${this.AUTH_BASE_URL}/register`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Login user and store token
   */
  static async login(data: LoginRequest): Promise<TokenResponse> {
    try {
      const response = await axiosClient.post<TokenResponse>(
        `${this.AUTH_BASE_URL}/login`,
        data
      );

      // Store tokens in cookies
      const { tokens } = response.data;

      console.log(response.data.tokens.access);
      // Store access token
      const accessExpiry = new Date(tokens.access.expires);
      cookies.set("accessToken", tokens.access.token, {
        expires: accessExpiry,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Store refresh token
      const refreshExpiry = new Date(tokens.refresh.expires);
      cookies.set("refreshToken", tokens.refresh.token, {
        expires: refreshExpiry,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return response.data;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout user and clear token
   */
  static logout(): void {
    cookies.remove("accessToken", { path: "/" });
    cookies.remove("refreshToken", { path: "/" });
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = cookies.get("accessToken");
    return Boolean(token);
  }

  /**
   * Get stored token
   */
  static getToken(): string | null {
    return cookies.get("accessToken") || null;
  }

  /**
   * Get stored refresh token
   */
  static getRefreshToken(): string | null {
    return cookies.get("refreshToken") || null;
  }

  /**
   * Handle authentication errors
   */
  private static handleAuthError(error: any): Error {
    if (error.response?.data) {
      const { message, error: errorType } = error.response.data;
      return new Error(message || `Authentication failed: ${errorType}`);
    }
    return new Error(error.message || "Authentication failed");
  }
}

export default AuthService;
