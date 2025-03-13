import axios from "axios";
axios.defaults.withCredentials = true;

const SERVER_URL = 'http://localhost:6001'

export async function apiGetUserTodos() {
    return await axios.get(`${SERVER_URL}/api/get-user-todos`)
}

export async function apiGetTodoById(todo_id) {
    return await axios.get(`${SERVER_URL}/api/get-todo-by-id/${todo_id}`)
}

export async function apiCreateTodo(createTodoData) {
    return await axios.post(`${SERVER_URL}/api/create-todo`, createTodoData)
}

export async function apiFullUpdateTodo(todo_id, fullUpdateTodoData) {
    return await axios.put(`${SERVER_URL}/api/update-full-todo/${todo_id}`, fullUpdateTodoData)
}

export async function apiPartialUpdateTodo(todo_id, partialUpdateTodoData) {
    return await axios.put(`${SERVER_URL}/api/update-partial-todo/${todo_id}`, partialUpdateTodoData)
}

export async function apiDeleteTodo(todo_id) {
    return await axios.delete(`${SERVER_URL}/api/delete-todo/${todo_id}`)
}