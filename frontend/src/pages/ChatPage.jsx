import { Box } from '@chakra-ui/react'
import { ChatState } from '../context/ChatProvider.jsx'
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { useEffect, useState } from 'react';


function ChatPage() {
    const { setUser, user } = ChatState();

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    useEffect(() => {
        setUser(userInfo)
    }, [])

    const [fetchAgain, setFetchAgain] = useState()

    return (
        <>
            <div style={{ width: "100%" }}>
                {user && <SideDrawer />}
                <Box
                    display="flex"
                    justifyContent='space-between'
                    w="100%"
                    h="91.5vh"
                    p="10"
                >
                    {user && <MyChats fetchAgain={fetchAgain} />}
                    {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                </Box>
            </div>
        </>
    )
}

export default ChatPage