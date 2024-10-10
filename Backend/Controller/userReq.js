const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/conversation.json');

module.exports = async function (req, res, next) {
    var output={
        message: null,
        data: null
    };
    try {
        const {messageStore,prompt_Generated} = req.body;

        let conversations = [];
        try {
            // Read the existing data from the file
            const data = await fs.readFile(filePath, 'utf8');
            conversations = JSON.parse(data);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error('Error reading file', err);
                return res.status(500).send('Failed to read data');
            }
            // If file does not exist, we will just start with an empty array
        }

        // Create a new conversation entry with index and date
        const newConversation = {
            conversation_id: conversations.length + 1,
            conversation_title: prompt_Generated,
            conversation_date: new Date().toISOString(),
            conversation_messages: messageStore
        };

        // Add the new conversation to the list
        conversations.push(newConversation);

        // Write the updated list back to the file
        await fs.writeFile(filePath, JSON.stringify(conversations, null, 2));
        output.message='Data inserted successfully!!!';
        output.data=newConversation.id;
        // console.log("Backend",output);
        res.send(output);
    } catch (error) {
        console.error('Error processing request', error);
        output.message='Failed to save data';
        res.send(output);
    }
};
