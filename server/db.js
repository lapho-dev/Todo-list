const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo_list_db',
    password: 'tomho',
    port: 5432
});

module.exports = pool;