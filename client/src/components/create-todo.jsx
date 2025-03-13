import { useState } from "react";
import { apiCreateTodo } from "../api/notes.api";

const CreateTodo = ({ onUpdateLocalTodoList }) => {
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
    });

    const [error, setError] = useState(false)


    // Create a New todo - Entering
    const onEnterNewTodo = (e) => {
        setNewTodo({ ...newTodo, [e.target.name]: e.target.value })
    };
    // Create a New todo - Submit
    const onSubmitNewTodo = async (e) => {
        e.preventDefault()

        try {
            const response = await apiCreateTodo(newTodo);

            onUpdateLocalTodoList(response.data.todo[0]);

        } catch (error) {
            if (error.response.data.error) {
                console.log(error.response.data.error)
                setError(error.response.data.error)
            } else {
                console.log(error.response.data.errors[0].msg)
                setError(error.response.data.errors[0].msg)
            }
        }
    }

    return (
        <div>
            <h3>-- Create a New Todo --</h3>
            <form onSubmit={(e) => onSubmitNewTodo(e)}>
                <div>
                    <label htmlFor='title' className='form-label'>
                        Title
                    </label>
                    <input
                        onChange={(e) => onEnterNewTodo(e)}
                        type='title'
                        className='form-control'
                        id='title'
                        name='title'
                        value={newTodo.title}
                        placeholder='title'
                    />
                </div>
                <div>
                    <label htmlFor='description' className='form-label'>
                        Description
                    </label>
                    <input
                        onChange={(e) => onEnterNewTodo(e)}
                        type='description'
                        className='form-control'
                        id='description'
                        name='description'
                        value={newTodo.description}
                        placeholder='description'
                    />
                </div>
                <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>
                <button type='submit' className='btn btn-primary'>
                    Create
                </button>
            </form>
        </div>
    )
};

export default CreateTodo;