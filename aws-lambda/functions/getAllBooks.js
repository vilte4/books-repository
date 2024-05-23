const createConnection = require('../database');

exports.handler = async (event) => {
    const db = createConnection();

    try {
        const books = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM books LIMIT 1000', (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });

        console.log("Query result:", books);
        return {
            statusCode: 200,
            body: JSON.stringify(books)
        };
    } catch (error) {
        console.error('Error fetching books:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching books', error: error.toString() })
        };
    } finally {
        db.end();
    }
};
