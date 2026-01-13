import { createServer } from "http"
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
// here we are checking NODE_ENV is not equeal to production , if Node en is not prodution then 
// this dev will be true else false , and if  true then nextjs will run in the dev mode and 
// and not in the production mode , 

const app = next({ dev }) // this is creating the nextjs instace in the dev mode like how we do in the expresss
// const app = expres() , creating the instance of express , the same we are doing here creating the instace of 
// nextjs 

const handle = app.getRequestHandler();
// app.getRequestHandler is for handling the rest api , means that http reauest pass to the nextjs 
// that he will handle it , 

// here we are wating till our app is ready , then only create server or anything 
app.prepare().then(() => {

const nodeHttpServer = createServer((req , res) => handle(req, res)); // passing the http request to nextjs 
// to handle it and send respose 

const io = new Server(nodeHttpServer); // creating the socket.io server on top of raw nodejs http server which we have made with http module of 
// nodejs and it is telling whenever there is request for upgae then give it to me so we are handling 
// socket requestion by io 

// this happen automaticy the 
io.on("connection", (socket) => {

console.log("user connexted with websocket or socket.io ",socket.id);

socket.on("firstSongAdded", (roomCode) => {
    io.to(roomCode).emit("playbackUpdated")
})

socket.on("join-room", (roomId) => {
socket.join(roomId);
console.log(`sokcet Id : ${socket.id} joined room ${roomId}`);
const room = io.sockets.adapter.rooms;
const count = room ? room.size : 0;

io.to(roomId).emit("room-user-count", count)
});

socket.on("queue-changed", (roomCode) => {
    console.log("event revied for : ", roomCode);
    
    io.to(roomCode).emit("queue-updated")
})

socket.on("disconnect", () => {
})
})

// at last listing on port 3000
nodeHttpServer.listen(3000, () => {
    console.log("listing in port 3000");
});

})

