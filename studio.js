
/* =========================================================
   URDU VOICE STUDIO AI
   studio.js
   Studio Front-End Controller
   ========================================================= */

(function () {
    "use strict";

    /* =========================================================
       ELEMENTS
       ========================================================= */

    const intro = document.getElementById("studioIntro");
    const studioMain = document.getElementById("studioMain");

    const studioText = document.getElementById("studioText");
    const wordCounter = document.getElementById("wordCounter");

    const generateTextButton =
        document.getElementById("generateTextButton");

    const imageButton =
        document.getElementById("imageButton");

    const improveTextButton =
        document.getElementById("improveTextButton");

    const voiceButton =
        document.getElementById("voiceButton");

    const clearTextButton =
        document.getElementById("clearTextButton");

    const copyTextButton =
        document.getElementById("copyTextButton");

    const languageSelect =
        document.getElementById("languageSelect");

    const voiceSelect =
        document.getElementById("voiceSelect");

    const speedSelect =
        document.getElementById("speedSelect");

    const formatSelect =
        document.getElementById("formatSelect");

    const aiResponseSection =
        document.getElementById("aiResponseSection");

    const aiResponseBox =
        document.getElementById("aiResponseBox");

    const responseEmpty =
        document.getElementById("responseEmpty");

    const responseContent =
        document.getElementById("responseContent");

    const copyResponseButton =
        document.getElementById("copyResponseButton");

    const useResponseButton =
        document.getElementById("useResponseButton");

    const audio =
        document.getElementById("studioAudio");

    const playAudioButton =
        document.getElementById("playAudioButton");

    const pauseAudioButton =
        document.getElementById("pauseAudioButton");

    const stopAudioButton =
        document.getElementById("stopAudioButton");

    const downloadAudioButton =
        document.getElementById("downloadAudioButton");

    const audioStatus =
        document.getElementById("audioStatus");


    /* =========================================================
       BASIC STATE
       ========================================================= */

    let currentAudioUrl = "";
    let isGenerating = false;


    /* =========================================================
       HELPER
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
            responseContent.textContent = message;
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

        const words = text
            .split(/\s+/)
            .filter(Boolean);

        wordCounter.textContent =
            words.length + " الفاظ";
    }


    if (studioText) {
        studioText.addEventListener(
            "input",
            updateWordCounter
        );
    }


    /* =========================================================
       INTRO
       ========================================================= */

    function startStudioIntro() {

        if (!intro) return;

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

        /*
         Browser autoplay policies may block audio.
         Therefore we do not force audio playback.
         Later we can connect a proper studio intro sound.
        */

        try {

            const audioContext =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!audioContext) return;

            const context = new audioContext();

            if (context.state === "suspended") {
                context.resume().catch(function () {});
            }

            const oscillator =
                context.createOscillator();

            const gain =
                context.createGain();

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

            oscillator.stop(
                context.currentTime + 2.2
            );

            setTimeout(function () {

                try {
                    context.close();
                } catch (error) {}

            }, 2500);

        } catch (error) {
            /*
             Sound is optional.
             Never stop Studio because sound is blocked.
            */
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

            /*
             Fallback for browsers where Clipboard API
             is unavailable.
            */

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
       AI TEXT BUTTON
       ========================================================= */

    function generateText() {

        /*
         Real AI backend will be connected later.
         For now we keep the interface functional.
        */

        showMessage(
            "اردو AI معاون اگلے مرحلے میں شامل کیا جائے گا۔"
        );
    }


    /* =========================================================
       IMPROVE TEXT
       ========================================================= */

    function improveText() {

        const text = getText();

        if (!text) {

            showMessage(
                "متن بہتر کرنے کے لیے پہلے اپنا متن لکھیں۔"
            );

            return;
        }

        showMessage(
            "متن بہتر کرنے والا AI اگلے مرحلے میں شامل کیا جائے گا۔"
        );
    }


    /* =========================================================
       IMAGE GENERATOR
       ========================================================= */

    function openImageTool() {

        showMessage(
            "تصویر بنانے والا AI اگلے مرحلے میں شامل کیا جائے گا۔"
        );
    }


    /* =========================================================
       VOICE GENERATION
       ========================================================= */

    function generateVoice() {

        const text = getText();

        if (!text) {

            setAudioStatus(
                "پہلے اردو متن لکھیں۔"
            );

            if (studioText) {
                studioText.focus();
            }

            return;
        }

        if (isGenerating) return;

        isGenerating = true;

        setAudioStatus(
            "آواز تیار کرنے کی تیاری ہو رہی ہے۔۔۔"
        );

        /*
         ======================================================
         TEMPORARY DEMO
         ======================================================

         Actual AI TTS server will be connected later.

         We deliberately do not pretend that a real MP3
         has been generated.
        */

        setTimeout(function () {

            isGenerating = false;

            setAudioStatus(
                "اصل AI آواز کا نظام اگلے مرحلے میں شامل کیا جائے گا۔"
            );

        }, 700);
    }


    /* =========================================================
       AUDIO STATUS
       ========================================================= */

    function setAudioStatus(message) {

        if (!audioStatus) return;

        audioStatus.textContent = message;
    }


    /* =========================================================
       AUDIO CONTROLS
       ========================================================= */

    function playAudio() {

        if (!audio) {

            setAudioStatus(
                "آڈیو پلیئر دستیاب نہیں ہے۔"
            );

            return;
        }

        if (!audio.src) {

            setAudioStatus(
                "ابھی کوئی آڈیو موجود نہیں۔ پہلے آواز بنائیں۔"
            );

            return;
        }

        audio.play().catch(function () {

            setAudioStatus(
                "آڈیو چلانے میں مسئلہ آیا۔"
            );

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

        const link =
            document.createElement("a");

        link.href = audio.src;

        link.download =
            formatSelect &&
            formatSelect.value === "wav"
                ? "urdu-voice-studio.wav"
                : "urdu-voice-studio.mp3";

        document.body.appendChild(link);

        link.click();

        link.remove();
    }


    /* =========================================================
       AUDIO EVENTS
       ========================================================= */

    if (audio) {

        audio.addEventListener(
            "play",
            function () {
                setAudioStatus("آڈیو چل رہی ہے۔۔۔");
            }
        );

        audio.addEventListener(
            "pause",
            function () {

                if (
                    audio.currentTime > 0 &&
                    audio.currentTime < audio.duration
                ) {
                    setAudioStatus("آڈیو روک دی گئی ہے۔");
                }
            }
        );

        audio.addEventListener(
            "ended",
            function () {
                setAudioStatus("آڈیو مکمل ہو گئی ہے۔");
            }
        );

        audio.addEventListener(
            "error",
            function () {
                setAudioStatus(
                    "آڈیو فائل چلانے میں مسئلہ آیا۔"
                );
            }
        );
    }


    /* =========================================================
       RESPONSE ACTIONS
       ========================================================= */

    async function copyResponse() {

        if (!responseContent) return;

        const text =
            responseContent.textContent.trim();

        if (!text) return;

        try {

            await navigator.clipboard.writeText(text);

            setAudioStatus(
                "AI جواب کامیابی سے کاپی ہو گیا ہے۔"
            );

        } catch (error) {

            setAudioStatus(
                "AI جواب کاپی نہیں ہو سکا۔"
            );
        }
    }


    function useResponse() {

        if (!responseContent) return;

        const text =
            responseContent.textContent.trim();

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

        } catch (error) {
            /*
             Settings are optional.
            */
        }
    }


    function loadSettings() {

        try {

            const saved =
                localStorage.getItem(
                    "urduVoiceStudioStudioSettings"
                );

            if (!saved) return;

            const settings =
                JSON.parse(saved);

            if (
                languageSelect &&
                settings.language
            ) {
                languageSelect.value =
                    settings.language;
            }

            if (
                voiceSelect &&
                settings.voice
            ) {
                voiceSelect.value =
                    settings.voice;
            }

            if (
                speedSelect &&
                settings.speed
            ) {
                speedSelect.value =
                    settings.speed;
            }

            if (
                formatSelect &&
                settings.format
            ) {
                formatSelect.value =
                    settings.format;
            }

        } catch (error) {
            /*
             Ignore corrupted local settings.
            */
        }
    }


    if (languageSelect) {
        languageSelect.addEventListener(
            "change",
            saveSettings
        );
    }

    if (voiceSelect) {
        voiceSelect.addEventListener(
            "change",
            saveSettings
        );
    }

    if (speedSelect) {
        speedSelect.addEventListener(
            "change",
            saveSettings
        );
    }

    if (formatSelect) {
        formatSelect.addEventListener(
            "change",
            saveSettings
        );
    }


    /* =========================================================
       BUTTON EVENTS
       ========================================================= */

    if (clearTextButton) {
        clearTextButton.addEventListener(
            "click",
            clearText
        );
    }


    if (copyTextButton) {
        copyTextButton.addEventListener(
            "click",
            copyText
        );
    }


    if (generateTextButton) {
        generateTextButton.addEventListener(
            "click",
            generateText
        );
    }


    if (improveTextButton) {
        improveTextButton.addEventListener(
            "click",
            improveText
        );
    }


    if (imageButton) {
        imageButton.addEventListener(
            "click",
            openImageTool
        );
    }


    if (voiceButton) {
        voiceButton.addEventListener(
            "click",
            generateVoice
        );
    }


    if (playAudioButton) {
        playAudioButton.addEventListener(
            "click",
            playAudio
        );
    }


    if (pauseAudioButton) {
        pauseAudioButton.addEventListener(
            "click",
            pauseAudio
        );
    }


    if (stopAudioButton) {
        stopAudioButton.addEventListener(
            "click",
            stopAudio
        );
    }


    if (downloadAudioButton) {
        downloadAudioButton.addEventListener(
            "click",
            downloadAudio
        );
    }


    if (copyResponseButton) {
        copyResponseButton.addEventListener(
            "click",
            copyResponse
        );
    }


    if (useResponseButton) {
        useResponseButton.addEventListener(
            "click",
            useResponse
        );
    }


    /* =========================================================
       KEYBOARD SHORTCUTS
       ========================================================= */

    if (studioText) {

        studioText.addEventListener(
            "keydown",
            function (event) {

                /*
                 Ctrl + Enter = Generate Voice
                */

                if (
                    event.ctrlKey &&
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    generateVoice();
                }
            }
        );
    }


    /* =========================================================
       PUBLIC STUDIO API
       ========================================================= */

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

        downloadAudio: downloadAudio
    };


    /* =========================================================
       INITIALIZE
       ========================================================= */

    function initializeStudio() {

        updateWordCounter();

        loadSettings();

        hideResponse();

        /*
         Start intro only when the intro element exists.
        */

        if (intro) {

            startStudioIntro();

            /*
             Try a very soft intro sound.
             Browser may block it, which is completely okay.
            */

            setTimeout(function () {
                playIntroSound();
            }, 500);
        }

        /*
         Keep main interface available even if intro
         fails for any reason.
        */

        if (!intro && studioMain) {

            studioMain.style.visibility =
                "visible";

            studioMain.style.opacity =
                "1";
        }
    }


    /* =========================================================
       DOM READY
       ========================================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeStudio
        );

    } else {

        initializeStudio();
    }


})();
