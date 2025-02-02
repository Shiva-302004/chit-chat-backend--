const express=require("express")

const app=express()

const http=require("http")

const socketio=require("socket.io")

const server=http.createServer(app)

const io = socketio(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://chitchat-chat.vercel.app", // update this to your production site's URL
        methods: ["GET", "POST","PUT"] // specify allowed HTTP methods if needed
    }
});

const db=require("../database/dbconn")
const cors=require("cors")
const dotenv=require("dotenv")
const clc=require("cli-color")
const path=require("path")
const chat=require("../chats/chats")
const route1=require("../routes/userroute")
const chatroute = require("../routes/chatroute")
const messageroute=require("../routes/messageroute")
const otproute=require("../routes/otp")
dotenv.config();
const PORT=process.env.PORT

app.use(cors())
app.use(express.json())
app.use("/user",route1)
app.use("/chats",chatroute);
app.use("/message",messageroute)
app.use("/otp",otproute)
app.get("/api/chats",(req,res)=>{
    res.send(chat)
})
// var arr=["66d40ff2639a0c662dcaccde","66ca4835f13f0f474fcd7008","66ca3efd0804e8e309458823"]
// console.log(JSON.stringify(arr))
io.on("connection",(stream)=>{
    console.log(clc.bgCyanBright("socket connection successfull 😍😍"))
    stream.on("setup",(userdata)=>{
        stream.join(userdata._id)
        console.log("connected"+userdata._id)
        stream.emit("connected")
    })

    stream.on("join chat",(roomid)=>{
        stream.join(roomid)
        console.log("joined chat"+roomid)
    })

    stream.on("send message",(data)=>{
        console.log(data)
        var chat=data.chat
        if(!chat.users){
            console.log(chat)
        }else{
            console.log(JSON.stringify(chat.users))
            chat.users.forEach((user)=>{
                if(user._id!==data.sender._id){
                    stream.in(user._id).emit("receive message",data)
                }
            })
        }
    })
    stream.on("typing",(data)=>{
        stream.in(data).emit("typing")
    })
    stream.on("stop typing",(data)=>{
        stream.in(data).emit("stop typing")
    })
})

db().then(
    server.listen(PORT,()=>{
        console.log(clc.bgGreen.whiteBright(" server connection  successfull 😍😍"))
    })
).catch((err)=>{
    console.log(clc.bgRed.whiteBright("error while starting server 😒😒"))
})

