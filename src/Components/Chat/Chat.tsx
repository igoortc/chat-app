import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { messagesAtom } from "../../Atoms/Messages.atom";
import { TypeMessage } from "../../Entities/Message.entity";
import styles from "./Chat.module.css";
import { fetchMessages, postMessage } from "../../Config/Api";

const ChatComponent = () => {
  const [messages, setMessages] = useAtom(messagesAtom);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    const token = process.env.REACT_APP_DOODLE_TOKEN;

    const data: TypeMessage = {
      _id: Number(`${Math.floor(100000 + Math.random() * 900000)}`),
      author: "Tom",
      message: newMessage,
      timestamp: Date.now(),
      token: token as string,
    };

    try {
      await postMessage(data);
      setNewMessage("");
      fetchMessages(setMessages, setLoading, scrollToBottom);
    } catch (error) {
      // TODO: incorporate error messages into UI
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchMessages(setMessages, setLoading, scrollToBottom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.messageBubbleWrapper}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          messages.map((message: TypeMessage) => (
            <div
              key={message._id}
              className={`${styles.messageBubble} ${
                message.author === "Tom" ? styles.loggedInUser : ""
              }`}
            >
              <p className={styles.authorName}>{message.author}</p>
              <p className={styles.message}>
                {/* TODO: test for more codes that might need to be cleaned-up  */}
                {message.message.replaceAll("&#x27;", "'")}
              </p>
              <span className={styles.timestamp}>
                {formattedDate(message.timestamp)}
              </span>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message"
          className={styles.messageInput}
        />
        <button onClick={sendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
