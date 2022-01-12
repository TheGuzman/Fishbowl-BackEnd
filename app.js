import express from 'express'
import cors from 'cors';

import { createServer } from 'http';
import { Server } from "socket.io";

import authRouter from './src/auth/auth.router.js';
import userRouter from './src/user/user.router.js'

import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3001

const app = express()
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(cors());
app.use(express.json())



app.use('/auth', authRouter)
app.use('/user', userRouter)


// app.get('/becomeafish/joinfishbowl/:roomId', (req, res) => {
//     res.render('room', { roomId: req.params.roomId })

// })

// let users=[];

const rooms = []
const fishbowlers = [] //active streamers

io.on("connection", socket => {
    socket.on("join-room", (roomID, username) => {
        socket.join(roomID);
        socket.emit("userId", socket.id);
        const user = {
            id: socket.id,
            name: username,
        }
        const currentRoom = rooms.find(r => r.id === roomID)
        if (currentRoom !== undefined) {
            currentRoom.users.push(user)
        }
        else {
            rooms.push({
                id: `${roomID}`,
                users: [{ ...user }]
            })
        }
        io.to(roomID).emit('new-chat-user', rooms.filter(r => r.id === roomID))

        //STREAMING
        socket.on('join-streaming-room', id => {

            fishbowlers.push(id)

            if (fishbowlers.length <= 3) {

                socket.to(roomID).emit('user-streaming', fishbowlers)

                // socket.to(roomID).emit('user-streaming', id)



            } //if room is not full
            else {
                socket.to(roomID).emit('user-listener', id) //if room is full
            }

            //send the fishbowlers array to client
            socket.to(roomID).emit('fishbowlers', fishbowlers)
        })


    });

    socket.on("send message", (body, roomID) => {
        console.log('Mensaje desde cliente', body);
        io.to(roomID).emit("message", body)
    })

    socket.on('user-disconnect', info => {

        const userID = info.userID
        const roomID = info.roomId

        const i = rooms.find(r => r.id === roomID).users.findIndex(u => u.id === userID);
        rooms.find(r => r.id === roomID).users.splice(i, 1);

        if (rooms.find(r => r.id === roomID).users.length === 0) {
            const i = rooms.findIndex(r => r.id === roomID);
            rooms.splice(i, 1)
        }

        socket.to(roomID).emit('chat-user-left', rooms.filter(r => r.id === roomID))
        socket.to(roomID).emit('close', userID)
        socket.disconnect()


    })


});






server.listen(port, console.log(`Server is up at port ${port}`))
