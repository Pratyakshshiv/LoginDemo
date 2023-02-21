const { response } = require("express");
const express = require("express");
const router = express.Router()
const User = require("../Modals/UserData");
// router.post("/userData", (req, res) => {
//     try {
//         res.send([global.users]);
//         // console.log(global.users)
//     } catch (error) {
//         console.log(error)
//         res.send("server error")
//     }
// })
router.get("/userData", async (req, res) => {
    try {
        const users = await User.find({})
        res.send([users])
        // res.send([global.users])
    } catch (error) {
        console.log(error)
        res.send("server error")
    }
})

module.exports = router;