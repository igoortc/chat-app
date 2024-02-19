import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ChatComponent from "./Chat";
import { fetchMessages, postMessage } from "../../Config/Api";
import { TypeMessage } from "../../Entities/Message.entity";

jest.mock("../../Config/Api", () => ({
  fetchMessages: jest.fn(),
  postMessage: jest.fn(),
}));

const mockMessages = [
  {
    _id: 1,
    author: "Tom",
    message: "Hello",
    timestamp: Date.now(),
    token: "10",
  },
  {
    _id: 2,
    author: "Rachel",
    message: "Hello!",
    timestamp: Date.now(),
    token: "11",
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Chat", () => {
  it("renders loading state", async () => {
    // @ts-expect-error
    fetchMessages.mockImplementationOnce(
      (
        setMessages: React.Dispatch<React.SetStateAction<TypeMessage[]>>,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
      ) => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setMessages(mockMessages);
        }, 500);
      }
    );

    render(<ChatComponent />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMessages).toHaveBeenCalled();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  it("renders messages", async () => {
    // @ts-expect-error
    fetchMessages.mockImplementationOnce(
      (
        setMessages: React.Dispatch<React.SetStateAction<TypeMessage[]>>,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
      ) => {
        setMessages(mockMessages);
        setLoading(false);
      }
    );

    render(<ChatComponent />);

    await waitFor(() => {
      expect(fetchMessages).toHaveBeenCalled();
    });

    mockMessages.forEach((message) => {
      expect(screen.getByText(message.author)).toBeInTheDocument();
      expect(screen.getByText(message.message)).toBeInTheDocument();
    });
  });

  it("sends message successfully", async () => {
    render(<ChatComponent />);

    await waitFor(() => {
      expect(fetchMessages).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText("Message");
    const sendButton = screen.getByText("Send");

    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.click(sendButton);

    expect(postMessage).toHaveBeenCalledWith({
      _id: expect.any(Number),
      author: "Tom",
      message: "Test message",
      timestamp: expect.any(Number),
      token: process.env.REACT_APP_DOODLE_TOKEN,
    });

    expect(fetchMessages).toHaveBeenCalled();
  });
});
