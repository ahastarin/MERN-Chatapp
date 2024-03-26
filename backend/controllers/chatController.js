import asyncHandler from 'express-async-handler'
import { Chat } from '../models/chatModel.js'
import { User } from '../models/userModel.js'

// retrieve chats detail
export const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("userId param not sent with request");
        return res.status(400)
    }

    // find chat 
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users", "-password").populate("latestMessage")

    // cross database populate
    // docs: https://mongoosejs.com/docs/api/model.html#Model.populate()
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        try {
            const createdChat = await Chat.create(chatData)

            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            )

            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})

// retrieve all chat that loged user have
export const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {

                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                })

                res.status(200).send(results)
            })


    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})

// create group chat
export const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "please fill all the fields" })
    }

    var users = JSON.parse(req.body.users);
    users.push(req.user)

    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 user are required to form a group chat")
    }


    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat.id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).send(fullGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

// rename group chat
export const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updateChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        // new is option to define return value is new value if true and old value if false
        {
            new: true
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!updateChat) {
        res.status(404);
        throw new Error("Chat Not Found")
    } else {
        res.json(updateChat)
    }
})

// add user to group
export const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId }
        },
        {
            new: true
        }
    ).populate("users", "-password").populate("groupAdmin", "-password")

    if (!added) {
        res.status(404)
        throw new Error("Chat Not Found")
    } else {
        res.json(added);
    }
})

// remove user from group
export const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const remove = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId }
        },
        {
            new: true
        }
    ).populate("users", "-password").populate("groupAdmin", "-password")

    if (!remove) {
        res.status(404)
        throw new Error("Chat Not Found")
    } else {
        res.json(remove);
    }
})

