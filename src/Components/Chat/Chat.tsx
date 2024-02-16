import { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { messagesAtom } from "../../Atoms/Messages.atom";

import { TypeMessage, TypeMessagePost } from "../../Entities/Message.entity";

const ChatComponent = () => {
  const [messages, setMessages] = useAtom(messagesAtom);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = async () => {
    try {
      const response = await axios.get<TypeMessagePost>(
        `https://chatty.doodle-test.com/api/chatty/v1.0/?token=${process.env.REACT_APP_DOODLE_TOKEN}`
      );
      setMessages(response?.data as unknown as TypeMessage[]);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    const token = process.env.REACT_APP_DOODLE_TOKEN;
    const headers = {
      "Content-Type": "application/json",
      token: token,
    };

    const data: TypeMessage = {
      _id: 0,
      author: "Tom",
      message: newMessage,
      timestamp: Date.now(),
      token: token as string,
    };

    try {
      await axios.post("https://chatty.doodle-test.com/api/chatty/v1.0", data, {
        headers,
      });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formattedDate = (timestamp: number) => {
    const date = new Date(timestamp);

    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()} ${String(date.getHours()).padStart(
      2,
      "0"
    )}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div>
      <div>
        {messages.map((message: TypeMessage) => (
          <div key={message._id}>
            <p>
              {message.author}: {message.message.replaceAll("&#x27;", "'")}
            </p>
            <span>{formattedDate(message.timestamp)}</span>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
