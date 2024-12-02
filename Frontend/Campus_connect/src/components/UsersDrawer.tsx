import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { UserStruct } from "./ChatPage";

interface Props {
  users: UserStruct[];
}

const UsersDrawer = ({ users }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        <Text className="show-active-users">Active Users</Text>
      </Button>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <Text>Active Users</Text>
          </DrawerHeader>
          <DrawerBody>
            {users?.map((user, idx) => (
              <Box key={idx} mb={3}>
                <HStack>
                  <Box className="active-users-dot" mr={3} />
                  <Text fontSize="1.6rem">{user.username}</Text>
                </HStack>
              </Box>
            ))}
          </DrawerBody>
          <DrawerFooter>
            <Button onClick={onClose} colorScheme="red" variant="outline">
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UsersDrawer;
