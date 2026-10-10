
/* =========================================================
   URDU VOICE STUDIO AI
   server.js
   AI Text + Urdu Text-to-Speech Backend
========================================================= */

"use strict";

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/* ================= MIDDLEWARE ================= */

app.use(cors({
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: "1mb" }));

/* ================= TEXT CLEANER ================= */

function cleanTextForSpeech(text) {
    return String(text || "")
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/^\s*#{1,6}\s*/gm, "")
        .replace(/^\s*>\s?/gm, "")
        .replace(/^\s*[-*+]\s+/gm, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/_(.*?)_/g, "$1")
        .replace(/~~(.*?)~~/g, "$1")
        .replace(/[#*_~`]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

/* ================= HOME ================= */

app.get("/", function (req, res) {
    res.json({
        name: "Urdu Voice Studio AI",
        status: "online",
        message: "Urdu Voice Studio AI backend is running."
    });
});

/* ================= HEALTH CHECK ================= */

app.get("/api/health", function (req, res) {
    res.json({
        ok: true,
        service: "urdu-voice-studio-ai",
        time: new Date().toISOString()
    });
});

/* ================= AI TEXT ENDPOINT ================= */

app.post("/api/ai", async function (req, res) {
    try {
        const userText =
            typeof req.body.text === "string"
                ? req.body.text.trim()
                : "";

        const language =
            typeof req.body.language === "string"
                ? req.body.language
                : "ur-PK";

        const tool =
            typeof req.body.tool === "string"
                ? req.body.tool
                : "text";

        if (!userText) {
            return res.status(400).json({
                ok: false,
                error: "براہِ کرم پہلے متن یا سوال لکھیں۔"
            });
        }

        if (userText.length > 20000) {
            return res.status(400).json({
                ok: false,
                error: "متن بہت زیادہ لمبا ہے۔ اسے مختصر کریں۔"
            });
        }

        let instruction = "";

        switch (tool) {
            case "improve":
                instruction =
                    "Improve the text while preserving its original meaning. " +
                    "Use clear, natural Pakistani Urdu when the input is Urdu.";
                break;

            case "lyrics":
                instruction =
                    "Help write meaningful, singable Pakistani Urdu and Christian lyrics. " +
                    "Keep the rhythm natural and the wording clear.";
                break;

            case "bible":
                instruction =
                    "You are a Bible study assistant. Explain references clearly, " +
                    "include historical context where relevant, and distinguish facts from uncertainty.";
                break;

            case "script":
                instruction =
                    "Prepare a clear, natural, speakable script in the user's language.";
                break;

            case "translate":
                instruction =
                    "Translate accurately into the requested language and preserve the meaning.";
                break;

            case "image":
                instruction =
                    "Turn the user's idea into a clear, detailed image-generation prompt.";
                break;

            case "voice":
                instruction =
                    "Prepare the text for spoken narration with natural punctuation and pauses.";
                break;

            default:
                instruction =
                    "You are the Urdu Voice Studio AI assistant. " +
                    "Give a clear and helpful answer in the requested language.";
                break;
        }

        const languageInstruction =
            language === "ur-PK"
                ? "Write in Pakistani Urdu script. Do not use Devanagari."
                : "Use the language selected by the user.";

        const response = await client.responses.create({
            model: "gpt-6-luna",
            instructions:
                instruction + "\n\n" +
                languageInstruction + "\n\n" +
                "Give a concise but complete answer.",
            input: userText
        });

        const output = response.output_text || "";

        if (!output.trim()) {
            return res.status(500).json({
                ok: false,
                error: "AI سے کوئی جواب موصول نہیں ہوا۔"
            });
        }

        return res.json({
            ok: true,
            text: output,
            language: language,
            tool: tool
        });

    } catch (error) {
        console.error("AI ERROR:", error);

        return res.status(500).json({
            ok: false,
            error: "AI سروس سے رابطہ کرتے وقت مسئلہ پیش آیا۔"
        });
    }
});

/* ================= TEXT-TO-SPEECH ENDPOINT ================= */

app.post("/api/tts", async function (req, res) {
    try {
        const originalText =
            typeof req.body.text === "string"
                ? req.body.text
                : "";

        const text = cleanTextForSpeech(originalText);

        if (!text) {
            return res.status(400).json({
                ok: false,
                error: "آواز بنانے کے لیے متن موجود نہیں۔"
            });
        }

        if (text.length > 4096) {
            return res.status(400).json({
                ok: false,
                error: "آواز کے لیے متن 4096 حروف سے کم ہونا چاہیے۔"
            });
        }

        const requestedVoice =
            typeof req.body.voice === "string"
                ? req.body.voice
                : "marin";

        const allowedVoices = [
            "alloy", "ash", "ballad", "coral",
            "echo", "fable", "nova", "onyx",
            "sage", "shimmer", "verse", "marin", "cedar"
        ];

        const voice = allowedVoices.includes(requestedVoice)
            ? requestedVoice
            : "marin";

        const requestedFormat =
            typeof req.body.format === "string"
                ? req.body.format.toLowerCase()
                : "mp3";

        const format = ["mp3", "wav"].includes(requestedFormat)
            ? requestedFormat
            : "mp3";

        let speed = Number(req.body.speed);

        if (!Number.isFinite(speed)) {
            speed = 1;
        }

        speed = Math.max(0.25, Math.min(4, speed));

        const speech = await client.audio.speech.create({
            model: "gpt-4o-mini-tts",
            voice: voice,
            input: text,
            instructions:
                "The input is Pakistani Urdu written in Urdu script. " +
                "Speak the text in Urdu, not English and not Hindi. " +
                "Use natural Pakistani Urdu pronunciation and carefully pronounce " +
                "the Urdu consonants and vowels. Read the text as written. " +
                "Do not translate, transliterate, or paraphrase it. " +
                "Use a warm, clear, respectful narration style suitable for Bible study. " +
                "Follow punctuation and natural pauses. Do not read Markdown symbols aloud.",
            response_format: format,
            speed: speed
        });

        const audioBuffer = Buffer.from(
            await speech.arrayBuffer()
        );

        res.setHeader(
            "Content-Type",
            format === "wav" ? "audio/wav" : "audio/mpeg"
        );

        res.setHeader(
            "Content-Disposition",
            'inline; filename="urdu-voice-studio.' + format + '"'
        );

        res.setHeader("X-Audio-Generated", "AI");

        return res.status(200).send(audioBuffer);

    } catch (error) {
        console.error("TTS ERROR:", error);

        return res.status(500).json({
            ok: false,
            error: "اردو آواز تیار نہیں ہو سکی۔ سرور یا TTS سروس کی خرابی چیک کریں۔"
        });
    }
});

/* ================= 404 HANDLER ================= */

app.use(function (req, res) {
    res.status(404).json({
        ok: false,
        error: "یہ راستہ موجود نہیں ہے۔"
    });
});

/* ================= SERVER START ================= */

app.listen(PORT, function () {
    console.log("==========================================");
    console.log("Urdu Voice Studio AI Backend");
    console.log("Server running on port:", PORT);
    console.log("AI Text endpoint: /api/ai");
    console.log("AI Speech endpoint: /api/tts");
    console.log("==========================================");
});
