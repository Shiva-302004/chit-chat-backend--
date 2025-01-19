const mongoose=require("mongoose")
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"this field is required"]
    },
    email:{
        type:String,
        required:[true,"this field is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"this field is required"]
    },
    pic:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2017/06/13/12/54/profile-2398783_1280.png",
        required:[true,"this field is required"]
    }
},{timeseries:true,timestamps:true})

const UserModel=mongoose.model("User",UserSchema)
module.exports=UserModel