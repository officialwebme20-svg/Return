const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.post("/api/subscribe", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email address is required."
        });
    }

    if (!process.env.BREVO_API_KEY) {
        return res.status(500).json({
            success: false,
            message: "BREVO_API_KEY is missing in Render."
        });
    }

    if (!process.env.BREVO_LIST_ID) {
        return res.status(500).json({
            success: false,
            message: "BREVO_LIST_ID is missing in Render."
        });
    }

    try {
        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                email: email,
                listIds: [Number(process.env.BREVO_LIST_ID)],
                updateEnabled: true
            })
        });

        const data = await response.json();

        console.log("Brevo status:", response.status);
        console.log("Brevo response:", data);

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                message: data.message || "Brevo rejected the subscription."
            });
        }

        return res.status(200).json({
            success: true,
            message: "You're subscribed. Thank you for joining RETURN!"
        });

    } catch (error) {
        console.error("Brevo error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to connect to Brevo."
        });
    }
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`RETURN running on port ${PORT}`);
});
