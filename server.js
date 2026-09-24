const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/subscribe", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email address is required."
        });
    }

    try {
        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                email,
                listIds: [Number(process.env.BREVO_LIST_ID)],
                updateEnabled: true
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                message: data.message || "Unable to subscribe."
            });
        }

        res.json({
            success: true,
            message: "Successfully subscribed."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error. Please try again later."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`RETURN running on port ${PORT}`);
});
