import express from 'express';
import { chats } from './data/data.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { Server } from 'socket.io';
import path from 'path'

const app = express();
dotenv.config()

connectDB();

// SETUP ENV
dotenv.config();
const __dirname1 = path.resolve()

// setting cors
var corsOptions = {
    origin: "*"
}

console.log(corsOptions)

// MIDLEWARE
app.use(cors(corsOptions))

// tell the server to accept json data 
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// -------------------------------DEPLOYMENT-----------------------------



if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, '/frontend/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
    })
} else {
    app.get('/', (req, res) => {
        res.send("API running succesfully")
    })
}

// -------------------------------DEPLOYMENT-----------------------------


app.get('/', (req, res) => {
    res.send("Api Is Running")
})

app.get('/api/chats', (req, res) => {
    res.send(chats);
})

app.get('/api/chats/:id', (req, res) => {
    const { id } = req.params;

    const singleChat = chats.find((chat) => chat._id === id)
    // console.log(singleChat)

    res.send(singleChat)
})

// error handling 

app.use(notFound)
app.use(errorHandler)

const server = app.listen(process.env.PORT, console.log("Server Started on PORT 5000"));

const io = new Server(server, {
    cors: corsOptions
})



io.on("connection", (socket) => {
    console.log("Connected to Socket.io")

    socket.on('setup', (userData) => {
        socket.join(userData?._id)
        console.log(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("user joined room" + room)
    })

    socket.on("typing", (room) => {
        socket.in(room).emit("typing")
        // console.log(room)
    });
    socket.on("stop typing", (room) => {
        // console.log(room)
        socket.in(room).emit("stop typing")

    });

    socket.on("new message", (newMessageRecieved, room) => {
        // console.log(newMessageRecieved)
        let chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
        // socket.in(room).emit("message recieved", newMessageRecieved);
        // socket.in()

    });

    socket.off("setup", () => {
        console.log('user disconnected')
        socket.leave(userData._id)
    })
})