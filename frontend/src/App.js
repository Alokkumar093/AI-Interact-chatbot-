import './App.css';
import { useEffect, useState, useRef, useCallback } from 'react';
import { saveAs } from 'file-saver';
//import gptLogo from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon1 from './assets/user_icon1.png';
import { sendMsgToOpenAI } from './openai';
import { gemini_model_call } from './gemini';
import chatbot from './assets/chatbot.png';

function App() {
  const msgEnd = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hi, I am Chatbot, How can I help You",
      isBot: true,
    }
  ]);

  const [messageStore, setMessageStore] = useState([]);
  const [promptdetails, setPromptDetails] = useState([]);
  const [description, setDescription] = useState("");
  const [promptText, setPromptText] = useState([
    {
      text: null,
      id: null
    }
  ]);
  const [conversationList, setConversationList] = useState([]);

  const handleSave = async (e) => {
    const prompt = "Give me 3 word short description of prompt as I want to save user prompt with that name only. Here is the prompt: " + messageStore[0].user;
    var prompt_Generated = await gemini_model_call(prompt);

    const response = await fetch('http://localhost:3001/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ messageStore, prompt_Generated })
    });

    const dataa = await response.json();
    // console.log("Frontend", dataa);

    if (dataa.message === "Data inserted successfully!!!") {
      // console.log("Final", messageStore, dataa.data);
      setPromptText(prevPromptText => [
        ...prevPromptText,
        { text: messageStore, id: dataa.data }
      ]);
      setDescription(prompt_Generated);

      // console.log("Test", promptText);
    }
    alert(dataa);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/getData`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const output = await response.json();
      // console.log("fetchData", output);
      if (output.message === "User data processed successfully") {
        setConversationList(output.conversationData);
      } else {
        console.log("Error in Fetching Data");
      }
    } catch (error) {
      console.error('Dashboard :', error.message);
    }
  }, []);

  const handlesend = async () => {
    try {
      const user_input = input;
      setInput('');

      setMessages([
        ...messages,
        { text: user_input, isBot: false }
      ]);

      const res = await gemini_model_call(user_input);

      setMessageStore([
        ...messageStore,
        {
          user: user_input,
          chatbot: res
        }
      ]);

      setMessages([
        ...messages,
        { text: user_input, isBot: false },
        { text: res, isBot: true }
      ]);
      // console.log(setMessages);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEnter = async (e) => {
    if (e.key === 'Enter') await handlesend();
  }

  const handleConversationClick = (conversation) => {
    // console.log("Conversation clicked:", conversation);
    setPromptDetails(conversation.conversation_messages);
  };

  const handleDownload = () => {
    const fileContent = promptdetails.length > 0 ? promptdetails : messages;
    const blob = new Blob([JSON.stringify(fileContent, null, 2)], { type: 'application/json' });
    saveAs(blob, 'conversation.json');
  };

  useEffect(() => {
    fetchData();
    // console.log("promptDetails updated:", promptdetails);
    msgEnd.current.scrollIntoView();
  }, [messages, promptText, fetchData, promptdetails]);

  return (
    <div className="App">
      <div className="sideBar">
        <div className="upperSide">
          <div className="upperSideTop"><img src={chatbot} alt="gptlogo" className="chatImg" /><span className="brand">AI INTERACT</span></div>
          <button className="midBtn btn btn-primary" onClick={() => { window.location.reload() }}><img src={addBtn} alt="new Chat" className="addBtn" />New Chat</button>
          <div className='prompt_Section'>
            {conversationList.length > 0 && (
              <div className='Prompt'>
                {conversationList.map((conversation, index) => (
                  <div className='Prompt' key={conversation.conversation_id}>
                    <div
                      onClick={() => handleConversationClick(conversation)}
                      style={{ cursor: 'pointer' }} // Add cursor style for visual feedback
                    >{conversation.conversation_title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="lowerside">
        {promptdetails.length ===0? (
          <div>
          <button type="button" className="btn btn-success listItems" onClick={handleSave}>Save Current Conversation</button>
          <button type="button" className="btn btn-success listItems download" onClick={handleDownload}>Download Conversation</button>
          </div>
        ):
        <button type="button" className="btn btn-success listItems download" onClick={handleDownload}>Download Conversation</button>
        
        
        }
          {/* <button type="button" className="btn btn-success listItems" onClick={handleSave}>Save Conversation</button> */}
        </div>
      </div>
      <div className="main">
        <div className="chats">
          {promptdetails.length > 0 ? (
            promptdetails.map((message, i) => (
              <div>
              <div key={i} className="chat">
                <img className="chatImg" src={userIcon1} alt="userIcon" /><p className="txt">{message.user}</p>
              </div>
              <div key={i} className="chat bot">
                <img className="chatImg" src={chatbot } alt="chatBotIcon" /><p className="txt">{message.chatbot}</p>
              </div>
              </div>
            ))
          ) : (
            messages.map((message, i) =>
              <div key={i} className={message.isBot ? "chat bot" : "chat"} >
                <img className="chatImg" src={message.isBot ? chatbot : userIcon1} alt="userIcon" /><p className="txt">{message.text}</p>
              </div>
              
            )
            
          )}
          <div ref={msgEnd} />
        </div>
        <div className="chatFooter">
        {promptdetails.length ===0?(
          <div className="inp">
            <input
              type="text"
              placeholder='Send a message'
              value={input}
              onKeyDown={handleEnter}
              onChange={(e) => { setInput(e.target.value) }}
            />
            <button className='send' onClick={handlesend}>
              <img src={sendBtn} alt="send" />
            </button>
          </div>
        )
          :
          null
        }
          <p>AI INTERACT may produce incorrect results</p>
        </div>
      </div>
    </div>
  );
}

export default App;
