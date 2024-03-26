import { Box, Tooltip, Button, Text, Input, useToast } from "@chakra-ui/react"
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider
} from '@chakra-ui/react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { ChevronDownIcon, BellIcon } from "@chakra-ui/icons"
import { useState } from "react"
import { ChatState } from "../../context/ChatProvider"
import ProfileModal from "./ProfileModal"
import { useNavigate } from "react-router-dom"
import { useDisclosure } from "@chakra-ui/react"
import ChatLoading from "../ChatLoading"
import UserListItem from "../UserAvatar/UserListItem"
import axios from "axios"
import { Spinner } from "@chakra-ui/react"
import { getSender } from "../../config/ChatLogic"
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';


function SideDrawer() {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState()
    const [loading, setLoading] = useState()
    const [loadingChat, setLoadingChat] = useState()
    const navigate = useNavigate();
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { user, setSelectedChat, chats, setChats, setNotification, notification } = ChatState();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/")
        // to forcer re render
        navigate(0)
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please insert something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config)

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Ocurred",
                description: "failed to load search result",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`
                }
            }

            const { data } = await axios.post("/api/chat", { userId }, config)


            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
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

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip
                    label="Search Users to chat"
                    hasArrow
                    placement="bottom-end"
                >
                    <Button variant="ghost" px={4} onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>

                        <Text
                            display={{ base: "none", md: "flex" }}
                            marginLeft="10px"
                        >
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontFamily="work sans">Talk-A-Tive</Text>
                <div>
                    <Menu>
                        <MenuButton as={Button}>
                            <NotificationBadge count={notification.length}></NotificationBadge>
                            <BellIcon></BellIcon>
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat)
                                        setNotification(notification.filter((n) => n !== notif))
                                    }}>
                                    {notif.chat.isGroupChat
                                        ? `New Messags in ${notif.chat.chatName}`
                                        : `New Messages from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user?.name} src={user?.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider></MenuDivider>
                            <MenuItem onClick={() => logoutHandler()}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
                    <DrawerBody>
                        <Box
                            display="flex"
                            pb={2}
                        >
                            <Input
                                placeholder="Search User by Name or Email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <Button
                                onClick={handleSearch}
                            >
                                Go
                            </Button>
                        </Box>

                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}

                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>


        </>


    )
}

export default SideDrawer