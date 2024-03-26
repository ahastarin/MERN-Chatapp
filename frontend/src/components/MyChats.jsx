import { useEffect } from "react"
import { ChatState } from "../context/ChatProvider";
import { Box, useToast, Button, Stack, Text } from "@chakra-ui/react";
import { getSender } from "../config/ChatLogic";
import GroupChatModal from "./miscellaneous/GroupChatModal";

import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";

function MyChats({ fetchAgain }) {
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/api/chat`, config)
            await setChats(data)
        } catch (error) {
            if (user) {
                toast({
                    title: error.message,
                    description: "failed to load search result",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left"
                })
            }
        }
    }

    useEffect(() => {
        fetchChats()
    }, [fetchAgain, user])

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28p", md: "30px" }}
                fontFamily="work sans"
                display="flex"
                flexWrap="wrap"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats

                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}

                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>

            </Box>

            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                width="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats?.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat === chat ? "#4CCD99" : "#G8G8G8"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat
                                        ? getSender(user, chat.users)
                                        : chat.chatName}

                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box >
    )
}

export default MyChats