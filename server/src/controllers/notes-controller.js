const db = require('../db');


/**
 * Retrieves all todos for all users from database.
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * 
 * @warning potential security issue
 * @todo Please refine or delete this method in production
 */
exports.getAllTodos = async (req, res) => {
  try {
    const allTodos = await db.query("SELECT * FROM todos_table");
    return res.status(200).json({
      'message': 'Get all todos in database was successful',
      'todo': allTodos.rows
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({error: error.message});
  } 
};

/**
 * Retrieves a all todos for the authenticated user.
 * 
 * @param {Object} req - The Express request object.
 * @param {string} req.params.todo_id - The ID of the todo to retrieve.
 * @param {Object} res - The Express response object.
 * @returns {void} - Sends a JSON response with the todo item.
 * @note Requires authentication via JWT.
 */
exports.getUserTodos = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const allTodos = await db.query("SELECT * FROM todos_table WHERE user_id = $1", [user_id]);

    // Return
    return res.status(200).json({
      'message': 'Get current user all todos was successful',
      'todo': allTodos.rows
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({error: error.message});
  } 
};

/**
 * Retrieves a specific todo by its ID for the authenticated user.
 * 
 * @param {Object} req - The Express request object.
 * @param {string} req.params.todo_id - The ID of the todo to retrieve.
 * @param {Object} res - The Express response object.
 * @returns {void} - Sends a JSON response with the todo item.
 * @note Requires authentication via JWT.
 */
exports.getTodoById = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const todo_id = req.params.todo_id;

    // Check Params
    if (!todo_id) {return res.status(400).json({error: 'Field "todo_id" is required.'})}

    // Get Todo and perform checks
    const todo = await db.query("SELECT * FROM todos_table WHERE todo_id = $1", [todo_id]);
    if (todo.rows.length === 0) {return res.status(404).json({error: `Todo item with todo_id: ${todo_id} was not found.`})};
    if (todo.rows[0]['user_id'] != user_id) {return res.status(401).json({error: 'Unauthorized access to this todo item.'})};

    // Return
    return res.status(200).json({
      'message': 'Todo was successfully retrieved.',
      'todo': todo.rows
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({error: error.message});
  }
};

/**
 * Creates a todo for the authenticated user.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void} - Sends a JSON response with the todo item.
 * @note Requires authentication via JWT.
 */
exports.createTodo = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { title, description } = req.body;

    if (!title) {return res.status(422).json({error: 'Field "title" is required.'})};

    const newTodo = await db.query("INSERT INTO todos_table (title, user_id, description) VALUES($1, $2, $3) RETURNING *", [title, user_id, description]);
    
    if (!newTodo.rows) {res.status(404).json({error: 'Todo was added but error when retrieving.'})}

    return res.status(201).json({
      'message': 'New Todo was created',
      'todo': newTodo.rows
    });
  } catch (error) {  
    console.error(error.message);
    return res.status(500).json({error: error.message});
  }
};
  

/**
 * Updates a specific todo fully by its ID for the authenticated user.
 * 
 * @param {Object} req - The Express request object.
 * @param {string} req.params.todo_id - The ID of the todo to retrieve.
 * @param {Object} res - The Express response object.
 * @returns {void} - Sends a JSON response with the todo item.
 * @note Requires authentication via JWT.
 */
exports.updateFullTodo =  async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const todo_id = req.params.todo_id;
    const { title, description, completed } = req.body;

    // Check Params
    if (!todo_id) {return res.status(400).json({error: 'Field "todo_id" is required.'})};
    if (!title) {return res.status(422).json({error: 'Field "title" is required.'});};
    if (!completed) {return res.status(422).json({error: 'Field "completed" is required.'});};

    // Check if the todo exists or is authorized
    const checkTodo = await db.query("SELECT * FROM todos_table WHERE todo_id = $1", [todo_id]);
    if (checkTodo.rows.length === 0) {return res.status(404).json({error: `Todo item with todo_id: ${todo_id} was not found.`})};
    if (todo.rows[0]['user_id'] != user_id) {return res.status(401).json({error: 'Unauthorized access to this todo item.'})};

    // Update todo
    const updatedTodo = await db.query("UPDATE todos_table SET (title, description, completed) = ($1, $2, $3) WHERE user_id = $4 AND todo_id = $5 RETURNING *", [title, description, completed, user_id, todo_id]);

    // Check Response
    if (!updatedTodo.rows) {res.status(404).json({error: 'Todo was updated but error when retrieving.'})}

    // Return
    return res.status(200).json({
      'message': "Todo was updated!",
      'todo': updatedTodo.rows
    });
  } catch (error) { 
    console.error(error.message);
    return res.status(500).json({error: error.message})
  } 
};


/**
 * Updates a specific todo partially by its ID for the authenticated user.
 * 
 * @param {Object} req - The Express request object.
 * @param {string} req.params.todo_id - The ID of the todo to retrieve.
 * @param {Object} res - The Express response object.
 * @returns {void} - Sends a JSON response with the todo item.
 * @note Requires authentication via JWT.
 */
exports.updatePartialTodo = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const todo_id = req.params.todo_id;
    const { title, description, completed } = req.body;

    // Check Params
    if (!todo_id) {return res.status(400).json({error: 'Field "todo_id" is required.'})};
    
    // Partial Check
    let value_to_update;
    if      (title)       {value_to_update = ["title", title]}
    else if (description) {value_to_update = ["description", description]}
    else if (completed)   {value_to_update = ["completed", completed]}
    else {return res.status(422).json({error: 'Invalid request. Please provide either title, description or completed.'})}

    // Check if the todo exists or is authorized
    const checkTodo = await db.query("SELECT * FROM todos_table WHERE todo_id = $1", [todo_id]);
    if (checkTodo.rows.length === 0) {return res.status(404).json({error: `Todo item with todo_id: ${todo_id} was not found.`})};
    if (todo.rows[0]['user_id'] != user_id) {return res.status(401).json({error: 'Unauthorized access to this todo item.'})};

    // Update todo
    const updatedTodo = await db.query(`UPDATE todos_table SET ${value_to_update[0]} = $1 WHERE user_id = $2 AND todo_id = $3 RETURNING *`, [value_to_update[1], user_id, todo_id]);

    // Check Response
    if (!updatedTodo.rows) {res.status(404).json({error: 'Todo was updated but error when retrieving.'})}

    // Return
    return res.status(200).json({
      'message': "Todo was updated partially!",
      'todo': updatedTodo.rows
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
        error: error.message,
    })
  }
};


/**
 * Deletes a specific todo by its ID for the authenticated user.
 * 
 * @param {Object} req - The Express request object.
 * @param {string} req.params.todo_id - The ID of the todo to retrieve.
 * @param {Object} res - The Express response object.
 * @returns {void} - Sends a JSON response with the todo item.
 * @note Requires authentication via JWT.
 */
exports.deleteTodo = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const todo_id = req.params.todo_id;
    
    // Check Params
    if (!todo_id) {return res.status(400).json({error: 'Field "todo_id" is required.'})};


    // Check if the todo exists or is authorized
    const checkTodo = await db.query("SELECT * FROM todos_table WHERE todo_id = $1", [todo_id]);
    if (checkTodo.rows.length === 0) {return res.status(404).json({error: `Todo item with todo_id: ${todo_id} was not found.`})};
    if (todo.rows[0]['user_id'] != user_id) {return res.status(401).json({error: 'Unauthorized access to this todo item.'})};

    // Delete Todo
    const deletedTodo = await db.query("DELETE FROM todos_table WHERE user_id = $1 AND todo_id = $2 RETURNING *", [user_id, todo_id]);
    
    // Check Response
    if (!deletedTodo.rows) {res.status(404).json({error: 'Todo was deleted but error when retrieving.'})}

    // Return
    return res.status(200).json({
      'message': "Todo was deleted!",
      'todo': deletedTodo.rows
  });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
        error: error.message,
    })
  }
};