import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import useMessageStore from "../store/LatestMessagesStore";
import { Socket } from "socket.io-client";

const schema = z.object({
  name: z.string().min(3, { message: "name is required" }),
  usn: z.string().min(10, { message: "usn length should be 10" }),
  password: z
    .string()
    .min(8, { message: "password is required and min length is 8" }),
});

interface Props {
  socket: Socket;
}

type formData = z.infer<typeof schema>;

const SignUp = ({ socket }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formData>({ resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const { logIn, insert } = useMessageStore();

  const signUpUser = (data: formData) => {
    axios
      .post("http://localhost:3000/signup", data)
      .then(() => {
        socket.username = data.name; // Added this custom username property by modifying types file in src folder
        socket.connect();

        socket.emit("newUser", { username: data.name });

        socket.on("prevMessages", (d) => {
          insert(d);
        });
        logIn(true);
        navigate("/chatpage");
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <Box>
      <VStack justifyContent="center" height="100vh">
        <Text>CampusConnect</Text>
        <form
          onSubmit={handleSubmit((data) => {
            signUpUser(data);
            reset();
          })}
        >
          <FormControl mb={3}>
            <FormLabel>Name:</FormLabel>
            <Input type="text" {...register("name")} />
            {errors.name && <Text color="red">{errors.name.message}</Text>}
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>USN:</FormLabel>
            <Input type="text" {...register("usn")} />
            {errors.usn && <Text color="red">{errors.usn.message}</Text>}
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Password:</FormLabel>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <Text color="red">{errors.password.message}</Text>
            )}
          </FormControl>
          <Button type="submit" mt={2}>
            Create Account
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default SignUp;
