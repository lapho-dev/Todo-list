const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db")
const { loggerMiddileware } = require('./logger/logger');
const {PORT, CLIENT_URL} = require('./constants');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./middlewares/passport-middleware')

// Middleware // 
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(passport.initialize());

// Middleware to log requests and responses
app.use(loggerMiddileware);


// Routes //
// Import Routes
const routeAuth = require('./routes/auth');

// Initialize routes
app.use('/api', routeAuth)

 
// Routes
// User routes

// Debug get all user
// app.get("/users", async (req, res) => {
//   try {
//     const allUsers = await pool.query("SELECT * FROM users_table");
//     return res.status(200).json(allUsers.rows);
//   } catch (err) {
//     console.error(err.message);
//     logger.error(`Error handling ${req.method} request to ${req.url}: ${err.message}`);
//   } 
// }
// );

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

app.put("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const loginUser = await pool.query("SELECT * FROM users_table WHERE username = $1 AND password = $2", [username, password]);
      return res.status(200).json(loginUser);
    } catch (err) {
      console.error(err.message);
    }
  }
);

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
      const newUser = await pool.query("INSERT INTO users_table (username, password) VALUES($1, $2) RETURNING *", [username, password]);
      return res.status(201).json(newUser);
    } catch (err) {
      console.error(err.message);
    }
  }
);

app.put("/user/account/:id", async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
      const updatedUser = await pool.query("UPDATE users_table SET username = $1, password = $2 WHERE user_id = $3 RETURNING *", [username, password, id]);
      return res.status(200).json(updatedUser.rows);
    } catch (err) {
      console.error(err.message);
    }
  }
);

app.delete("/user/account/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const deletedUser = await pool.query("DELETE FROM users_table WHERE user_id = $1", [id]);
      return res.status(200).json(deletedUser.rows + "User was deleted!");
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

// Get all todos for a user
app.get("/todos/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    console.log(user_id);
    const allTodos = await pool.query("SELECT * FROM todos_table WHERE user_id = $1", [user_id]);
    return res.status(200).json(allTodos.rows);
  } catch (err) {
    console.error("error is here");
    console.error(err.message);
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
    console.log(req.body);
    const { title , user_id } = req.body;
    const newTodo = await pool.query("INSERT INTO todos_table (title, user_id) VALUES($1, $2) RETURNING *", [title, user_id]);
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
const port = PORT || 5000;

const appStart = () => {
  try {
    app.listen(port, () => {
      console.log("Server listening on http://localhost:" + port);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
};

appStart(); 

module.exports = {app};