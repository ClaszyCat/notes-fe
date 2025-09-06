"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, X, Search, LogOut, Upload } from "lucide-react";
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
import { Note, NoteCreate, NoteUpdate } from "../../interfaces/note";

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Form state
  const [formData, setFormData] = useState({ title: "", body: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Queries and mutations
  const {
    data: notesData,
    isLoading,
    error,
  } = useNotes({
    q: searchQuery || undefined,
    page,
    pageSize: 20,
  });
  const { data: currentUser } = useCurrentUser();
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();
  const uploadImageMutation = useUploadNoteImage();
  const logoutMutation = useLogout();

  // Handle form submission for create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.body.trim()) return;

    try {
      const newNote = await createNoteMutation.mutateAsync({
        title: formData.title.trim(),
        body: formData.body.trim(),
      });

      // Upload image if selected
      if (selectedFile) {
        await uploadImageMutation.mutateAsync({
          noteId: newNote.id,
          file: selectedFile,
        });
      }

      setFormData({ title: "", body: "" });
      setSelectedFile(null);
      setIsCreateOpen(false);
    } catch (error: any) {
      alert(error.message || "Failed to create note");
    }
  };

  // Handle form submission for edit
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedNote || !formData.title.trim() || !formData.body.trim())
      return;

    try {
      await updateNoteMutation.mutateAsync({
        id: selectedNote.id,
        data: {
          title: formData.title.trim(),
          body: formData.body.trim(),
        },
      });

      // Upload image if selected
      if (selectedFile) {
        await uploadImageMutation.mutateAsync({
          noteId: selectedNote.id,
          file: selectedFile,
        });
      }

      setFormData({ title: "", body: "" });
      setSelectedFile(null);
      setIsEditOpen(false);
      setSelectedNote(null);
    } catch (error: any) {
      alert(error.message || "Failed to update note");
    }
  };

  // Handle delete
  const handleDelete = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNoteMutation.mutateAsync(noteId);
    } catch (error: any) {
      alert(error.message || "Failed to delete note");
    }
  };

  // Open edit modal
  const openEditModal = (note: Note) => {
    setSelectedNote(note);
    setFormData({ title: note.title, body: note.body });
    setSelectedFile(null);
    setIsEditOpen(true);
  };

  // Open preview modal
  const openPreview = (note: Note) => {
    setSelectedNote(note);
    setIsPreviewOpen(true);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    }
  };

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Sarana Notes
                </h1>
                {currentUser && (
                  <span className="ml-4 text-gray-600">
                    Welcome, {currentUser.name}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Create Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Note
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              Failed to load notes. Please try again.
            </div>
          )}

          {/* Notes Grid */}
          {notesData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {notesData?.results?.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openPreview(note)}
                  >
                    {note.imageUrl && (
                      <img
                        src={note.imageUrl}
                        alt={note.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {note.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {note.body}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(note);
                            }}
                            className="text-gray-500 hover:text-blue-600 transition"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(note.id);
                            }}
                            className="text-gray-500 hover:text-red-600 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {notesData?.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 border border-gray-300 rounded-lg bg-blue-50">
                      {page} of {notesData?.totalPages}
                    </span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={!notesData?.hasNext}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {notesData?.results?.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    {searchQuery
                      ? "No notes found matching your search"
                      : "No notes yet"}
                  </div>
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create your first note
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* Create Note Modal */}
        <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-semibold">
                  Create New Note
                </Dialog.Title>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={formData.body}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, body: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      createNoteMutation.isPending ||
                      uploadImageMutation.isPending
                    }
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {createNoteMutation.isPending ||
                    uploadImageMutation.isPending
                      ? "Creating..."
                      : "Create"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Edit Note Modal */}
        <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-semibold">
                  Edit Note
                </Dialog.Title>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={formData.body}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, body: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                  {selectedNote?.imageUrl && !selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      Current image will be kept
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      updateNoteMutation.isPending ||
                      uploadImageMutation.isPending
                    }
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {updateNoteMutation.isPending ||
                    uploadImageMutation.isPending
                      ? "Updating..."
                      : "Update"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Preview Note Modal */}
        <Dialog open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-lg">
              {selectedNote && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-semibold">
                      {selectedNote.title}
                    </Dialog.Title>
                    <button
                      onClick={() => setIsPreviewOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {selectedNote.imageUrl && (
                    <img
                      src={selectedNote.imageUrl}
                      alt={selectedNote.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{selectedNote.body}</p>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <span className="text-sm text-gray-500">
                      Last updated:{" "}
                      {new Date(selectedNote.updatedAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsPreviewOpen(false);
                          openEditModal(selectedNote);
                        }}
                        className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setIsPreviewOpen(false);
                          handleDelete(selectedNote.id);
                        }}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </AuthGuard>
  );
}
