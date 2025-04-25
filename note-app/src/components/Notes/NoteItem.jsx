import React from 'react';

const NoteItem = ({ note, onDelete }) => {
  return (
    <div className="note-item">
      <div className="note-content">
        <h3>{note.title}</h3>
        <p>{note.description}</p>
      </div>
      <button
        className="delete-button"
        onClick={() => onDelete(note._id)}
      >
        Delete
      </button>
    </div>
  );
};

export default NoteItem;
