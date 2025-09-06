export interface Note {
  id: string;
  title: string;
  body: string;
  image_url?: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface NoteResponse {
  results: Note;
}

export interface NoteCreate {
  title: string;
  body: string;
}

export interface NoteUpdate {
  title?: string;
  body?: string;
  imageUrl?: string | null;
}

export interface NotePage {
  results: Note[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ImageUploadResponse {
  noteId: string;
  imageUrl: string;
}

export interface NoteSearchParams {
  q?: string;
  page?: number;
  pageSize?: number;
}
