const otpModel =require("../models/otpSchemma")

const express=require("express")
const router=express.Router()
const auth=require("../middlewares/middleware")
const main2=require("../nodemailer/nodemailer2")
const bcryptjs=require("bcryptjs")
const dotenv=require("dotenv")
const UserModel = require("../models/UserSchema")
dotenv.config()
const secret=process.env.secret
router.post("/",auth,async(req,res)=>{
    const {email}=req.body
    const id=req.user.id
    const data=await UserModel.findOne({email})
    if(!data){
        return res.json({success:false,msg:"user not registered"})
    }
    else if(email){
        main2(email)
        return res.json({success:true,msg:"otp sent to registered mail id"})
    }else{
        return res.json({sucess:false,msg:"something went wrong try again"})
    }
})
router.post("/verify",auth,async(req,res)=>{
    const {otp,email}=req.body
    const data=await otpModel.findOne({email})
    const id=req.user.id
    console.log(data)
    
    if(data){
        const isCompare=bcryptjs.compare(data.otp,otp)
        console.log(isCompare)
        if(isCompare){
            const data=await UserModel.updateOne({email},{verified:true})
            const User=await UserModel.findOne({email},"-password")
            return res.json({success:true,msg:"verification successfull",User:User})
        }else{
            return res.json({success:false,msg:"otp mismatch"})
        }
    }else{
        return res.json({success:false,msg:"please click on send otp button"})
    }
})

module.exports=router