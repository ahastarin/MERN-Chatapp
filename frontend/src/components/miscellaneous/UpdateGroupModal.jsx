import { useState } from "react"
import { ViewIcon } from "@chakra-ui/icons"
import { useDisclosure } from "@chakra-ui/react"
import { IconButton, Button, Box, FormControl, Input } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Spinner
} from '@chakra-ui/react'
import { useToast } from "@chakra-ui/react"
import { ChatState } from "../../context/ChatProvider"
import UserBadgeItem from "../UserAvatar/UserBadgeItem"
import UserListItem from "../UserAvatar/UserListItem"

import axios from "axios"

const UpdateGroupModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState()
    const [searchResult, setSearchResult] = useState()
    const [loading, setLoading] = useState()
    const [renameLoading, setRenameLoading] = useState()

    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleRemove = async (user1) => {

        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/groupRemove`,
                {
                    chatId: selectedChat?._id,
                    userId: user1?._id,
                },
                config
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            fetchMessages();
            setFetchAgain(!fetchAgain)
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };


    const handleAddUser = async (user1) => {
        // cek apakah user sudah ada di dalam group atau tidak
        if (selectedChat.users.find((u) => { u._id === user1._id })) {
            toast({
                title: 'user already in the group',
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })

            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'you are not an admin',
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })

            return;
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put('/api/chat/groupAdd', {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: 'error Ocurred',
                description: error.response.data.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
        }
    }

    const handleRename = async () => {

        if (!groupChatName) return

        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put('/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: error.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setGroupChatName("")
        }

    };

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            setSearchResult([])
            return
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios(`/api/user?search=${search}`, config);
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: error.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
        }
    }

    return (
        <>
            <IconButton
                display={{ base: "flex" }}
                onClick={onOpen}
                icon={<ViewIcon />}
            >
                Open Modal
            </IconButton>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            display="flex"
                        >
                            {selectedChat.users.map((user) => (
                                <UserBadgeItem
                                    key={user._id}
                                    userItem={user}
                                    handleFunction={() => handleRemove(user)}
                                />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={selectedChat.chatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />

                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.slice(0, 4).map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupModal