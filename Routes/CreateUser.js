const express = require("express");
const router = express.Router();
const User = require("../Modals/UserData");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { updateOne } = require("../Modals/UserData");
router.post(
    "/createuser",
    [
        body("email").isEmail(),
        body("name").isLength({ min: 5 }),
        body("password", "Incorrect Password..").isLength({ min: 5 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt);
        try {
            await User.create({
                name: req.body.name,
                email: req.body.email,
                number: req.body.number,
                password: secPassword,
            });
            res.json({ success: true });
        } catch (error) {
            console.log(error.message);
            res.json({ success: false });
        }
    }
);

router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteuser = await User.findByIdAndDelete({ _id: id })
        res.status(201).json(deleteuser)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
})


router.post('/userEdit/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            number: req.body.number
        })
        res.json({ success: true });
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
})


router.post('/verifyUser/:email', async (req, res) => {
    let email = req.params.email
    try {
        let userData = await User.findOne({ email });
        // if (!userData) {
        //     return res.status(400).json({ errors: "enter correct otp.." });
        // }
        if (req.body.token == userData.token) {
            console.log("otp sahi hai")
            return res.json({ success: true });
        } else {
            return res.status(400).json({ errors: "enter correct otp..", success: false })
        }
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
})

router.post('/resetPass/:otp', async (req, res) => {
    let otp = req.params.otp
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);
    try {
        const lalu = await User.findOneAndUpdate({ token: otp }, {
            token: "",
            password: secPassword
        });
        console.log(lalu)
        console.log("change hua")
        res.json({ success: true });
    } catch (error) {
        console.log("change nahi hua")
        res.status(409).json({ message: error.message })
    }

})


router.get("/userEdit/:id", async (req, res) => {
    try {
        const users = await User.findById(req.params.id)
        res.send([users])
        // res.send([global.users])
    } catch (error) {
        console.log(error)
        res.send("server error")
    }
})

router.post(
    "/loginuser",
    [
        body("email").isEmail(),
        body("password", "Incorrect Password..").isLength({ min: 5 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let email = req.body.email;

        try {
            let userData = await User.findOne({ email });
            if (!userData) {
                return res.status(400).json({ errors: "enter correct cred.." });
            }
            const pwdCompare = await bcrypt.compare(
                req.body.password,
                userData.password
            );
            if (!pwdCompare) {
                return res.status(400).json({ errors: "enter correct cred.." });
            }
            const data = {
                user: {
                    id: userData.id,
                },
            };
            const authToken = jwt.sign(data, process.env.jwtSecret);

            return res.json({ success: true, authToken: authToken });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    }
);


module.exports = router;