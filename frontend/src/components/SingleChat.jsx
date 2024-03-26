import { Box, Text, IconButton, Spinner, FormControl, Input, useToast } from "@chakra-ui/react"
import { ChatState } from "../context/ChatProvider"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { getSenderFull, getSender } from "../config/ChatLogic"
import ProfileModal from "./miscellaneous/ProfileModal"
import UpdateGroupModal from "./miscellaneous/UpdateGroupModal"
import ScrollableChat from "./ScrollableChat"
import { useEffect, useState } from "react"
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json"
import { io } from "socket.io-client"
import axios from "axios"
import "./style.css"

const ENDPOINT = 'http://localhost:5000';
var socket;
var selectedChatCompare = "";

function SingleChat({ fetchAgain, setFetchAgain }) {

    const { user, selectedChat, setSelectedChat, setNotification, notification } = ChatState()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessages, setNewMessages] = useState('')
    const [socketConnected, setSocketConnected] = useState()
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };


    const fetchMessages = async () => {
        if (!selectedChat) {
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            setLoading(true)

            const { data } = await axios.get(
                `https://chatapp-api-taupe.vercel.app/api/message/${selectedChat?._id}`,
                config
            )

            setMessages(data);

            setLoading(false)

            socket.emit("join chat", selectedChat?._id)
        } catch (error) {
            toast({
                title: "error occurred",
                description: "failed to load messages",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }


    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessages) {
            socket.emit('stop typing', selectedChat?._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }

                setNewMessages("");

                const { data } = await axios.post(
                    "https://chatapp-api-taupe.vercel.app/api/message",
                    {
                        content: newMessages,
                        chatId: selectedChat?._id
                    },
                    config
                )

                socket.emit("new message", data, selectedChat?._id)
                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: "error occurred",
                    description: "failed to send messages",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left"
                })
            }
        }
    }


    // console.log(notification, "----")
    useEffect(() => {
        // console.log(user)
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])


    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });


    const typingHandler = (e) => {
        // this trigger rerender
        setNewMessages(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat?._id);
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;

        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                setTyping(false);
                socket.emit("stop typing", selectedChat?._id);
            }
        }, timerLength);
    }

    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="work sans"
                            display="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")}
                            />

                            {!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupModal
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    />
                                </>
                            )}
                        </Text>

                        <Box
                            display="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >
                            {/* Messages Here */}
                            {loading ? (
                                <Spinner
                                    size="lg"
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                />
                            ) : (
                                <>
                                    <div className="messages">
                                        {/* <h1>h</h1> */}
                                        <ScrollableChat messages={messages} />
                                    </div>
                                </>
                            )}
                            <FormControl
                                onKeyDown={sendMessage}
                                id='first-name'
                                mt={3}
                                isRequired
                            >
                                {isTyping ?
                                    <Lottie
                                        options={defaultOptions}
                                        height={50}
                                        width={50}
                                        style={{ marginBottom: 15, marginLeft: 0 }} />
                                    :
                                    <></>}
                                <Input
                                    variant="filled"
                                    bg="#E0E0E0"
                                    placeholder="Enter a Message"
                                    value={newMessages}
                                    onChange={typingHandler}
                                />
                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        h='100%'
                    >
                        <Text
                            fontSize='3xl'
                            pb={3}
                            fontFamily='work sans'
                        >
                            Click on user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}

export default SingleChat