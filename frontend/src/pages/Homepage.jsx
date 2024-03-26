import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import Login from "../components/Authentication/Login"
import Signup from "../components/Authentication/Signup"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
function Homepage() {
    const navigate = useNavigate();
    const user1 = ChatState();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        console.log(user1)

        if (user) {
            navigate("/chats")
        }
    }, [])

    return (
        <Container maxW="xl" centerContent>
            <Box
                display="flex"
                justifyContent='center'
                p={3}
                bg={'white'}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
                textAlign="center"
            >
                <Text fontSize="4xl" fontFamily="work sans" color="black">Talk-A-Tive</Text>
            </Box>

            <Box
                bg="white"
                w="100%"
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                mb={4}
            >
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList
                        mb="1em"
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Tab width="48%">Login</Tab>
                        <Tab width="48%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login></Login>
                        </TabPanel>
                        <TabPanel>
                            <Signup></Signup>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container >
    )
}

export default Homepage