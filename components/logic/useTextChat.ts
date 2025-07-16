import { TaskMode, TaskType } from "@heygen/streaming-avatar";
import { useCallback, useState } from "react";
import { Message, MessageSender } from "./types";
import { useStreamingAvatarContext } from "./context";

export const useTextChat = () => {
  const { avatarRef } = useStreamingAvatarContext();
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const addMessageToHistory = useCallback(
    (content: string, sender: MessageSender) => {
      const newMessage: Message = {
        id: Date.now().toString(), // Simple unique ID
        sender,
        content,
      };
      addMessage(newMessage);
    },
    [addMessage],
  );


  const repeatMessage = useCallback(
    async (prompt: string) => {
      addMessageToHistory(prompt, MessageSender.CLIENT);

      console.log("Messages:------------------------")
      console.log(messages)

      const currentRoute = 'ai.avatar.onboarding';
      const lastAiMessage = messages.filter(m => m.sender === MessageSender.AVATAR).pop();
      const previousChatId = lastAiMessage?.id;

      const response = await fetch('/api/get-response-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          currentRoute,
          previousChatId
        }),
      });

      if (!response.ok) {
        console.error("Failed to get AI response");
        // Optionally, add an error message to the chat
        addMessageToHistory("Sorry, I couldn't get a response.", MessageSender.AVATAR);
        return;
      }

      const aiResponse = await response.json();
      
      // Add AI response to history, using the new ID from the backend
      const newMessage: Message = {
        id: aiResponse.responseId,
        sender: MessageSender.AVATAR,
        content: aiResponse.message,
      };
      addMessage(newMessage);

      if (!avatarRef.current) return;

      return avatarRef.current?.speak({
        text: aiResponse.message,
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.ASYNC,
      });
    },
    [avatarRef, addMessageToHistory, messages, addMessage],
  );

  return {
    messages,
    addMessage,
    repeatMessage,
    addMessageToHistory,
  };
};
