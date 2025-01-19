const mongoose=require("mongoose")

const MessageSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        required:[true,"this field is required"]
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    }
},{timestamps:true,timeseries:true})

const MessageModel=mongoose.model("Message",MessageSchema)
module.exports=MessageModel