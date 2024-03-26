
import { Button, Box } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { useDisclosure, useToast } from '@chakra-ui/react'
import { FormControl, Input } from "@chakra-ui/react"
import { useState } from "react"
import axios from "axios"
import { ChatState } from "../../context/ChatProvider"
import UserListItem from "../UserAvatar/UserListItem"
import UserBadgeItem from "../UserAvatar/UserBadgeItem"


function GroupChatModal({ children }) {

    const { user, chats, setChats } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState()
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState()

    const toast = useToast();


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


    const handleGroup = (userToAdd) => {

        if (selectedUsers?.includes(userToAdd)) {
            toast({
                title: "User Already Added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd])
    }

    const handleClose = () => {
        setSelectedUsers([])
        setSearchResult([])
    }

    const handleDelete = (delUser) => {
        if (delUser._id !== user._id) {
            setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
        }
    };

    const handleSubmit = async () => {
        if (!selectedUsers || !groupChatName) {
            toast({
                title: "Please fill al fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })

            return
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post("http://localhost:5000/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config)

            setChats([data, ...chats])

            onClose()
            handleClose()

            toast({
                title: "New Group has been created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top"
            })

        } catch (error) {
            toast({
                title: error.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }
    }

    return (
        <>

            <span onClick={onOpen}>{children}</span>


            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton onClick={() => handleClose()} />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                    >

                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add user eg: ahas, john, jane"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers?.map((user) => (
                                <UserBadgeItem key={user._id} userItem={user} handleFunction={() => handleDelete(user)} />
                            ))}
                        </Box >
                        {/* selected user */}
                        {loading
                            ?
                            <div>Loading</div>
                            :
                            searchResult?.slice(0, 4).map((u) => {
                                if (u._id !== user._id) {

                                    return <UserListItem
                                        key={u._id}
                                        user={u}
                                        handleFunction={() => handleGroup(u)} />
                                }
                            })}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal