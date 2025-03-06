const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { logRequest } = require('./logger/logger');


const port = process.env.PORT || 5000;


// Middleware // 
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Middleware to log requests and responses
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const timeTaken = Date.now() - startTime;
    const status = res.statusCode;
    const method = req.method;
    const path = req.originalUrl;
    const sender = req.headers['user-agent'] || 'Unknown'; // Use user-agent as sender
    logRequest(status, method, timeTaken, path, sender);
  });
  next();
});


// Routes
// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todos_table");
    return res.status(200).json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    logger.error(`Error handling ${req.method} request to ${req.url}: ${err.message}`);
  } 
});

// Get a todo
app.get("/todo/:id", async (req, res) => {
  const { id } = req.params;
  try {   
    const todo = await pool.query("SELECT * FROM todos_table WHERE todo_id = $1", [id]);
    return res.status(200).json(todo.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Create a todo
app.post("/todo", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query("INSERT INTO todos_table (description) VALUES($1) RETURNING *", [description]);
    return res.status(201).json(newTodo.rows);
  } catch (err) {  
    console.error(err.message);
  }
});
 
// Update a todo
app.put("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updatedTodo = await pool.query("UPDATE todos_table SET description = $1 WHERE todo_id = $2", [description, id]);
    return res.status(200).json("Todo was updated!");
  } catch (err) { 
    console.error(err.message);
  } 
});

// Delete a todo
app.delete("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await pool.query("DELETE FROM todos_table WHERE todo_id = $1", [id]);
    return res.status(200).json("Todo was deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

// Default route
app.get("/", (req, res) => {
  return res.status(200).send({
    message: "Hello World!",
  });
});

// Start server
app.listen(port, () => {
  console.log("Listening on " + port);
});

module.exports = app;