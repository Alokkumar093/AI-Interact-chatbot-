const fs = require('fs');
const path = require('path');

module.exports = async function (req, res, next) {
    // console.log("Hiii");
   

    /* Check if userName already exists in the DB --> don't insert --> return Error message to UI */
    /* If user doesn't exist ---> insert in DB */

    // Path to the conversation.json file
    const filePath = path.join(__dirname, '../data/conversation.json');

    // Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send({ error: "Error reading conversation data" });
        }

        try {
            // Parse the JSON data
            const conversationData = JSON.parse(data);
            
            // Create a response object with the conversation data
            let response = {
                message: "User data processed successfully",
                conversationData: conversationData
            };

            // Send the response
            res.send(response);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).send({ error: "Error parsing conversation data" });
        }
    });
};
