import axios from "axios";
import { TypeMessage, TypeMessageGet } from "../Entities/Message.entity";

const api = axios.create({
  baseURL: 'https://chatty.doodle-test.com/api/chatty/v1.0/'
});

export const fetchMessages = async (
  setMessages: React.Dispatch<React.SetStateAction<TypeMessage[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  scrollToBottom: () => void
) => {
  try {
    const response = await api.get<TypeMessageGet>(
      `/?token=${process.env.REACT_APP_DOODLE_TOKEN}`
    );
    setMessages(response?.data as unknown as TypeMessage[]);
    setLoading(false);
    setTimeout(() => {
      scrollToBottom();
    }, 200);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

export const postMessage = async (data: TypeMessage) => {
  return await api.post(`/?token=${process.env.REACT_APP_DOODLE_TOKEN}`, data);
};
