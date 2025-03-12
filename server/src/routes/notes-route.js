const { Router } = require('express');
const router = Router();

const { getAllTodos, getUserTodos, getTodoById, createTodo, updateFullTodo, updatePartialTodo, deleteTodo } = require('../controllers/notes-controller');
const { userAuth } = require('../middlewares/auth-middleware');


// REST API routes //

// TODO need fixed
router.get('/get-all-todos', getAllTodos);

router.get('/get-user-todos', userAuth, getUserTodos);
router.get('/get-todo-by-id/:todo_id', userAuth, getTodoById);
router.post('/create-todo', userAuth, createTodo);
router.put('/update-full-todo/:todo_id', userAuth, updateFullTodo);
router.put('/update-partial-todo/:todo_id', userAuth, updatePartialTodo);
router.delete('/delete-todo/:todo_id', userAuth, deleteTodo);


module.exports = router;