import React from 'react';

interface NoteProps {
    note: string;
    noteId: string;
    onDelete: (noteId: string) => void;
}

const Note = ({ note, noteId, onDelete }: NoteProps) => {
    return (
        <div>
            <h6>{note}</h6>
            <button onClick={onDelete(noteId)}>Delete</button>
        </div>
    );
};

export default Note;