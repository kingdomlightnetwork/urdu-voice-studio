
"use strict";

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", function (req, res) {
    res.json({
        name: "Urdu Voice Studio AI",
        status: "online",
        message: "Free-only mode. No paid AI service is connected."
    });
});

app.get("/api/health", function (req, res) {
    res.json({ ok: true, mode: "free-only" });
});

// Paid AI text generation has been disabled.
app.post("/api/ai", function (req, res) {
    res.status(410).json({
        ok: false,
        error: "Paid AI text generation has been disabled."
    });
});

// Paid text-to-speech has been disabled.
app.post("/api/tts", function (req, res) {
    res.status(410).json({
        ok: false,
        error: "Paid text-to-speech has been disabled."
    });
});

app.listen(PORT, function () {
    console.log("Urdu Voice Studio AI — Free-only mode");
    console.log("Server running on port:", PORT);
    console.log("No OpenAI API calls are enabled.");
});
