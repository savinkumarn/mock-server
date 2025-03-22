const fs = require('fs');
const path = require('path');
const mockserver = require('mockserver-node');
const mockserverClient = require('mockserver-client').mockServerClient;

// Start the mock server
mockserver.start_mockserver({
    serverPort: 1080,
    verbose: true
}).then(() => {
    console.log('Mock server started on port 1080');

    // Read all JSON files from the /mocks directory
    const mockDirectory = path.join(__dirname, 'mocks');
    fs.readdirSync(mockDirectory).forEach(file => {
        const filePath = path.join(mockDirectory, file);

        // Check if the file is a JSON file
        if (path.extname(file) === '.json') {
            // Load the mock request/response from the JSON file
            const mockData = require(filePath);

            // Set the mock response
            const client = mockserverClient('localhost', 1080);
            client
                .mockAnyResponse({
                    "httpRequest": mockData.request, // Use the request data from the JSON
                    "httpResponse": mockData.response // Use the response data from the JSON
                })
                .then(response => {
                    console.log(`Mock response set for ${file}`);
                })
                .catch(err => {
                    console.error(`Error setting mock response for ${file}:`, err);
                });
        }
    });

}).catch((err) => {
    console.error('Error starting the mock server:', err);
});
