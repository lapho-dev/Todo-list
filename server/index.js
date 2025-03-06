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
// User routes
app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users_table");
    return res.status(200).json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    logger.error(`Error handling ${req.method} request to ${req.url}: ${err.message}`);
  } 
}
);

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {   
    const user = await pool.query("SELECT * FROM users_table WHERE user_id = $1", [id]);
    return res.status(200).json(user.rows);
  } catch (err) {
    console.error(err.message);
  }
}
);

app.post("/user", async (req, res) => {
    const { username, password } = req.body;
    try {
      const newUser = await pool.query("INSERT INTO users_table (username, password) VALUES($1, $2) RETURNING *", [username, password]);
      return res.status(201).json(newUser.rows);
    } catch (err) {
      console.error(err.message);
    }
  }
);

app.put("/user/:id", async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
      const updatedUser = await pool.query("UPDATE users_table SET username = $1, password = $2 WHERE user_id = $3", [username, password, id]);
      return res.status(200).json("User was updated!");
    } catch (err) {
      console.error(err.message);
    }
  }
);

app.delete("/user/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const deletedUser = await pool.query("DELETE FROM users_table WHERE user_id = $1", [id]);
      return res.status(200).json("User was deleted!");
    } catch (err) {
      console.error(err.message);
    }
  }
);






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