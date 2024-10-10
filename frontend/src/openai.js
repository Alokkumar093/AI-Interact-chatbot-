const  OpenAIApi = require('openai');
const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
// console.log("openai",apiKey);

const openai = new OpenAIApi({ apiKey, dangerouslyAllowBrowser: true });
// secret_key = ""

// Define and export an async function to send a message to OpenAI
async function sendMsgToOpenAI(message) {
    // console.log(message);
    try {
        // prompt = "Consider yourself to be a code genretater. Provide correct code for the following instructions: "+message;
        // Use the OpenAIApi instance to create a completion
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "gpt-3.5-turbo",
            

        });
        // console.log(chatCompletion);
        // Handle response here
        // console.log(res);
        // const responseText = chatCompletion.data.choices[0].message.content;
        const responseText = chatCompletion.choices[0].message.content;
        // console.log("Response from OpenAI:", responseText);
        return responseText; // Return the response text
    } catch (error) {
        // Handle error here
        console.error('Error sending message to OpenAI:', error);
    }
}

// Export the function
module.exports = {sendMsgToOpenAI};