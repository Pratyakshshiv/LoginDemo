const { response } = require("express");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router()
const User = require("../Modals/UserData");
const Otp = require("../Modals/Otp");
const nodemailer = require('nodemailer')

router.post("/email-send", async (req, res) => {
    let data = await User.findOne({ email: req.body.email })
    const responseType = {}
    if (data) {
        let otpcode = Math.floor((Math.random() * 10000) + 1);
        let otpdata = new Otp({
            email: req.body.email,
            code: otpcode,
            expireIn: new Date().getTime() + 300 * 1000
        })
        let otpResponse = await otpdata.save()
        responseType.statusText = 'success'
        responseType.message = "Please check you email Id"
        sendmail();
    } else {
        responseType.statusText = 'error'
        responseType.message = "Email Id does not exist"
    }
    res.status(200).json(responseType)
    // res.status(200).json('ohk')
})

router.post('/forgot-pass', async (req, res) => {
    try {
        const email = req.body.email
        const userData = await User.findOne({ email: email })
        if (userData) {
            const randomString = Math.floor((Math.random() * 10000) + 1);
            const data = await User.updateOne({ email: email }, { $set: { token: randomString } })
            sendEmail(userData.name, userData.email, randomString)
            res.status(200).send({ success: true, msg: "Check your mail" })
        } else {
            res.status(200).send({ success: true, msg: "Email does not exist" })
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })
    }
})


// router.post("/change-password", async (req, res) => {
//     const data = await Otp.find({ email: req.body.email, code: req.body.otpcode })
//     const response = {}
//     if (data) {
//         let currentTime = new Date().getTime();
//         let differnceTime = data.expireIn - currentTime
//         if (differnceTime < 0) {
//             response.message = 'Token expire'
//             response.statusText = 'error'
//         } else {
//             let user = await User.findOne({ email: req.body.email })
//             user.password = req.body.password 
//             user.save()
//             response.message = 'Password Changed Successfully'
//             response.statusText = 'Success'
//             //res.status(200).json('ohk')
//         }
//     } else {
//         response.message = 'Invalid otp'
//         response.statusText = 'error'
//     }
//     res.status(200).json(response)
// })

//


const sendEmail = async (name, email, token) => {
    try {
        let transporter = nodemailer.createTransport({
            pool:true,
            service: "gmail",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'nodeotp@gmail.com', // generated ethereal user
                pass: process.env.GPass, // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: 'nodeotp@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Otp for password change", // Subject line
            text: "Hello world?", // plain text body
            html: "<p>Hii " + name + ", reset your password using this otp<p>" + token, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })
    }
}


// async..await is not allowed in global scope, must use a wrapper

// const sendmail = async (req, res) => {
//     const nodemailer = require("nodemailer");
//     // Generate test SMTP service account from ethereal.email
//     // Only needed if you don't have a real mail account for testing
//     let testAccount = await nodemailer.createTestAccount();

//     // create reusable transporter object using the default SMTP transport
//     // const transporter = nodemailer.createTransport({
//     //     host: 'smtp.ethereal.email',
//     //     port: 587,
//     //     auth: {
//     //         user: 'toy.little73@ethereal.email',
//     //         pass: 'qemMwp6w8r8mAPx8rB'
//     //     }
//     // });

//     let transporter = nodemailer.createTransport({
//         service: "gmail",
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: 'nodeotp@gmail.com', // generated ethereal user
//             pass: 'anupljlaklpmyoqe', // generated ethereal password
//         },
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//         from: 'nodeotp@gmail.com', // sender address
//         to: "eserishabh@gmail.com", // list of receivers
//         subject: "Hello 2", // Subject line
//         text: "Hello world?", // plain text body
//         html: "<b>Hello world?</b>", // html body
//     });

//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//     // Preview only available when sending through an Ethereal account
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

//main().catch(console.error);
//
//



module.exports = router;
