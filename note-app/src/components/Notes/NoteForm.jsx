import React, { useState } from 'react';

const NoteForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description });
        setTitle('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="note-form">
            <div className="form-group">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title"
                    required
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Note description"
                    required
                    className="form-control"
                />
            </div>
            <button type="submit" className="submit-button">
                Add Note
            </button>
        </form>
    );
};

export default NoteForm;
