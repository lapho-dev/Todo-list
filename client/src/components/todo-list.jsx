import { useState, useEffect } from "react";
import { apiGetUserTodos } from "../api/notes.api";
import Todo from "./todo";
import CreateTodo from "./create-todo";

const TodoList = () => {

    const [todoList, setTodoList] = useState([]);
    const [isCreateTodoOpen, setIsCreateTodoOpen] = useState(false);

    const hasActiveTodos = todoList.some((todo) => !todo.completed);
    const hasCompletedTodos = todoList.some((todo) => todo.completed);

    // Fetch TodoList for current user
    const onFetchTodoList = async () => {
        try {
            const response = await apiGetUserTodos();
            setTodoList(response.data.todo);
            if (!hasActiveTodos) { setIsCreateTodoOpen(true) };
        } catch (error) {
            console.error(error);
        }
    }
    // Triger fetch todolist once on page load
    useEffect(() => {
        onFetchTodoList()
    }, [])

    // Trigger open createTodo tap if there is no active todos when todolist is updated
    useEffect(() => {
        const hasActiveTodos = todoList.some((todo) => !todo.completed);
        setIsCreateTodoOpen(!hasActiveTodos);
    }, [todoList]);

    // Update Local TodoList with a new / modified todo
    const onUpdateLocalTodoList = (todo) => {
        try {
            setTodoList(prevTodoList => {
                const existingTodoIndex = prevTodoList.findIndex(
                    item => item.todo_id === todo.todo_id
                );

                if (existingTodoIndex !== -1) {
                    const updatedList = [...prevTodoList];
                    updatedList[existingTodoIndex] = {
                        ...updatedList[existingTodoIndex],
                        ...todo
                    };
                    return updatedList;
                } else {
                    return [...prevTodoList, todo];
                }
            });
            if (!hasActiveTodos) { setIsCreateTodoOpen(true) };
        } catch (error) {
            console.error(error);
        }
    };
    // Remove Local TodoList with a deleted todo
    const onDeleteLocalTodoList = (todo) => {
        try {
            setTodoList(prevTodoList => {
                const existingTodoIndex = prevTodoList.findIndex(
                    item => item.todo_id === todo.todo_id
                );

                if (existingTodoIndex !== -1) {
                    const updatedList = [...prevTodoList];
                    updatedList.splice(existingTodoIndex, 1);
                    return updatedList;
                } else {
                    throw new Error('Attempting to delete an undefined todo.')
                }
            });
            if (!hasActiveTodos) { setIsCreateTodoOpen(true) };
        } catch (error) {
            console.error(error);
        }
    };

    const onClickCreateTodoButton = () => {
        try {
            setIsCreateTodoOpen(!isCreateTodoOpen);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <button onClick={onClickCreateTodoButton}>{isCreateTodoOpen ? ' - ' : ' + '}</button>
            {isCreateTodoOpen && <CreateTodo onUpdateLocalTodoList={onUpdateLocalTodoList} />}

            {hasActiveTodos &&
                <div>
                    <h3>List Of Todos</h3>
                    <section>
                        {todoList.filter((todo) => !todo.completed)
                            .map((todo) => <Todo key={todo.todo_id} todo={todo} onDeleteLocalTodoList={onDeleteLocalTodoList} onUpdateLocalTodoList={onUpdateLocalTodoList} />)}
                    </section>
                </div>
            }
            {hasCompletedTodos &&
                <div>
                    <h3>List of completed todos</h3>
                    <section>
                        {todoList.filter((todo) => todo.completed)
                            .map((todo) => <Todo key={todo.todo_id} todo={todo} onDeleteLocalTodoList={onDeleteLocalTodoList} onUpdateLocalTodoList={onUpdateLocalTodoList} />)}
                    </section>
                </div>
            }
        </>
    )
}

export default TodoList;
