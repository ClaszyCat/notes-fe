"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { Dialog } from "@headlessui/react";
import {
  useNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
  useUploadNoteImage,
} from "../../hooks/useNotes";
import { useLogout } from "../../hooks/useAuth";
import { useCurrentUser } from "../../hooks/useUser";
import AuthGuard from "../../components/AuthGuard";
import { Note } from "../../interfaces/note";
import Image from "next/image";

export default function NotesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Queries and mutations
  const {
    data: notesData,
    isLoading,
    error,
  } = useNotes({
    page: 1,
    pageSize: 50,
  });
  const { data: currentUser } = useCurrentUser();
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();
  const uploadImageMutation = useUploadNoteImage();
  const logoutMutation = useLogout();

  // Handle image upload preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open modal for new note
  const openCreateModal = () => {
    setEditingNoteId(null);
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setImagePreview(undefined);
    setIsOpen(true);
  };

  // Open modal for editing
  const openEditModal = (note: Note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setDescription(note.body);
    setSelectedFile(null);
    setImagePreview(note.image_url || undefined);
    setIsOpen(true);
  };

  // Save note (create or update)
  const handleSave = async () => {
    if (!title.trim() || !description.trim()) return;

    try {
      if (editingNoteId) {
        // Update existing note
        await updateNoteMutation.mutateAsync({
          id: editingNoteId,
          data: {
            title: title.trim(),
            body: description.trim(),
          },
        });

        // Upload image if selected
        if (selectedFile) {
          await uploadImageMutation.mutateAsync({
            noteId: editingNoteId,
            file: selectedFile,
          });
        }
      } else {
        // Create new note
        const newNote = await createNoteMutation.mutateAsync({
          title: title.trim(),
          body: description.trim(),
        });

        console.log(newNote);

        // Upload image if selected
        if (selectedFile) {
          await uploadImageMutation.mutateAsync({
            noteId: newNote.results.id,
            file: selectedFile,
          });
        }
      }

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setImagePreview(undefined);
      setEditingNoteId(null);
      setIsOpen(false);
    } catch (error: any) {
      alert(error.message || "Failed to save note");
    }
  };

  // Handle delete
  const handleDelete = (note: Note) => {
    setNoteToDelete(note);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      await deleteNoteMutation.mutateAsync(noteToDelete.id);
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
    } catch (error: any) {
      alert(error.message || "Failed to delete note");
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setNoteToDelete(null);
  };

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get notes array from API response
  const notes = notesData?.results || [];

  // Generate random colors for notes (similar to your old UI)
  const getRandomColor = (id: string) => {
    const colors = [
      "bg-green-100",
      "bg-orange-100",
      "bg-blue-100",
      "bg-pink-100",
    ];
    // Use note id to consistently assign the same color
    const hash = id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
          <h1 className="flex items-center gap-2 font-bold text-lg">
            <img
              src="/sarana_ai_logo.jpeg"
              alt="Sarana Notes Logo"
              className="w-7 h-7 rounded"
            />
            Sarana Notes
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">
              {currentUser?.email || currentUser?.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Log out
            </button>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Plus size={16} /> Create Note
            </button>
          </div>
        </header>

        {/* Notes Grid */}
        <main className="p-6">
          <h2 className="text-lg font-semibold mb-4">Your Notes</h2>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-lg p-10 text-center text-gray-500 width-full shadow-md">
              <p className="mb-2">Loading notes...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-white rounded-lg p-10 text-center text-red-500 width-full shadow-md">
              <p className="mb-2">Failed to load notes</p>
              <p className="text-sm">Please try again.</p>
            </div>
          )}

          {/* No Notes State */}
          {!isLoading && !error && notes.length === 0 && (
            <div className="bg-white rounded-lg p-10 text-center text-gray-500 width-full shadow-md">
              <p className="mb-2">No notes yet</p>
              <p className="text-sm">Get started by creating a new note.</p>
            </div>
          )}

          {/* Notes Grid */}
          {!isLoading && !error && notes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`${getRandomColor(
                    note.id
                  )} rounded-lg shadow-md overflow-hidden cursor-pointer`}
                  onClick={() => {
                    setPreviewNote(note);
                    setIsPreviewOpen(true);
                  }}
                >
                  {note.image_url && (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${note.image_url}`}
                      alt={note.title}
                      width={400}
                      height={400}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4 max-w-xs">
                    <h2
                      className="font-semibold truncate w-full block"
                      style={{ maxWidth: "100%" }}
                      title={note.title}
                    >
                      {note.title}
                    </h2>
                    <p
                      className="text-sm text-gray-600 overflow-hidden w-full block"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                        minHeight: "2.5em",
                      }}
                      title={note.body}
                    >
                      {note.body}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Updated: {new Date(note.updated_at).toLocaleDateString()}
                    </p>
                    <div
                      className="flex gap-3 mt-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openEditModal(note)}
                        className="text-gray-600 hover:text-purple-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(note)}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Preview Note Modal */}
        <Dialog
          open={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-semibold">
                  {previewNote?.title}
                </Dialog.Title>
                <button onClick={() => setIsPreviewOpen(false)}>
                  <X className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              {previewNote?.image_url && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${previewNote.image_url}`}
                  alt={previewNote.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                  width={400}
                  height={400}
                />
              )}
              <div className="mb-4 text-gray-700 whitespace-pre-line">
                {previewNote?.body}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-4 py-2 rounded-md border"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Create/Edit Note Modal */}
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-semibold">
                  {editingNoteId ? "Edit Note" : "Create Note"}
                </Dialog.Title>
                <button onClick={() => setIsOpen(false)}>
                  <X className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              {/* Title */}
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-md p-2 mb-3"
              />

              {/* Image preview */}
              {imagePreview && (
                <Image
                  src={
                    imagePreview.includes("/uploads/")
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${imagePreview}`
                      : imagePreview
                  }
                  alt="preview"
                  className="w-full h-40 object-cover rounded-md mb-3"
                  width={400}
                  height={400}
                />
              )}

              {/* Description */}
              <textarea
                placeholder="Take a note..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-md p-2 mb-4 min-h-[80px]"
              />

              {/* Upload button */}
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 border p-2 rounded-md mb-3">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                ⬆️ {imagePreview ? "Change Image" : "Upload Image"}
              </label>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={
                    createNoteMutation.isPending || updateNoteMutation.isPending
                  }
                  className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50"
                >
                  {createNoteMutation.isPending || updateNoteMutation.isPending
                    ? "Saving..."
                    : "Save"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog
          open={isDeleteModalOpen}
          onClose={cancelDelete}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-semibold text-red-600">
                  Delete Note
                </Dialog.Title>
                <button onClick={cancelDelete}>
                  <X className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete this note?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteNoteMutation.isPending}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteNoteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </AuthGuard>
  );
}
