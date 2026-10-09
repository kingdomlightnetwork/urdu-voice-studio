
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

/* ================= SERVER SETTINGS ================= */

const PORT = process.env.PORT || 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/* ================= MIDDLEWARE ================= */

app.use(
    cors({
        origin: true,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    })
);

app.use(express.json({ limit: "1mb" }));

/* ================= MARKDOWN CLEANER ================= */

/* صرف آواز کے لیے متن صاف کریں؛ اصل دکھائی دینے والا متن تبدیل نہیں ہوگا۔ */
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

/* ================= HOME / HEALTH CHECK ================= */

app.get("/", function (req, res) {
    res.json({
        name: "Urdu Voice Studio AI",
        status: "online",
        message: "Urdu Voice Studio AI backend is running."
    });
});

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
                error: "متن بہت زیادہ لمبا ہے۔ اسے پہلے کچھ مختصر کریں۔"
            });
        }

        let instruction = "";

        switch (tool) {
            case "improve":
                instruction =
                    "آپ اردو وائس اسٹوڈیو AI کے متن بہتر کرنے والے معاون ہیں۔ " +
                    "اصل مطلب برقرار رکھتے ہوئے متن کو صاف، قدرتی اور رواں پاکستانی اردو میں بہتر کریں۔";
                break;

            case "lyrics":
                instruction =
                    "آپ اردو اور پاکستانی مسیحی گیتوں کے معاون ہیں۔ " +
                    "الفاظ گانے کے قابل، رواں، موزوں اور بامعنی رکھیں۔";
                break;

            case "bible":
                instruction =
                    "آپ Bible Study معاون ہیں۔ " +
                    "بائبلی حوالوں، تاریخی پس منظر اور لفظی تحقیق کے ساتھ واضح اردو میں جواب دیں۔ " +
                    "غیر یقینی بات کو حقیقت کے طور پر پیش نہ کریں۔";
                break;

            case "script":
                instruction =
                    "آپ ویڈیو اسکرپٹ معاون ہیں۔ " +
                    "واضح، قدرتی اور بولنے کے قابل اردو اسکرپٹ تیار کریں۔";
                break;

            case "translate":
                instruction =
                    "متن کا درست اور قدرتی ترجمہ کریں اور اصل مفہوم برقرار رکھیں۔";
                break;

            case "image":
                instruction =
                    "صارف کے خیال کو واضح اور تفصیلی image-generation prompt میں تبدیل کریں۔";
                break;

            case "voice":
                instruction =
                    "متن کو آواز میں پڑھنے کے لیے مناسب وقفوں اور پیراگراف کے ساتھ تیار کریں۔";
                break;

            default:
                instruction =
                    "آپ Urdu Voice Studio AI کے مرکزی معاون ہیں۔ " +
                    "واضح، مفید اور قدرتی جواب دیں۔";
                break;
        }

        const languageInstruction =
            language === "ur-PK"
                ? "جواب پاکستانی اردو رسم الخط میں دیں۔ ہندی دیوناگری استعمال نہ کریں۔"
                : "صارف کی منتخب کردہ زبان میں جواب دیں۔";

        const response = await client.responses.create({
            model: "gpt-6-luna",
            instructions:
                instruction + "\n\n" + languageInstruction +
                "\n\nمختصر مگر مکمل جواب دیں۔",
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

/*
  ویب سائٹ کے لیے AI آواز بنائیں۔
  کمپیوٹر کی مقامی SpeechSynthesis آواز استعمال نہیں ہوتی۔
*/

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
                error: "اس مرحلے میں آواز کے لیے متن 4096 حروف سے کم ہونا چاہیے۔"
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

        if (!Number.isFinite(speed)) speed = 1;

        speed = Math.max(0.25, Math.min(4, speed));

        const speech = await client.audio.speech.create({
            model: "gpt-4o-mini-tts",
            voice: voice,
            input: text,
            instructions:
                "Speak the provided text in clear, natural Pakistani Urdu. " +
                "Use a respectful, warm, steady narration style suitable for Bible study. " +
                "Pronounce Urdu words carefully, observe punctuation and pauses, " +
                "and do not speak Markdown symbols or formatting instructions.",
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
