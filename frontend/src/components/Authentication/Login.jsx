import { VStack } from "@chakra-ui/react"
import { FormControl, FormLabel } from "@chakra-ui/react"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false)
    const toast = useToast();
    const navigate = useNavigate();

    const handleShow = () => setShow(!show);

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: 'Please Fill all fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }


            const { data } = await axios.post(
                "https://chatapp-api-taupe.vercel.app/api/user/login",
                { email, password },
                config
            )

            // console.log(data)

            toast({
                title: 'Login Success.',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })

            localStorage.setItem("userInfo", JSON.stringify(data))
            setLoading(false)
            navigate("/chats")
        } catch (error) {
            toast({
                title: 'Error Ocurred',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })

            setLoading(false)
        }

    }

    return (
        <VStack spacing="5px" color="black">
            <FormControl id="email" isRequired>
                <FormLabel>
                    Email
                </FormLabel>
                <Input
                    value={email}
                    placeholder="Enter Your Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>


            <FormControl id="password" isRequired>
                <FormLabel>
                    Password
                </FormLabel>
                <InputGroup>
                    <Input
                        value={password}
                        type={show ? "text" : "password"}
                        placeholder="Enter Your Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <InputRightElement width="4.5rem">
                        <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme="green"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}>
                Login
            </Button>

            <Button
                variant="solid"
                colorScheme="red"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={() => {
                    setEmail("guest@example.com")
                    setPassword("123456")
                }}>
                Get Guest User Credential
            </Button>
        </VStack>
    )
}

export default Login