const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');
const parseRequestBody = require('./parseRequestBody');

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

app.http('createRating', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        if (!request.body) {
            context.res = {
                status: 400,
                body: "Request body is missing"
            };
            return;
        }

        context.log('Received body:', request.body);

        const parsedBody = await parseRequestBody(request, context);
        const { user_id, isbn, rating } = parsedBody;

        context.log('Parsed body:', user_id, isbn, rating);

        try {
            const conn = await pool.getConnection();

            try {
                const [results] = await conn.query(
                    'INSERT INTO ratings (user_id, isbn, rating) VALUES (?, ?, ?);',
                    [user_id, isbn, rating]
                );
                context.log(`Rating added with ID: ${results.insertId}`);
                context.res = {
                    status: 201,
                    body: `Rating added with ID: ${results.insertId}`
                };
            } catch (error) {
                context.log(`Error adding rating: ${error}`);
                context.res = {
                    status: 500,
                    body: `Error adding rating: ${error}`
                };
            } finally {
                conn.release();
            }
        } catch (error) {
            context.log(`Database connection failed: ${error}`);
            context.res = {
                status: 500,
                body: `Database connection failed: ${error}`
            };
        }
    }
});

