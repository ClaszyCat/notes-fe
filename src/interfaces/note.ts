export interface Note {
  id: string;
  title: string;
  body: string;
  imageUrl?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
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
