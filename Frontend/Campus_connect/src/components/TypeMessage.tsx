import { Box, Input } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  sendMessage: (message: string) => void;
}

const TypeMessage = ({ sendMessage }: Props) => {
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(message);
        setMessage("");
      }}
    >
      <Input
        height="60px"
        placeholder="Type Message"
        variant="filled"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </form>
  );
};

export default TypeMessage;
