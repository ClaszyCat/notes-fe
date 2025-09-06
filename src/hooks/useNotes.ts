import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NoteService } from "../services/modules/noteService";
import {
  Note,
  NoteCreate,
  NoteUpdate,
  NotePage,
  NoteSearchParams,
  ImageUploadResponse,
} from "../interfaces/note";

export const NOTE_QUERY_KEYS = {
  all: ["notes"] as const,
  lists: () => [...NOTE_QUERY_KEYS.all, "list"] as const,
  list: (params?: NoteSearchParams) =>
    [...NOTE_QUERY_KEYS.lists(), params] as const,
  details: () => [...NOTE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...NOTE_QUERY_KEYS.details(), id] as const,
};

/**
 * Hook to get paginated notes with search
 */
export function useNotes(params?: NoteSearchParams) {
  return useQuery({
    queryKey: NOTE_QUERY_KEYS.list(params),
    queryFn: () => NoteService.getNotes(params),
  });
}

/**
 * Hook to get a single note
 */
export function useNote(id: string, enabled = true) {
  return useQuery({
    queryKey: NOTE_QUERY_KEYS.detail(id),
    queryFn: () => NoteService.getNote(id),
    enabled: enabled && Boolean(id),
  });
}

/**
 * Hook to create a new note
 */
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoteCreate) => NoteService.createNote(data),
    onSuccess: (newNote: Note) => {
      // Invalidate and refetch notes list
      queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.lists() });

      // Add the new note to the detail cache
      queryClient.setQueryData(NOTE_QUERY_KEYS.detail(newNote.id), newNote);
    },
  });
}

/**
 * Hook to update a note
 */
export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NoteUpdate }) =>
      NoteService.updateNote(id, data),
    onSuccess: (updatedNote: Note) => {
      // Update the specific note in cache
      queryClient.setQueryData(
        NOTE_QUERY_KEYS.detail(updatedNote.id),
        updatedNote
      );

      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.lists() });
    },
  });
}

/**
 * Hook to delete a note
 */
export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => NoteService.deleteNote(id),
    onSuccess: (_, deletedId) => {
      // Remove the note from detail cache
      queryClient.removeQueries({
        queryKey: NOTE_QUERY_KEYS.detail(deletedId),
      });

      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.lists() });
    },
  });
}

/**
 * Hook to upload an image for a note
 */
export function useUploadNoteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, file }: { noteId: string; file: File }) =>
      NoteService.uploadImage(noteId, file),
    onSuccess: (data: ImageUploadResponse, { noteId }) => {
      // Update the note in cache with the new image URL
      queryClient.setQueryData(
        NOTE_QUERY_KEYS.detail(noteId),
        (oldNote: Note | undefined) => {
          if (oldNote) {
            return { ...oldNote, imageUrl: data.imageUrl };
          }
          return oldNote;
        }
      );

      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEYS.lists() });
    },
  });
}
