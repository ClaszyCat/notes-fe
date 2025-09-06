import { axiosClient } from "../api";
import {
  Note,
  NoteCreate,
  NoteUpdate,
  NotePage,
  NoteSearchParams,
  ImageUploadResponse,
} from "../../interfaces/note";

export class NoteService {
  private static readonly NOTES_BASE_URL = "/notes";

  /**
   * Get paginated list of notes with optional search
   */
  static async getNotes(params?: NoteSearchParams): Promise<NotePage> {
    try {
      const searchParams = new URLSearchParams();

      if (params?.q) {
        searchParams.append("q", params.q);
      }
      if (params?.page) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.pageSize) {
        searchParams.append("pageSize", params.pageSize.toString());
      }

      const url = `${this.NOTES_BASE_URL}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;
      const response = await axiosClient.get<NotePage>(url);
      return response.data;
    } catch (error: any) {
      throw this.handleNoteError(error);
    }
  }

  /**
   * Get a single note by ID
   */
  static async getNote(id: string): Promise<Note> {
    try {
      const response = await axiosClient.get<Note>(
        `${this.NOTES_BASE_URL}/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleNoteError(error);
    }
  }

  /**
   * Create a new note
   */
  static async createNote(data: NoteCreate): Promise<Note> {
    try {
      const response = await axiosClient.post<Note>(this.NOTES_BASE_URL, data);
      return response.data;
    } catch (error: any) {
      throw this.handleNoteError(error);
    }
  }

  /**
   * Update an existing note
   */
  static async updateNote(id: string, data: NoteUpdate): Promise<Note> {
    try {
      const response = await axiosClient.patch<Note>(
        `${this.NOTES_BASE_URL}/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleNoteError(error);
    }
  }

  /**
   * Delete a note
   */
  static async deleteNote(id: string): Promise<void> {
    try {
      await axiosClient.delete(`${this.NOTES_BASE_URL}/${id}`);
    } catch (error: any) {
      throw this.handleNoteError(error);
    }
  }

  /**
   * Upload an image for a note
   */
  static async uploadImage(
    noteId: string,
    file: File
  ): Promise<ImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosClient.uploadFile<ImageUploadResponse>(
        `${this.NOTES_BASE_URL}/${noteId}/images`,
        formData
      );
      return response.data;
    } catch (error: any) {
      throw this.handleNoteError(error);
    }
  }

  /**
   * Handle note-related errors
   */
  private static handleNoteError(error: any): Error {
    if (error.response?.data) {
      const { message, error: errorType } = error.response.data;
      return new Error(message || `Note operation failed: ${errorType}`);
    }
    return new Error(error.message || "Note operation failed");
  }
}

export default NoteService;
