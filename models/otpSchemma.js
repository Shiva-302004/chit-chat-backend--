const mongoose=require("mongoose")
const otp=new mongoose.Schema({
    otp:{
        type:"string",
        required:true,
    },
    email:{
        type:"string",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:100000
    }
})
const otpModel=mongoose.model("Otp",otp)
module.exports=otpModel