const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
});

app.http('getAllBooks', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        let conn;
        try {
            conn = await pool.getConnection();

            const [books] = await conn.query('SELECT * FROM books LIMIT 1000');

            context.log("Query result:", books);
            return {
                status: 200,
                body: JSON.stringify(books),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        } catch (error) {
            context.log('Error fetching books:', error);
            return {
                status: 500,
                body: JSON.stringify({ message: 'Error fetching books', error: error.toString() }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        } finally {
            if (conn) conn.release();
        }
    }
});
