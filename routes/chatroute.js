const express=require("express");
const auth = require("../middlewares/middleware");
const ChatModel = require("../models/ChatSchema");
const UserModel = require("../models/UserSchema");

const chatroute=express.Router();

chatroute.post("/",auth,async(req,res)=>{
    const {userId}=req.body
    if(!userId){
        return res.json({success:false,msg:"send userid"});
    }
    var isChat= await ChatModel.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user.id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate("users","-password").populate("latestMessage")

    isChat = await UserModel.populate(isChat,{
        path:"latestMessage.sender",
        select:"name email pic"
    })
    if(isChat.length>0){
        return res.json({success:true,data:isChat[0]})
    }else{
        var chatdata={
            chatName:"sender",
            users:[userId,req.user.id]
        }
        try{
            const chat= new ChatModel(chatdata)
            const data=await chat.save()
            const fullChat=await ChatModel.findOne({_id:data._id}).populate("users","-password")
            return res.json({success:true,fullChat})
        }catch(err){
            console.log(err)
            return res.json({success:false,msg:"error while creating chat"})
        }
    }
})
chatroute.get("/fetchchats",auth,async(req,res)=>{
    try{
        const chat=await ChatModel.find({users:{$elemMatch:{$eq:req.user.id}}}).populate("users","-password").populate("groupAdmin","-password").populate("latestMessage").sort({updatedAt:-1})
        return res.json(chat)
    }catch(err){
        console.log(err)
        return res.json({success:false,msg:"error while fetching chats"});
    }
})
chatroute.post("/group",auth,async(req,res)=>{
    var {name,users}=req.body;
    if(!name||!users){
        return res.json({success:false,msg:"either name or users not provided"})
    }
    users=JSON.parse(users)
    if(users.length<2){
        return res.json({msg:"more than two users required",success:false});
    }
    try{
        const data=new ChatModel({chatName:name,groupAdmin:req.user.id,isGroupChat:true,users:users})
        const groupchat=await data.save();
        const chat=await ChatModel.findOne({_id:groupchat._id}).populate("users","-password").populate("groupAdmin","-password")
        return res.json({success:true,chat})
    }catch(err){
        return res.json({success:false,msg:"error while creating a group"})
    }
})
chatroute.put("/rename",auth,async(req,res)=>{
    const {grpId,chatname}=req.body
    const newdata=await ChatModel.findByIdAndUpdate({_id:grpId},{chatName:chatname},{new:true}).populate("groupAdmin","-password").populate("users","-password")
    return res.json({msg:"updated successfully",newdata,success:true})
})
chatroute.put("/addtogroup",auth,async(req,res)=>{
    const {chatId,userId}=req.body
    const data=await ChatModel.findByIdAndUpdate({_id:chatId},{$push:{users:userId}},{new:true}).populate("users","-password").populate("groupAdmin","-password")
    return res.json({success:true,msg:"user added successfully",data})
})
chatroute.put("/removefromgroup",auth,async(req,res)=>{
    const {chatId,userId}=req.body
    const data=await ChatModel.findByIdAndUpdate({_id:chatId},{$pull:{users:userId}},{new:true}).populate("users","-password").populate("groupAdmin","-password")
    return res.json({success:true,msg:"user removed successfully",data})
})
module.exports=chatroute;