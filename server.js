/* =========================================================
   URDU VOICE STUDIO AI
   server.js
   Secure AI Backend
   ========================================================= */

"use strict";

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

/* =========================================================
   SERVER SETTINGS
   ========================================================= */

const PORT = process.env.PORT || 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(
    cors({
        origin: true,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    })
);

app.use(
    express.json({
        limit: "1mb"
    })
);


/* =========================================================
   BASIC HOME / HEALTH CHECK
   ========================================================= */

app.get("/", function (req, res) {

    res.json({
        name: "Urdu Voice Studio AI",
        status: "online",
        message: "Urdu Voice Studio AI backend is running."
    });

});


/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/api/health", function (req, res) {

    res.json({
        ok: true,
        service: "urdu-voice-studio-ai",
        time: new Date().toISOString()
    });

});


/* =========================================================
   AI TEXT ENDPOINT
   ========================================================= */

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


        /* -----------------------------------------------------
           VALIDATION
           ----------------------------------------------------- */

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


        /* -----------------------------------------------------
           TOOL INSTRUCTIONS
           ----------------------------------------------------- */

        let instruction = "";


        switch (tool) {

            case "improve":

                instruction =
                    "آپ اردو وائس اسٹوڈیو AI کے متن بہتر کرنے والے معاون ہیں۔ " +
                    "صارف کے متن کا اصل مطلب برقرار رکھتے ہوئے اسے صاف، " +
                    "قدرتی، باوقار اور روان پاکستانی اردو میں بہتر کریں۔ " +
                    "غیر ضروری تبدیلی نہ کریں۔";

                break;


            case "lyrics":

                instruction =
                    "آپ اردو اور پاکستانی مسیحی گیتوں کے لیے Lyrics معاون ہیں۔ " +
                    "الفاظ گانے کے قابل، رواں، موزوں اور بامعنی رکھیں۔ " +
                    "غیر ضروری تکرار سے بچیں۔";

                break;


            case "bible":

                instruction =
                    "آپ Bible Study معاون ہیں۔ " +
                    "صارف کے سوال کا جواب بائبلی حوالوں، تاریخی پس منظر، " +
                    "لفظی تحقیق اور واضح اردو میں دیں۔ " +
                    "جہاں یقین نہ ہو وہاں قیاس کو حقیقت کے طور پر پیش نہ کریں۔";

                break;


            case "script":

                instruction =
                    "آپ Video Script معاون ہیں۔ " +
                    "صارف کے موضوع سے واضح، قدرتی اور بولنے کے قابل اردو ویڈیو اسکرپٹ تیار کریں۔";

                break;


            case "translate":

                instruction =
                    "آپ Translation معاون ہیں۔ " +
                    "صارف کے متن کا درست اور قدرتی ترجمہ کریں۔ " +
                    "اصل مفہوم، لہجہ اور سیاق برقرار رکھیں۔";

                break;


            case "image":

                instruction =
                    "آپ Image Prompt معاون ہیں۔ " +
                    "صارف کے خیال کو ایک واضح، خوبصورت اور تفصیلی image-generation prompt میں تبدیل کریں۔";

                break;


            case "voice":

                instruction =
                    "آپ Urdu Voice Studio کے Voice Preparation معاون ہیں۔ " +
                    "متن کو قدرتی آواز میں پڑھنے کے لیے مناسب punctuation، " +
                    "وقفوں اور paragraph structure کے ساتھ تیار کریں۔";

                break;


            default:

                instruction =
                    "آپ Urdu Voice Studio AI کے مرکزی معاون ہیں۔ " +
                    "صارف کے سوال یا درخواست کا واضح، مفید اور قدرتی جواب دیں۔";

                break;
        }


        /* -----------------------------------------------------
           LANGUAGE INSTRUCTION
           ----------------------------------------------------- */

        let languageInstruction = "";

        if (language === "ur-PK") {

            languageInstruction =
                "جواب پاکستانی اردو رسم الخط میں دیں۔ " +
                "ہندی دیوناگری رسم الخط استعمال نہ کریں۔";

        } else {

            languageInstruction =
                "صارف کی منتخب کردہ زبان کے مطابق جواب دیں۔";

        }


        /* -----------------------------------------------------
           FINAL SYSTEM INSTRUCTION
           ----------------------------------------------------- */

        const systemInstruction =
            instruction +
            "\n\n" +
            languageInstruction +
            "\n\n" +
            "مختصر مگر مکمل جواب دیں۔ " +
            "غیر ضروری گفتگو نہ کریں۔";


        /* -----------------------------------------------------
           OPENAI RESPONSE
           ----------------------------------------------------- */

        const response = await client.responses.create({

            model: "gpt-6-luna",

            instructions: systemInstruction,

            input: userText

        });


        /* -----------------------------------------------------
           RESULT
           ----------------------------------------------------- */

        const output =
            response.output_text || "";


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

        console.error(
            "AI ERROR:",
            error
        );


        return res.status(500).json({

            ok: false,

            error:
                "AI سروس سے رابطہ کرتے وقت مسئلہ پیش آیا۔"

        });

    }

});


/* =========================================================
   404 HANDLER
   ========================================================= */

app.use(function (req, res) {

    res.status(404).json({

        ok: false,

        error: "یہ راستہ موجود نہیں ہے۔"

    });

});


/* =========================================================
   SERVER START
   ========================================================= */

app.listen(
    PORT,
    function () {

        console.log(
            "=========================================="
        );

        console.log(
            "Urdu Voice Studio AI Backend"
        );

        console.log(
            "Server running on port:",
            PORT
        );

        console.log(
            "=========================================="
        );

    }
);
