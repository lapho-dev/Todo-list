import React from "react";

interface CreateNoteProps {
    userId: string | undefined;
    onCreateNote: (note: string) => void;
}

const CreateNote = ({ userId, onCreateNote }: CreateNoteProps) => {
    const [note, setNote] = React.useState("");

    const onSubmitForm = async (e) => {
        e.preventDefault();
        onCreateNote(note);
        setNote("");
    };

    return (
        <div>
            <h2>Create Note</h2>
            <form onSubmit={onSubmitForm}>
                <input
                    type="text"
                    name="note"
                    placeholder="Enter note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <button>Create Note</button>
            </form>
        </div>
    );
};

export default CreateNote;

