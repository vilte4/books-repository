async function parseRequestBody(request, context) {
    let parsedBody = null;

    if (request.body instanceof ReadableStream) {
        const reader = request.body.getReader();
        let rawData = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                rawData += new TextDecoder("utf-8").decode(value);
            }
            reader.releaseLock();
            parsedBody = JSON.parse(rawData);
        } catch (error) {
            context.log('Error reading or parsing body:', error);
            throw new Error("Error processing request body");
        }
    } else {
        parsedBody = request.body;
    }

    return parsedBody;
}

module.exports = parseRequestBody;