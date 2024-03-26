import { ViewIcon } from "@chakra-ui/icons"
import { Button, IconButton } from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { Image, Text } from "@chakra-ui/react"

function ProfileModal({ user, children }) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            )}

            <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="work sans"
                        display="flex"
                        justifyContent="center"
                    >{user?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={user?.pic}
                            alt={user?.name}
                        />

                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            fontFamily="work sans"
                        >{user?.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal