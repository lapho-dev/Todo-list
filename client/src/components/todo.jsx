import React, { useState } from "react";
import { apiDeleteTodo, apiFullUpdateTodo } from "../api/notes.api";

const Todo = ({ todo, onDeleteLocalTodoList, onUpdateLocalTodoList }) => {

    const [todoContent, setTodoContent] = useState({
        todo_id: todo.todo_id,
        user_id: todo.user_id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        created_date: todo.created_date,
    });

    /**
     * Update todoContent to local and server
     * 
     * @param {*} new_todoContent - Provide a new copy of todo Content
     * 
     * @api call apiFullUpdateTodo
     */
    const onTriggerUpdateTodo = async (new_todoContent) => {
        try {
            // update to local todolist
            onUpdateLocalTodoList(new_todoContent);
            // Call full update todo api
            await apiFullUpdateTodo(new_todoContent.todo_id, new_todoContent);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Delete the current todo object for client and server
     * 
     * @api Call apiDeleteTodo
     */
    const onTriggerDeleteTodo = async () => {
        try {
            // Client - Remove from todoList
            onDeleteLocalTodoList(todoContent);
            // Server - Remove from database 
            await apiDeleteTodo(todoContent.todo_id);
        } catch (error) {
            console.error(error)
        }
    };

    /**
     * Triggers switch for completed of the selected todo
     * 
     * It will also remove from Uncompleted TodoList and 
     * appedn itself to Completed TodoList
     */
    const onCompletedSwitch = async () => {
        try {
            // Make a new copy of todo
            const new_todoContent = { ...todoContent, ['completed']: !todoContent.completed };
            // Update todoContent for next render
            setTodoContent(new_todoContent);
            // Update todoItem in the todoList
            onTriggerUpdateTodo(new_todoContent);
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <div>
            <h4>id: {todoContent.todo_id} {todoContent.title}</h4>
            <p>{todoContent.description}</p>
            <button onClick={() => onTriggerDeleteTodo()} className='btn btn-primary'>delete</button>
            <button onClick={() => onTriggerUpdateTodo(todoContent)} className='btn btn-primary'>update</button>
            <button onClick={() => onCompletedSwitch()} className='btn btn-primary'>{todoContent.completed === true ? 'yes' : 'no'}</button>
        </div>
    )
}

export default Todo;