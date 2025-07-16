import { TaskType, TaskMode } from "@heygen/streaming-avatar";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useState } from "react";
import { usePrevious } from "ahooks";

import { Button } from "../Button";
import { SendIcon } from "../Icons";
import { useTextChat } from "../logic/useTextChat";
import { Input } from "../Input";
import { useConversationState } from "../logic/useConversationState";

export const TextInput: React.FC = () => {
  const t = useTranslations("TextInput");
  const { repeatMessage } =
    useTextChat();
  const { startListening, stopListening } = useConversationState();
  const [taskType] = useState<TaskType>(TaskType.REPEAT);
  const [taskMode] = useState<TaskMode>(TaskMode.ASYNC);
  const [message, setMessage] = useState("");

  const handleSend = useCallback(() => {
    repeatMessage(message);
    setMessage("");
  }, [
    taskType,
    taskMode,
    message,
    repeatMessage,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSend();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSend]);

  const previousText = usePrevious(message);

  useEffect(() => {
    if (!previousText && message) {
      startListening();
    } else if (previousText && !message) {
      stopListening();
    }
  }, [message, previousText, startListening, stopListening]);

  return (
    <div className="flex flex-row gap-2 items-end w-full">
      <Input
        className="min-w-[500px]"
        placeholder={t("placeholder", {
          taskType: taskType === TaskType.REPEAT ? "REPEAT" : "RESPOND",
        })}
        value={message}
        onChange={setMessage}
      />
      <Button className="!p-2" onClick={handleSend}>
        <SendIcon size={20} />
      </Button>
    </div>
  );
};
