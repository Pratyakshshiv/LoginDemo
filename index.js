const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require("./db");
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())

app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))


mongoDB();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accepet"
    );
    next();
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use(express.json());

app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/SendEmail"));


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});