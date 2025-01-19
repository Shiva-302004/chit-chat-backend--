const mongoose=require("mongoose")
const ChatSchema=new mongoose.Schema({
    chatName:{
        type:String,
        trim:true,
        required:[true,"this field is required"]
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timeseries:true,timestamps:true})

const ChatModel=mongoose.model("Chat",ChatSchema)
module.exports=ChatModel