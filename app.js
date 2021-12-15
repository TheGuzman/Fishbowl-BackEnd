import express from 'express'
import cors from 'cors';

import { createServer } from 'http';
import { Server } from "socket.io";

import authRouter from './src/auth/auth.router.js';
import userRouter from './src/user/user.router.js'


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

let users=[];

io.on("connection", socket => {
    socket.on("join-room", (roomID) => {
        const user = {
            id: socket.id
        }
        users.push(user)
        socket.emit('new user', users)

        socket.join(roomID);

        console.log('room ' + roomID)
        console.log('joined by ' + user.id)
        console.log('all users are')
        console.log(users)

        socket.emit("userId", user.id);

    });
    socket.on("send message", (body, roomID) => {
        console.log('Mensaje desde cliente', body);
        io.to(roomID).emit("message", body)
    })
    socket.on('disconnect', (roomID) => {
        socket.to(roomID).emit('user-disconnected', socket.id)
        console.log('left user:' + socket.id)
        socket.disconnect(socket.id)
        const i = users.findIndex(u=>u===socket.id)
        users.splice(i,1)
    })
    

});






server.listen(3001, console.log('Server is up at port 3001'))
