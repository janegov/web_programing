import React, { useState, useEffect } from 'react';
import notesService from '../../services/notesService';
import { useAuth } from '../../context/AuthProvider';
import NoteItem from './NoteItem';
import NoteForm from './NoteForm';
import './Notes.css';

const NotesList = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                const response = await notesService.getNotes(searchTerm);
                setNotes(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch notes');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchNotes();
        }
    }, [user, searchTerm]);

    const handleDelete = async (id) => {
        try {
            await notesService.deleteNote(id);
            setNotes(notes.filter(note => note.id !== id));
        } catch (err) {
            setError('Failed to delete note');
            console.error(err);
        }
    };

    const handleCreate = async (noteData) => {
        try {
            const response = await notesService.createNote({
                title: noteData.title.trim(),
                description: noteData.description.trim()
            });
            setNotes([...notes, response.data]);
            setError(null);
        } catch (err) {
            console.error('Error in handleCreate:', err);
            if (err.response?.data?.errors) {
                // Handle validation errors
                const errorMessages = Object.entries(err.response.data.errors)
                    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                    .join('\n');
                setError(`Validation errors:\n${errorMessages}`);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to create note. Please try again.');
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="notes-container">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <NoteForm onSubmit={handleCreate} />

            <div className="notes-list">
                {notes.map(note => (
                    <NoteItem
                        key={note.id}
                        note={note}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotesList;
