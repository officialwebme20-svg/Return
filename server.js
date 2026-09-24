const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.post("/api/subscribe", (req, res) => {
    console.log("SUBSCRIBE REQUEST RECEIVED");
    console.log("Body:", req.body);

    return res.status(200).json({
        success: true,
        message: "API is working!"
    });
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`RETURN running on port ${PORT}`);
});
