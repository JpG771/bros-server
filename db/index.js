const { Pool } = require('pg');

const pool = new Pool();

module.exports = {
    query: (text, params, callback) => {
        const start = Date.now();
        return pool.query(text, params, (err, res) => {
            const duration = Date.now() - start;
            console.log('executed query', { text, duration, rows: res ? res.rowCount : 0 }); // Default log
            callback(err, res);
        });
    },
    // Only use for main query
    // named query will not be parsed by PostgreSQL the 2nd time
    optimisedQuery: (uniqueQueryName, text, params, callback) => {
        const queryObject = {
            name: uniqueQueryName,
            text: text,
            values: params
        }
        return pool.query(queryObject, callback);
    }
}