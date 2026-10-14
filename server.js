```js
"use strict";

const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const PIPER_EXE =
    process.env.PIPER_EXE ||
    path.join(
        os.homedir(),
        "AppData",
        "Local",
        "Programs",
        "Python",
        "Python313",
        "Scripts",
        "piper.exe"
    );

const PIPER_MODEL =
    process.env.PIPER_MODEL ||
    "C:\\Users\\Hello\\Desktop\\piper\\ur_PK-fasih-medium-model.onnx";

const PIPER_CONFIG =
    process.env.PIPER_CONFIG ||
    "C:\\Users\\Hello\\Desktop\\piper\\ur_PK-fasih-medium-model.onnx.json";

const PIPER_DATA_DIR =
    process.env.PIPER_DATA_DIR ||
    "C:\\Users\\Hello\\Desktop\\piper\\espeak-ng-data";

const AUDIO_DIR = path.join(os.tmpdir(), "urdu-voice-studio-audio");

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
    res.json({
        ok: true,
        mode: "free-only",
        tts: "piper"
    });
});

// Paid AI text generation remains disabled.
app.post("/api/ai", function (req, res) {
    res.status(410).json({
        ok: false,
        error: "Paid AI text generation has been disabled."
    });
});

// Free local Piper text-to-speech.
app.post("/api/tts", function (req, res) {
    const text = req.body && req.body.text;

    if (typeof text !== "string" || !text.trim()) {
        return res.status(400).json({
            ok: false,
            error: "Please provide text to convert to speech."
        });
    }

    if (text.length > 10000) {
        return res.status(413).json({
            ok: false,
            error: "Text is too long. Please use 10000 characters or fewer."
        });
    }

    if (
        !fs.existsSync(PIPER_EXE) ||
        !fs.existsSync(PIPER_MODEL) ||
        !fs.existsSync(PIPER_CONFIG) ||
        !fs.existsSync(PIPER_DATA_DIR)
    ) {
        return res.status(500).json({
            ok: false,
            error: "Piper setup files were not found. Check the configured paths."
        });
    }

    try {
        fs.mkdirSync(AUDIO_DIR, { recursive: true });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: "Could not prepare the temporary audio folder."
        });
    }

    const id = crypto.randomUUID();
    const inputFile = path.join(AUDIO_DIR, `${id}.txt`);
    const outputFile = path.join(AUDIO_DIR, `${id}.wav`);

    try {
        fs.writeFileSync(inputFile, text.trim(), "utf8");
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: "Could not prepare the text for speech."
        });
    }

    const args = [
        "--model", PIPER_MODEL,
        "--config", PIPER_CONFIG,
        "--input_file", inputFile,
        "--output_file", outputFile,
        "--data-dir", PIPER_DATA_DIR
    ];

    const child = spawn(PIPER_EXE, args, {
        windowsHide: true,
        stdio: ["ignore", "ignore", "pipe"]
    });

    let stderr = "";
    let finished = false;

    const timeout = setTimeout(function () {
        if (!finished) {
            child.kill();
        }
    }, 120000);

    child.stderr.on("data", function (chunk) {
        stderr += chunk.toString();
    });

    child.on("error", function () {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        cleanup();

        if (!res.headersSent) {
            res.status(500).json({
                ok: false,
                error: "Piper could not start. Check the Piper executable path."
            });
        }
    });

    child.on("close", function (code) {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);

        if (code !== 0 || !fs.existsSync(outputFile)) {
            cleanup();

            if (!res.headersSent) {
                res.status(500).json({
                    ok: false,
                    error: "Piper could not generate audio.",
                    details: stderr.slice(-1500)
                });
            }
            return;
        }

        res.setHeader("Content-Type", "audio/wav");
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="urdu-voice.wav"'
        );

        const stream = fs.createReadStream(outputFile);

        stream.on("error", function () {
            cleanup();
            if (!res.headersSent) {
                res.status(500).json({
                    ok: false,
                    error: "Could not read the generated audio."
                });
            } else {
                res.destroy();
            }
        });

        stream.on("close", cleanup);
        res.on("close", cleanup);

        stream.pipe(res);
    });

    function cleanup() {
        for (const file of [inputFile, outputFile]) {
            try {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            } catch (_) {
                // Temporary file cleanup can be retried later.
            }
        }
    }
});

app.listen(PORT, function () {
    console.log("Urdu Voice Studio AI — Free-only mode");
    console.log("Server running on port:", PORT);
    console.log("Local Piper TTS endpoint is enabled.");
    console.log("No OpenAI API calls are enabled.");
});
```
