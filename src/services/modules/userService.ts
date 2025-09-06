import { axiosClient } from "../api";
import { User, UserUpdate } from "../../interfaces/user";

export class UserService {
  private static readonly USERS_BASE_URL = "/users";

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await axiosClient.get<User>(`${this.USERS_BASE_URL}/me`);
      return response.data;
    } catch (error: any) {
      throw this.handleUserError(error);
    }
  }

  /**
   * Update current user profile
   */
  static async updateProfile(data: UserUpdate): Promise<User> {
    try {
      const response = await axiosClient.patch<User>(
        `${this.USERS_BASE_URL}/me`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleUserError(error);
    }
  }

  /**
   * Get user by ID (if needed for admin features)
   */
  static async getUser(id: string): Promise<User> {
    try {
      const response = await axiosClient.get<User>(
        `${this.USERS_BASE_URL}/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleUserError(error);
    }
  }

  /**
   * Handle user-related errors
   */
  private static handleUserError(error: any): Error {
    if (error.response?.data) {
      const { message, error: errorType } = error.response.data;
      return new Error(message || `User operation failed: ${errorType}`);
    }
    return new Error(error.message || "User operation failed");
  }
}

export default UserService;
