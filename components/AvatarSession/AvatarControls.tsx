import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import React from "react";

import { Button } from "../Button";
import { useInterrupt } from "../logic/useInterrupt";

import { TextInput } from "./TextInput";

export const AvatarControls: React.FC = () => {

  const { interrupt } = useInterrupt();

  return (
    <div className="flex flex-col gap-3 relative w-full items-center">
      <TextInput />
      <div className="absolute top-[-70px] right-3">
        <Button className="!bg-zinc-700 !text-white" onClick={interrupt}>
          Interrupt
        </Button>
      </div>
    </div>
  );
};
