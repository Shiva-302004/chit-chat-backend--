const express=require('express')
const auth=require('../middlewares/middleware')
const messageroute=express.Router()
const MessageModel=require("../models/MessageSchema")
const UserModel=require('../models/UserSchema')
const ChatModel=require('../models/ChatSchema')
messageroute.post("/",auth,async(req,res)=>{
    const {content,chatId}=req.body;
    const id=req.user.id;
    if(!content || !chatId){
        return res.status(400).json({"msg":"please send the chatId or content"});
    }
    var newMessage={
        sender:id,
        content:content,
        chat:chatId
    }
    try{
        const data=new MessageModel(newMessage);
        var message=await data.save();
        message=await message.populate("sender","name pic");
        message=await message.populate("chat");
        message=await UserModel.populate(message,{
            path:"chat.users",
            select:"name pic email"
        })
        var chatupdate=await ChatModel.findByIdAndUpdate(chatId,{latestMessage:message._id},{new:true})
        chatupdate=await chatupdate.populate("latestMessage")
        chatupdate=await UserModel.populate(chatupdate,{
            path:"users",
        })
        console.log(chatupdate)
        return res.json({msg:"message sent successfully",message})
    }catch(err){
        return res.status(400).json({msg:"cannot send message now try again later"});
    }
})
messageroute.get("/all/:id",auth,async(req,res)=>{
    const id=req.params.id
    if(!id){
        return res.json({msg:"please sign in"});
    }
    try{
        var allmessage=await MessageModel.find({chat:id}).populate("sender","name email pic").populate("chat")
        allmessage=await UserModel.populate(allmessage,{
            path:"chat.users",
            select:"name email pic"
        })
        res.status(200).json({msg:"fetched succesfully",data:allmessage});
    }catch(err){
        return res.status(400).json({msg:"something went wrong while fetching messages try again!"})
    }
})
module.exports=messageroute