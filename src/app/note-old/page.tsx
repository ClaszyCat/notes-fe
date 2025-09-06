"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { Dialog } from "@headlessui/react";

interface Note {
  id: number;
  title: string;
  description: string;
  image?: string;
  color: string;
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  // Handle image upload preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open modal for new note
  const openCreateModal = () => {
    setEditingNoteId(null);
    setTitle("");
    setDescription("");
    setImage(undefined);
    setIsOpen(true);
  };

  // Open modal for editing
  const openEditModal = (note: Note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setDescription(note.description);
    setImage(note.image);
    setIsOpen(true);
  };

  // Save note (create or update)
  const handleSave = () => {
    if (!title.trim()) return;

    if (editingNoteId) {
      // Update existing note
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId
            ? { ...note, title, description, image }
            : note
        )
      );
    } else {
      // Create new note
      const colors = [
        "bg-green-100",
        "bg-orange-100",
        "bg-blue-100",
        "bg-pink-100",
      ];
      const newNote: Note = {
        id: Date.now(),
        title,
        description,
        image,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setNotes([...notes, newNote]);
    }

    // Reset form
    setTitle("");
    setDescription("");
    setImage(undefined);
    setEditingNoteId(null);
    setIsOpen(false);
  };

  return (
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
          <span className="text-gray-500">user@gmail.com</span>
          <a
            href="/"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Log out
          </a>
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
        {notes.length === 0 ? (
          <div className="bg-white rounded-lg p-10 text-center text-gray-500 width-full shadow-md">
            <p className="mb-2">No notes yet</p>
            <p className="text-sm">Get started by creating a new note.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`${note.color} rounded-lg shadow-md overflow-hidden cursor-pointer`}
                onClick={() => {
                  setPreviewNote(note);
                  setIsPreviewOpen(true);
                }}
              >
                {note.image && (
                  <img
                    src={note.image}
                    alt={note.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4 max-w-xs">
                  <h2 className="font-semibold truncate w-full block" style={{maxWidth: '100%'}} title={note.title}>
                    {note.title}
                  </h2>
                  <p
                    className="text-sm text-gray-600 overflow-hidden w-full block"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                      minHeight: '2.5em',
                    }}
                    title={note.description}
                  >
                    {note.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Updated: {new Date().toLocaleDateString()}
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
                      onClick={() =>
                        setNotes(notes.filter((n) => n.id !== note.id))
                      }
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                  {previewNote?.image && (
                    <img
                      src={previewNote.image}
                      alt={previewNote.title}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  )}
                  <div className="mb-4 text-gray-700 whitespace-pre-line">
                    {previewNote?.description}
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
          </div>
        )}
      </main>

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
            {image && (
              <img
                src={image}
                alt="preview"
                className="w-full h-40 object-cover rounded-md mb-3"
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
              ⬆️ {image ? "Change Image" : "Upload Image"}
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
                className="px-4 py-2 rounded-md bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
