const subscribeForm = document.getElementById("subscribeForm");
const subscriberEmail = document.getElementById("subscriberEmail");
const subscribeMessage = document.getElementById("subscribeMessage");

if (subscribeForm) {
    subscribeForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = subscriberEmail.value.trim();
        const button = subscribeForm.querySelector("button");

        if (!email) return;

        button.disabled = true;
        button.textContent = "Subscribing...";
        subscribeMessage.textContent = "";

        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const contentType = response.headers.get("content-type") || "";

            if (contentType.includes("application/json")) {
                const data = await response.json();

                if (response.ok) {
                    subscribeMessage.textContent =
                        "You're subscribed. Thank you for joining RETURN!";
                    subscriberEmail.value = "";
                } else {
                    subscribeMessage.textContent =
                        data.message || "Unable to subscribe.";
                }
            } else {
                subscribeMessage.textContent =
                    "The RETURN server returned an unexpected response.";
            }

        } catch (error) {
            console.error("Subscription error:", error);

            subscribeMessage.textContent =
                "Unable to connect to the RETURN server.";
        } finally {
            button.disabled = false;
            button.textContent = "Subscribe";
        }
    });
}
