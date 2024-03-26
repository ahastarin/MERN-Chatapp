import { Box } from "@chakra-ui/react"
import { CloseIcon } from "@chakra-ui/icons"
import { ChatState } from "../../context/ChatProvider"

function UserBadgeItem({ userItem, handleFunction }) {

    const { user } = ChatState();

    return (
        <Box
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            backgroundColor="purple"
            color="white"

        >
            {userItem.name}
            {userItem._id != user._id &&
                <CloseIcon
                    pl={1}
                    onClick={handleFunction}
                    cursor="pointer" />}

        </Box>
    )
}

export default UserBadgeItem