const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const otpModel = require("../models/otpSchemma");
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
const USER_EMAIL = process.env.USER_EMAIL;
const bcryptjs = require("bcryptjs");
const UserModel = require("../models/UserSchema");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: USER_EMAIL,
        pass: GMAIL_PASSWORD,
    },
});

const main2=async(email)=> {
    try {
        const user=await UserModel.findOne({email})
        if(user){
            const data=await otpModel.deleteOne({email})
            console.log(data)
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const newotp=await bcryptjs.hash(otp.toString(),10)
        const otpdata=new otpModel({otp:newotp,email:email})
        await otpdata.save()
        const info = await transporter.sendMail({
            from: {
                name: "Shiva Verma",
                address: USER_EMAIL,
            },
            to: email,
            subject: "Welcome to the Chit Chat Application",
            html: `
                <h2>Welcome to Chit-Chat! 🎉</h2>
                <p>We're thrilled to have you join our community. Whether you want to catch up with friends, plan your next adventure, or simply enjoy a seamless texting experience, our chat app is designed with you in mind.</p>
                <ul style="list-style: circle;">
                    <li>Instant Messaging: Send and receive messages in real-time, ensuring you stay connected with those who matter most.</li>
                    <li>User-Friendly Interface: Navigate with ease thanks to our clean and intuitive design.</li>
                    <li>Secure Conversations: Your privacy is our priority. Enjoy end-to-end encryption for all your chats.</li>
                    <li>Your otp <h1>${otp}</h1></li>
                </ul>
                <p>Dive in and start exploring. We're here to make your communication smooth, fun, and secure. If you have any questions or need assistance, our support team is just a message away!</p>
                <h2>Happy Chatting!</h2>
            `,
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email: %s", error);
    }
}

module.exports=main2;
