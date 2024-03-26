import mongoose from 'mongoose';

const chatModel = new mongoose.Schema({
    chatName: {
        type: String,
        required: true
    },
    isGroupChat: {
        type: Boolean,
        dafault: false,
    },
    users: [
        {
            // tipenya object id yang mereferensi ke collection user
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true })

export const Chat = mongoose.model('Chat', chatModel);