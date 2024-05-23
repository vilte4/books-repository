const createConnection = require("../database");

exports.handler = async (event) => {
    
    const db = createConnection();
   
    const { user_id, isbn, rating } = JSON.parse(event.body);

    try {
        const result = await new Promise((resolve, reject) => {
            db.query('INSERT INTO ratings (user_id, isbn, rating) VALUES (?, ?, ?)', 
            [user_id, isbn, rating], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Rating added successfully', ratingId: result.insertId })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error adding rating', error: error.message })
        };
    } finally {
        db.end();
    }
};