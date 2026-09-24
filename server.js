const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/subscribe", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email address is required."
        });
    }

    if (!process.env.BREVO_API_KEY) {
        console.error("BREVO_API_KEY is missing");
        return res.status(500).json({
            success: false,
            message: "Brevo API key is not configured."
        });
    }

    if (!process.env.BREVO_LIST_ID) {
        console.error("BREVO_LIST_ID is missing");
        return res.status(500).json({
            success: false,
            message: "Brevo list ID is not configured."
        });
    }

    try {
        const listId = Number(process.env.BREVO_LIST_ID);

        if (!Number.isInteger(listId)) {
            console.error("Invalid BREVO_LIST_ID:", process.env.BREVO_LIST_ID);
            return res.status(500).json({
                success: false,
                message: "Brevo list ID is invalid."
            });
        }

        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                email: email,
                listIds: [listId],
                updateEnabled: true
            })
        });

        const text = await response.text();

        let data = {};

        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            data = {
                message: text || "Unknown response from Brevo."
            };
        }

        console.log("Brevo status:", response.status);
        console.log("Brevo response:", data);

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                message: data.message || "Brevo rejected the subscription."
            });
        }

        return res.json({
            success: true,
            message: "You're subscribed. Thank you for joining RETURN!"
        });

    } catch (error) {
        console.error("Subscription error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to connect to Brevo."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`RETURN running on port ${PORT}`);
});
