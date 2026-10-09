/* =========================================================
   URDU VOICE STUDIO AI
   studio.js
   Backend + Urdu Speech-to-Text
========================================================= */

(function () {
"use strict";

/* =========================================================
   BACKEND
========================================================= */

const API_BASE_URL = "http://localhost:3000";
const AI_ENDPOINT = API_BASE_URL + "/api/ai";

/* =========================================================
   STATE
========================================================= */

let currentAudioUrl = "";
let isGenerating = false;

let recognition = null;
let isListening = false;
let micBaseText = "";
let micFinalTranscript = "";
let micErrorMessage = "";

/* =========================================================
   ELEMENTS
========================================================= */

let intro = null;
let studioMain = null;
let studioText = null;
let wordCounter = null;

let generateTextButton = null;
let imageButton = null;
let improveTextButton = null;
let voiceButton = null;

let clearTextButton = null;
let copyTextButton = null;

let languageSelect = null;
let voiceSelect = null;
let speedSelect = null;
let formatSelect = null;

let aiResponseSection = null;
let aiResponseBox = null;
let responseEmpty = null;
let responseContent = null;

let copyResponseButton = null;
let useResponseButton = null;

let audio = null;

let playAudioButton = null;
let pauseAudioButton = null;
let stopAudioButton = null;
let downloadAudioButton = null;

let audioStatus = null;

/* Microphone elements */

let startMicButton = null;
let stopMicButton = null;
let micStatus = null;

/* =========================================================
   GET ELEMENTS
========================================================= */

function getElements() {

    intro = document.getElementById("studioIntro");
    studioMain = document.getElementById("studioMain");
    studioText = document.getElementById("studioText");
    wordCounter = document.getElementById("wordCounter");

    generateTextButton =
        document.getElementById("generateTextButton");

    imageButton =
        document.getElementById("imageButton");

    improveTextButton =
        document.getElementById("improveTextButton");

    voiceButton =
        document.getElementById("voiceButton");

    clearTextButton =
        document.getElementById("clearTextButton");

    copyTextButton =
        document.getElementById("copyTextButton");

    languageSelect =
        document.getElementById("languageSelect");

    voiceSelect =
        document.getElementById("voiceSelect");

    speedSelect =
        document.getElementById("speedSelect");

    formatSelect =
        document.getElementById("formatSelect");

    aiResponseSection =
        document.getElementById("aiResponseSection");

    aiResponseBox =
        document.getElementById("aiResponseBox");

    responseEmpty =
        document.getElementById("responseEmpty");

    responseContent =
        document.getElementById("responseContent");

    copyResponseButton =
        document.getElementById("copyResponseButton");

    useResponseButton =
        document.getElementById("useResponseButton");

    audio =
        document.getElementById("studioAudio");

    playAudioButton =
        document.getElementById("playAudioButton");

    pauseAudioButton =
        document.getElementById("pauseAudioButton");

    stopAudioButton =
        document.getElementById("stopAudioButton");

    downloadAudioButton =
        document.getElementById("downloadAudioButton");

    audioStatus =
        document.getElementById("audioStatus");

    startMicButton =
        document.getElementById("startMicButton");

    stopMicButton =
        document.getElementById("stopMicButton");

    micStatus =
        document.getElementById("micStatus");
}

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function getText() {
    return studioText ? studioText.value.trim() : "";
}

function setText(text) {

    if (!studioText) return;

    studioText.value = text || "";
    updateWordCounter();
}

function showMessage(message) {

    if (!aiResponseSection) return;

    aiResponseSection.hidden = false;

    if (responseEmpty) {
        responseEmpty.hidden = true;
    }

    if (responseContent) {
        responseContent.hidden = false;
        responseContent.textContent = message || "";
    }
}

function hideResponse() {

    if (!aiResponseSection) return;

    aiResponseSection.hidden = true;

    if (responseEmpty) {
        responseEmpty.hidden = false;
    }

    if (responseContent) {
        responseContent.hidden = true;
        responseContent.textContent = "";
    }
}

function setAudioStatus(message) {

    if (!audioStatus) return;

    audioStatus.textContent = message || "";
}

function setMicStatus(message) {

    if (!micStatus) return;

    micStatus.textContent = message || "";
}

/* =========================================================
   AI BACKEND REQUEST
========================================================= */

async function callAI(tool, text) {

    const cleanText =
        typeof text === "string" ? text.trim() : "";

    if (!cleanText) {
        throw new Error("براہِ کرم پہلے متن لکھیں۔");
    }

    const language =
        languageSelect && languageSelect.value
            ? languageSelect.value
            : "ur-PK";

    let response;

    try {

        response = await fetch(AI_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tool: tool || "default",
                text: cleanText,
                language: language
            })
        });

    } catch (networkError) {

        throw new Error(
            "Backend سے رابطہ نہیں ہو سکا۔ یقینی بنائیں کہ Command Prompt میں Server چل رہا ہے۔"
        );
    }

    let data = null;

    try {
        data = await response.json();
    } catch (jsonError) {
        throw new Error("Backend نے درست جواب نہیں دیا۔");
    }

    if (!response.ok || !data || !data.ok) {

        throw new Error(
            data && data.error
                ? data.error
                : "AI Backend سے جواب حاصل نہیں ہو سکا۔"
        );
    }

    return data;
}

/* =========================================================
   WORD COUNTER
========================================================= */

function updateWordCounter() {

    if (!studioText || !wordCounter) return;

    const text = studioText.value.trim();

    if (!text) {
        wordCounter.textContent = "0 الفاظ";
        return;
    }

    const words = text.split(/\s+/).filter(Boolean);

    wordCounter.textContent = words.length + " الفاظ";
}

/* =========================================================
   MICROPHONE: SPEECH TO TEXT
========================================================= */

function updateMicButtons() {

    if (startMicButton) {
        startMicButton.disabled = isListening;
    }

    if (stopMicButton) {
        stopMicButton.disabled = !isListening;
    }
}

function getSpeechRecognitionLanguage() {

    const selectedLanguage =
        languageSelect && languageSelect.value
            ? languageSelect.value
            : "ur-PK";

    return selectedLanguage;
}

function startMicrophone() {

    if (!studioText) {
        setMicStatus("متن لکھنے والا خانہ دستیاب نہیں ہے۔");
        return;
    }

    if (isListening) return;

    const SpeechRecognitionAPI =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {

        setMicStatus(
            "آپ کے براؤزر میں آواز سے متن لکھنے کی سہولت دستیاب نہیں۔ براہِ کرم کمپیوٹر پر Google Chrome کا تازہ ورژن استعمال کریں۔"
        );

        return;
    }

    try {

        recognition = new SpeechRecognitionAPI();

        recognition.lang = getSpeechRecognitionLanguage();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        /*
         موجودہ تحریر محفوظ رکھیں۔
         نئی بولی گئی تحریر اس کے بعد شامل ہوگی۔
        */

        micBaseText = studioText.value.trim();
        micFinalTranscript = "";
        micErrorMessage = "";

        recognition.onstart = function () {

            isListening = true;
            updateMicButtons();

            setMicStatus(
                "مائیکروفون چل رہا ہے۔ اب اردو میں بولیں۔۔۔"
            );
        };

        recognition.onresult = function (event) {

            let interimTranscript = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                const result = event.results[i];
                const transcript = result[0].transcript;

                if (result.isFinal) {

                    micFinalTranscript +=
                        (micFinalTranscript ? " " : "") +
                        transcript.trim();

                } else {

                    interimTranscript += transcript;
                }
            }

            const dictatedText = [
                micFinalTranscript.trim(),
                interimTranscript.trim()
            ].filter(Boolean).join(" ").trim();

            const combinedText = [
                micBaseText,
                dictatedText
            ].filter(Boolean).join(" ").trim();

            studioText.value = combinedText;
            updateWordCounter();

            if (dictatedText) {
                setMicStatus("آپ کی آواز متن میں تبدیل ہو رہی ہے۔۔۔");
            }
        };

        recognition.onerror = function (event) {

            const errorMessages = {
                "no-speech":
                    "کوئی آواز سنائی نہیں دی۔ دوبارہ بول کر کوشش کریں۔",

                "audio-capture":
                    "مائیکروفون نہیں مل سکا۔ مائیکروفون کا کنکشن چیک کریں۔",

                "not-allowed":
                    "مائیکروفون کی اجازت نہیں ملی۔ براؤزر کی Site Settings میں مائیکروفون کی اجازت دیں۔",

                "service-not-allowed":
                    "براؤزر کی آواز پہچاننے والی سروس کی اجازت نہیں ہے۔",

                "network":
                    "آواز پہچاننے کے لیے نیٹ ورک کا مسئلہ پیش آیا۔",

                "language-not-supported":
                    "منتخب زبان اس براؤزر میں آواز سے متن کے لیے دستیاب نہیں۔",

                "aborted":
                    "مائیکروفون کا عمل روک دیا گیا۔"
            };

            micErrorMessage =
                errorMessages[event.error] ||
                ("مائیکروفون میں مسئلہ آیا: " + event.error);

            setMicStatus(micErrorMessage);
        };

        recognition.onend = function () {

            isListening = false;
            updateMicButtons();

            if (micErrorMessage) {

                setMicStatus(micErrorMessage);

            } else if (micFinalTranscript.trim()) {

                setMicStatus(
                    "آواز سے متن لکھنے کا عمل مکمل ہو گیا ہے۔"
                );

            } else {

                setMicStatus(
                    "مائیکروفون بند ہے۔ دوبارہ بولنے کے لیے بٹن دبائیں۔"
                );
            }

            recognition = null;
        };

        recognition.start();

    } catch (error) {

        isListening = false;
        updateMicButtons();

        setMicStatus(
            "مائیکروفون شروع نہیں ہو سکا۔ صفحہ دوبارہ کھول کر کوشش کریں۔"
        );

        recognition = null;
    }
}

function stopMicrophone() {

    if (!recognition || !isListening) {
        setMicStatus("مائیکروفون پہلے ہی بند ہے۔");
        return;
    }

    setMicStatus("مائیکروفون بند کیا جا رہا ہے۔۔۔");

    try {
        recognition.stop();
    } catch (error) {
        isListening = false;
        updateMicButtons();
    }
}

function setupMicrophoneEvents() {

    if (startMicButton) {
        startMicButton.addEventListener(
            "click",
            startMicrophone
        );
    }

    if (stopMicButton) {
        stopMicButton.addEventListener(
            "click",
            stopMicrophone
        );
    }

    updateMicButtons();
}

/* =========================================================
   INTRO
========================================================= */

function startStudioIntro() {

    if (!intro) {

        if (studioMain) {
            studioMain.style.visibility = "visible";
            studioMain.style.opacity = "1";
        }

        return;
    }

    if (studioMain) {
        studioMain.style.visibility = "hidden";
        studioMain.style.opacity = "0";
    }

    requestAnimationFrame(function () {

        intro.classList.add("intro-active");

        setTimeout(function () {

            intro.classList.add("intro-finished");

            setTimeout(function () {

                intro.style.display = "none";

                if (studioMain) {
                    studioMain.style.visibility = "visible";
                    studioMain.style.opacity = "1";
                }

            }, 650);

        }, 3600);
    });
}

/* =========================================================
   INTRO SOUND
========================================================= */

function playIntroSound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) return;

        const context = new AudioContext();

        if (context.state === "suspended") {
            context.resume().catch(function () {});
        }

        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            392,
            context.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            523.25,
            context.currentTime + 1.8
        );

        gain.gain.setValueAtTime(
            0.0001,
            context.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.035,
            context.currentTime + 0.35
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            context.currentTime + 2.1
        );

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.start();

        oscillator.stop(context.currentTime + 2.2);

        setTimeout(function () {

            try {
                context.close();
            } catch (error) {}

        }, 2500);

    } catch (error) {
        /* اختیاری تعارفی آواز */
    }
}

/* =========================================================
   TEXT ACTIONS
========================================================= */

function clearText() {

    setText("");
    hideResponse();

    if (studioText) {
        studioText.focus();
    }
}

async function copyText() {

    const text = getText();

    if (!text) {
        showMessage("کاپی کرنے کے لیے پہلے متن لکھیں۔");
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        showMessage("متن کامیابی سے کاپی ہو گیا ہے۔");

    } catch (error) {

        if (studioText) {

            studioText.focus();
            studioText.select();

            try {

                document.execCommand("copy");

                showMessage("متن کامیابی سے کاپی ہو گیا ہے۔");

            } catch (copyError) {

                showMessage("متن کاپی نہیں ہو سکا۔");
            }
        }
    }
}

/* =========================================================
   AI TEXT GENERATION
========================================================= */

async function generateText() {

    if (isGenerating) return;

    isGenerating = true;

    showMessage("اردو AI جواب تیار کر رہا ہے۔۔۔");

    try {

        const text = getText();

        const requestText =
            text ||
            "پاکستانی اردو میں ایک مختصر اور خوبصورت متن تیار کریں۔";

        const data = await callAI("default", requestText);

        showMessage(
            data.text || "AI نے کوئی متن واپس نہیں کیا۔"
        );

    } catch (error) {

        showMessage(
            "AI سے رابطہ نہیں ہو سکا: " + error.message
        );

    } finally {

        isGenerating = false;
    }
}

/* =========================================================
   IMPROVE TEXT
========================================================= */

async function improveText() {

    const text = getText();

    if (!text) {
        showMessage("متن بہتر کرنے کے لیے پہلے اپنا متن لکھیں۔");
        return;
    }

    if (isGenerating) return;

    isGenerating = true;

    showMessage("آپ کا متن بہتر کیا جا رہا ہے۔۔۔");

    try {

        const data = await callAI("improve", text);

        showMessage(
            data.text || "AI نے کوئی جواب واپس نہیں کیا۔"
        );

    } catch (error) {

        showMessage(
            "متن بہتر نہیں ہو سکا: " + error.message
        );

    } finally {

        isGenerating = false;
    }
}

/* =========================================================
   IMAGE AI
========================================================= */

async function openImageTool() {

    const text = getText();

    if (!text) {

        showMessage("تصویر کے لیے پہلے اپنی ہدایت یا خیال لکھیں۔");

        if (studioText) {
            studioText.focus();
        }

        return;
    }

    if (isGenerating) return;

    isGenerating = true;

    showMessage("Image AI کی درخواست تیار کی جا رہی ہے۔۔۔");

    try {

        const data = await callAI("image", text);

        showMessage(
            data.text || "Image AI کی درخواست مکمل ہوئی۔"
        );

    } catch (error) {

        showMessage(
            "Image AI سے رابطہ نہیں ہو سکا: " + error.message
        );

    } finally {

        isGenerating = false;
    }
}

/* =========================================================
   VOICE REQUEST
========================================================= */

async function generateVoice() {

    const text = getText();

    if (!text) {

        setAudioStatus("پہلے اردو متن لکھیں۔");

        if (studioText) {
            studioText.focus();
        }

        return;
    }

    if (isGenerating) return;

    isGenerating = true;

    setAudioStatus(
        "AI Voice درخواست Backend کو بھیجی جا رہی ہے۔۔۔"
    );

    try {

        const data = await callAI("voice", text);

        showMessage(
            data.text || "AI Voice درخواست مکمل ہوئی۔"
        );

        setAudioStatus(
            "AI Voice Backend سے رابطہ کامیاب ہے۔ اصل MP3/WAV آواز کا نظام ابھی الگ سے جوڑنا باقی ہے۔"
        );

    } catch (error) {

        setAudioStatus(
            "AI Voice سے رابطہ نہیں ہو سکا: " + error.message
        );

    } finally {

        isGenerating = false;
    }
}

/* =========================================================
   AUDIO CONTROLS
========================================================= */

function playAudio() {

    if (!audio) {
        setAudioStatus("آڈیو پلیئر دستیاب نہیں ہے۔");
        return;
    }

    if (!audio.src) {
        setAudioStatus("ابھی کوئی آڈیو موجود نہیں۔ پہلے آواز بنائیں۔");
        return;
    }

    audio.play().catch(function () {
        setAudioStatus("آڈیو چلانے میں مسئلہ آیا۔");
    });
}

function pauseAudio() {

    if (!audio) return;

    audio.pause();
    setAudioStatus("آڈیو روک دی گئی ہے۔");
}

function stopAudio() {

    if (!audio) return;

    audio.pause();

    try {
        audio.currentTime = 0;
    } catch (error) {}

    setAudioStatus("آڈیو بند کر دی گئی ہے۔");
}

function downloadAudio() {

    if (!audio || !audio.src) {

        setAudioStatus(
            "ڈاؤن لوڈ کرنے کے لیے ابھی کوئی آڈیو موجود نہیں۔"
        );

        return;
    }

    const link = document.createElement("a");

    link.href = audio.src;

    link.download =
        formatSelect && formatSelect.value === "wav"
            ? "urdu-voice-studio.wav"
            : "urdu-voice-studio.mp3";

    document.body.appendChild(link);
    link.click();
    link.remove();
}

/* =========================================================
   AUDIO EVENTS
========================================================= */

function setupAudioEvents() {

    if (!audio) return;

    audio.addEventListener("play", function () {
        setAudioStatus("آڈیو چل رہی ہے۔۔۔");
    });

    audio.addEventListener("pause", function () {

        if (
            audio.currentTime > 0 &&
            audio.currentTime < audio.duration
        ) {
            setAudioStatus("آڈیو روک دی گئی ہے۔");
        }
    });

    audio.addEventListener("ended", function () {
        setAudioStatus("آڈیو مکمل ہو گئی ہے۔");
    });

    audio.addEventListener("error", function () {
        setAudioStatus("آڈیو فائل چلانے میں مسئلہ آیا۔");
    });
}

/* =========================================================
   RESPONSE ACTIONS
========================================================= */

async function copyResponse() {

    if (!responseContent) return;

    const text = responseContent.textContent.trim();

    if (!text) return;

    try {

        await navigator.clipboard.writeText(text);

        setAudioStatus("AI جواب کامیابی سے کاپی ہو گیا ہے۔");

    } catch (error) {

        setAudioStatus("AI جواب کاپی نہیں ہو سکا۔");
    }
}

function useResponse() {

    if (!responseContent) return;

    const text = responseContent.textContent.trim();

    if (!text) return;

    setText(text);

    if (studioText) {
        studioText.focus();
    }

    setAudioStatus(
        "AI جواب Voice Studio میں منتقل کر دیا گیا ہے۔"
    );
}

/* =========================================================
   SETTINGS
========================================================= */

function saveSettings() {

    try {

        const settings = {

            language:
                languageSelect
                    ? languageSelect.value
                    : "ur-PK",

            voice:
                voiceSelect
                    ? voiceSelect.value
                    : "default",

            speed:
                speedSelect
                    ? speedSelect.value
                    : "1",

            format:
                formatSelect
                    ? formatSelect.value
                    : "mp3"
        };

        localStorage.setItem(
            "urduVoiceStudioStudioSettings",
            JSON.stringify(settings)
        );

    } catch (error) {}
}

function loadSettings() {

    try {

        const saved = localStorage.getItem(
            "urduVoiceStudioStudioSettings"
        );

        if (!saved) return;

        const settings = JSON.parse(saved);

        if (languageSelect && settings.language) {
            languageSelect.value = settings.language;
        }

        if (voiceSelect && settings.voice) {
            voiceSelect.value = settings.voice;
        }

        if (speedSelect && settings.speed) {
            speedSelect.value = settings.speed;
        }

        if (formatSelect && settings.format) {
            formatSelect.value = settings.format;
        }

    } catch (error) {}
}

/* =========================================================
   BUTTON EVENTS
========================================================= */

function setupButtonEvents() {

    if (clearTextButton) {
        clearTextButton.addEventListener("click", clearText);
    }

    if (copyTextButton) {
        copyTextButton.addEventListener("click", copyText);
    }

    if (generateTextButton) {
        generateTextButton.addEventListener("click", generateText);
    }

    if (improveTextButton) {
        improveTextButton.addEventListener("click", improveText);
    }

    if (imageButton) {
        imageButton.addEventListener("click", openImageTool);
    }

    if (voiceButton) {
        voiceButton.addEventListener("click", generateVoice);
    }

    if (playAudioButton) {
        playAudioButton.addEventListener("click", playAudio);
    }

    if (pauseAudioButton) {
        pauseAudioButton.addEventListener("click", pauseAudio);
    }

    if (stopAudioButton) {
        stopAudioButton.addEventListener("click", stopAudio);
    }

    if (downloadAudioButton) {
        downloadAudioButton.addEventListener("click", downloadAudio);
    }

    if (copyResponseButton) {
        copyResponseButton.addEventListener("click", copyResponse);
    }

    if (useResponseButton) {
        useResponseButton.addEventListener("click", useResponse);
    }
}

/* =========================================================
   SETTINGS EVENTS
========================================================= */

function setupSettingsEvents() {

    if (languageSelect) {
        languageSelect.addEventListener("change", saveSettings);
    }

    if (voiceSelect) {
        voiceSelect.addEventListener("change", saveSettings);
    }

    if (speedSelect) {
        speedSelect.addEventListener("change", saveSettings);
    }

    if (formatSelect) {
        formatSelect.addEventListener("change", saveSettings);
    }
}

/* =========================================================
   TEXT EVENTS
========================================================= */

function setupTextEvents() {

    if (!studioText) return;

    studioText.addEventListener("input", updateWordCounter);

    studioText.addEventListener("keydown", function (event) {

        if (event.ctrlKey && event.key === "Enter") {
            event.preventDefault();
            generateVoice();
        }
    });
}

/* =========================================================
   PUBLIC STUDIO API
========================================================= */

function exposePublicAPI() {

    window.UrduVoiceStudio = {

        getText: getText,
        setText: setText,
        clearText: clearText,
        updateWordCounter: updateWordCounter,

        generateText: generateText,
        improveText: improveText,
        generateVoice: generateVoice,

        playAudio: playAudio,
        pauseAudio: pauseAudio,
        stopAudio: stopAudio,
        downloadAudio: downloadAudio,

        callAI: callAI,

        startMicrophone: startMicrophone,
        stopMicrophone: stopMicrophone
    };
}

/* =========================================================
   INITIALIZE STUDIO
========================================================= */

function initializeStudio() {

    getElements();

    setupButtonEvents();
    setupSettingsEvents();
    setupTextEvents();
    setupAudioEvents();
    setupMicrophoneEvents();

    updateWordCounter();
    loadSettings();
    hideResponse();

    if (intro) {

        startStudioIntro();

        setTimeout(function () {
            playIntroSound();
        }, 500);

    } else if (studioMain) {

        studioMain.style.visibility = "visible";
        studioMain.style.opacity = "1";
    }

    exposePublicAPI();

    console.log(
        "Urdu Voice Studio AI: studio.js loaded successfully."
    );
}

/* =========================================================
   DOM READY
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeStudio,
        { once: true }
    );

} else {

    initializeStudio();
}

})();
