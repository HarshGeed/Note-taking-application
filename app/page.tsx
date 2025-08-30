'use client'
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  // Fetch notes when component mounts
  useEffect(() => {
    if (session?.user?.email) {
      fetchNotes();
    }
  }, [session]);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const createNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotes([data.note, ...notes]);
        setNewNote({ title: '', content: '' });
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
    setLoading(false);
  };

  const deleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setNotes(notes.filter(note => note._id !== noteId));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const openViewModal = (note: Note) => {
    setSelectedNote(note);
    setIsViewModalOpen(true);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
          <a href="/signin" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white items-center justify-start pt-6">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between px-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          <span className="font-semibold text-lg text-gray-800">Dashboard</span>
        </div>
        <button 
          onClick={() => signOut()}
          className="text-blue-600 hover:underline font-medium text-sm"
        >
          Sign Out
        </button>
      </div>

      {/* Welcome Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow p-4 mb-4">
        <p className="font-bold text-gray-800 text-lg">Welcome, {session.user?.name || 'User'} !</p>
        <p className="text-gray-500 text-sm mt-1">Email: {session.user?.email}</p>
      </div>

      {/* Create Note Button */}
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow mb-4"
      >
        Create Note
      </button>

      {/* Notes List */}
      <div className="w-full max-w-md">
        <p className="font-semibold text-gray-800 mb-2">Notes</p>
        <div className="space-y-3">
          {notes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No notes yet. Create your first note!</p>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2 shadow">
                <span 
                  className="text-gray-700 cursor-pointer hover:text-blue-600 flex-1"
                  onClick={() => openViewModal(note)}
                >
                  {note.title}
                </span>
                <button 
                  onClick={() => deleteNote(note._id)}
                  className="text-gray-500 hover:text-red-500 ml-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Note Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Create New Note</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Enter note title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Write your note here..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={createNote}
                disabled={loading || !newNote.title.trim() || !newNote.content.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Note Modal */}
      {isViewModalOpen && selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">View Note</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                  {selectedNote.title}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 min-h-[150px] whitespace-pre-wrap">
                  {selectedNote.content}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created At
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                  {new Date(selectedNote.createdAt).toLocaleDateString()} {new Date(selectedNote.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
