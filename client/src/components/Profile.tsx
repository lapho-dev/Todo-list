import React, { useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CreateNote from './CreateNote';
import Note from './Note';

interface ProfileProps {
    onLogout: () => void;
}

const Profile = ({ onLogout }: ProfileProps) => {
    const Navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const [ userNotes, setUserNotes ] = useState([]);


    useEffect(() => {
        const fetchUserNotes = async () => {
            try {
                const response = await fetch("http://localhost:6001/todos/" + userId, { method: "GET" });
                const data = await response.json();
                setUserNotes(data);
                console.log('User notes:', data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserNotes();
    }, [userId]);
    if (!userNotes) {
        return <div>Loading...</div>;
    }


    const createNote = async (note: string) => {
        try {
            const body = { title: note, user_id: userId };
            const response = await fetch("http://localhost:6001/todo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            console.log('Note created:', data);
            setUserNotes([...userNotes, data]);
            Navigate('/' + userId);
        } catch (error) {
            console.error('Error creating note:', error);
        }
    }

    const deleteNote = async (noteId: string) => {
        try {
            const response = await fetch("http://localhost:6001/todo/" + noteId, {
                method: "DELETE",
            });
            const data = await response.json();
            console.log('Note deleted:', data);
            setUserNotes(userNotes.filter((note: any) => note.id !== noteId));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }

    const logout = () => {
        onLogout();
    }

    return (
        <div>
            <h2>User Profile</h2>
            <p>userId: {userId}</p>

            <CreateNote userId={userId} onCreateNote={createNote} />

            <div>
                <h3>Notes</h3>
                {userNotes.map((note: { id: string; title: string }) => (
                    <div key={note.id}>
                        <Note note={note.title} noteId={note.id} onDelete={deleteNote} />
                    </div>
                ))}
            </div>
            <button onClick={logout}>Logout</button>
            
        </div>
    );
};

export default Profile;