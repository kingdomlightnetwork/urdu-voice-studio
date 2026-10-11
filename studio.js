
/* =========================================================
   URDU VOICE STUDIO AI — studio.js
   Free Browser Speech + Text Tools + Microphone
========================================================= */
(function () {
  "use strict";

  let recognition = null;
  let isListening = false;
  let micBaseText = "";
  let micFinalTranscript = "";
  let micErrorMessage = "";

  let intro, studioMain, studioText, wordCounter;
  let generateTextButton, imageButton, improveTextButton, voiceButton;
  let clearTextButton, copyTextButton;
  let languageSelect, voiceSelect, speedSelect, formatSelect;
  let aiResponseSection, responseEmpty, responseContent;
  let copyResponseButton, useResponseButton;
  let playAudioButton, pauseAudioButton, stopAudioButton;
  let downloadAudioButton, audioStatus;
  let startMicButton, stopMicButton, micStatus;

  let availableVoices = [];
  let speechIsPaused = false;
  let speechChunks = [];
  let speechChunkIndex = 0;
  let speechRunId = 0;

  function getElements() {
    intro = document.getElementById("studioIntro");
    studioMain = document.getElementById("studioMain");
    studioText = document.getElementById("studioText");
    wordCounter = document.getElementById("wordCounter");

    generateTextButton = document.getElementById("generateTextButton");
    imageButton = document.getElementById("imageButton");
    improveTextButton = document.getElementById("improveTextButton");
    voiceButton = document.getElementById("voiceButton");
    clearTextButton = document.getElementById("clearTextButton");
    copyTextButton = document.getElementById("copyTextButton");

    languageSelect = document.getElementById("languageSelect");
    voiceSelect = document.getElementById("voiceSelect");
    speedSelect = document.getElementById("speedSelect");
    formatSelect = document.getElementById("formatSelect");

    aiResponseSection = document.getElementById("aiResponseSection");
    responseEmpty = document.getElementById("responseEmpty");
    responseContent = document.getElementById("responseContent");

    copyResponseButton = document.getElementById("copyResponseButton");
    useResponseButton = document.getElementById("useResponseButton");

    playAudioButton = document.getElementById("playAudioButton");
    pauseAudioButton = document.getElementById("pauseAudioButton");
    stopAudioButton = document.getElementById("stopAudioButton");
    downloadAudioButton = document.getElementById("downloadAudioButton");
    audioStatus = document.getElementById("audioStatus");

    startMicButton = document.getElementById("startMicButton");
    stopMicButton = document.getElementById("stopMicButton");
    micStatus = document.getElementById("micStatus");
  }

  function getText() {
    return studioText ? studioText.value.trim() : "";
  }

  function setText(text) {
    if (!studioText) return;
    studioText.value = text || "";
    updateWordCounter();
  }

  function showMessage(message) {
    if (aiResponseSection) aiResponseSection.hidden = false;
    if (responseEmpty) responseEmpty.hidden = true;
    if (responseContent) {
      responseContent.hidden = false;
      responseContent.textContent = message || "";
    }
  }

  function hideResponse() {
    if (aiResponseSection) aiResponseSection.hidden = true;
    if (responseEmpty) responseEmpty.hidden = false;
    if (responseContent) {
      responseContent.hidden = true;
      responseContent.textContent = "";
    }
  }

  function setAudioStatus(message) {
    if (audioStatus) audioStatus.textContent = message || "";
  }

  function setMicStatus(message) {
    if (micStatus) micStatus.textContent = message || "";
  }

  function updateWordCounter() {
    if (!studioText || !wordCounter) return;
    const text = studioText.value.trim();
    const count = text ? text.split(/\s+/).filter(Boolean).length : 0;
    wordCounter.textContent = count + " الفاظ";
  }

  function getSpeechLanguage() {
    return languageSelect && languageSelect.value
      ? languageSelect.value
      : "ur-PK";
  }

  /* ---------------- MICROPHONE ---------------- */

  function updateMicButtons() {
    if (startMicButton) startMicButton.disabled = isListening;
    if (stopMicButton) stopMicButton.disabled = !isListening;
  }

  function startMicrophone() {
    if (!studioText || isListening) return;

    const RecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!RecognitionAPI) {
      setMicStatus(
        "اس براؤزر میں آواز سے متن لکھنے کی سہولت دستیاب نہیں۔ Chrome استعمال کریں۔"
      );
      return;
    }

    try {
      recognition = new RecognitionAPI();
      recognition.lang = getSpeechLanguage();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      micBaseText = studioText.value.trim();
      micFinalTranscript = "";
      micErrorMessage = "";

      recognition.onstart = function () {
        isListening = true;
        updateMicButtons();
        setMicStatus("مائیکروفون چل رہا ہے۔ اب بولیں۔۔۔");
      };

      recognition.onresult = function (event) {
        let interim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const spoken = result[0].transcript.trim();

          if (result.isFinal) {
            micFinalTranscript +=
              (micFinalTranscript ? " " : "") + spoken;
          } else {
            interim += spoken;
          }
        }

        studioText.value = [
          micBaseText,
          micFinalTranscript.trim(),
          interim.trim()
        ].filter(Boolean).join(" ").trim();

        updateWordCounter();
        setMicStatus("آپ کی آواز متن میں تبدیل ہو رہی ہے۔۔۔");
      };

      recognition.onerror = function (event) {
        const messages = {
          "no-speech": "کوئی آواز سنائی نہیں دی۔",
          "audio-capture": "مائیکروفون نہیں ملا۔",
          "not-allowed": "براہِ کرم مائیکروفون کی اجازت دیں۔",
          "network": "آواز پہچاننے میں نیٹ ورک کا مسئلہ آیا۔",
          "language-not-supported": "یہ زبان دستیاب نہیں۔"
        };

        micErrorMessage =
          messages[event.error] ||
          ("مائیکروفون کا مسئلہ: " + event.error);

        setMicStatus(micErrorMessage);
      };

      recognition.onend = function () {
        isListening = false;
        updateMicButtons();

        if (!micErrorMessage) {
          setMicStatus(
            micFinalTranscript
              ? "آواز سے متن لکھنے کا عمل مکمل ہو گیا ہے۔"
              : "مائیکروفون بند ہے۔"
          );
        }

        recognition = null;
      };

      recognition.start();
    } catch (_) {
      recognition = null;
      isListening = false;
      updateMicButtons();
      setMicStatus("مائیکروفون شروع نہیں ہو سکا۔ دوبارہ کوشش کریں۔");
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
    } catch (_) {
      isListening = false;
      updateMicButtons();
    }
  }

  /* ---------------- INTRO ---------------- */

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

  function playIntroSound() {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(392, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        523.25, context.currentTime + 1.8
      );

      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.035, context.currentTime + 0.35
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001, context.currentTime + 2.1
      );

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 2.2);

      setTimeout(function () {
        context.close().catch(function () {});
      }, 2500);
    } catch (_) {}
  }

  /* ---------------- TEXT ACTIONS ---------------- */

  function clearText() {
    stopAudio();
    setText("");
    hideResponse();
    if (studioText) studioText.focus();
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
    } catch (_) {
      studioText.focus();
      studioText.select();

      try {
        document.execCommand("copy");
        showMessage("متن کامیابی سے کاپی ہو گیا ہے۔");
      } catch (_) {
        showMessage("متن کاپی نہیں ہو سکا۔");
      }
    }
  }

  /* ---------------- TEXT TOOLS ---------------- */

  function generateText() {
    showMessage(
      "خودکار اے آئی متن بنانے کی سہولت فی الحال بند ہے۔ آپ اپنا متن خود لکھ سکتے ہیں یا تیار شدہ متن یہاں پیسٹ کر سکتے ہیں۔"
    );
  }

  function improveText() {
    if (!getText()) {
      showMessage("متن بہتر کرنے کے لیے پہلے اپنا متن لکھیں۔");
      if (studioText) studioText.focus();
      return;
    }

    showMessage(
      "خودکار اے آئی تدوین فی الحال بند ہے۔ آپ اپنا متن خود تبدیل کر سکتے ہیں۔"
    );
  }

  function openImageTool() {
    showMessage("تصویر بنانے کی اے آئی سروس فی الحال بند ہے۔");
  }

  /* ---------------- TEXT CLEANUP ---------------- */

  function cleanTextForSpeech(text) {
    return String(text || "")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/^\s*#{1,6}\s*/gm, "")
      .replace(/^\s*>\s?/gm, "")
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/gs, "$1")
      .replace(/__(.*?)__/gs, "$1")
      .replace(/\*(.*?)\*/gs, "$1")
      .replace(/_(.*?)_/gs, "$1")
      .replace(/~~(.*?)~~/gs, "$1")
      .replace(
        /\[(?=[^\]]*(?:لہجے|انداز|آواز|وقفہ|پُرسکون|پرسکون|عقیدت|پُراثر|نرمی|سنجیدگی|مختصر|آہستہ|واضح|جوش|دھیمی|تیز))[^\]]*\]/g,
        " "
      )
      .replace(/[#*_~`]/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\s*\n\s*/g, "\n")
      .trim();
  }

  /* ---------------- FREE BROWSER SPEECH ---------------- */

  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    availableVoices = window.speechSynthesis.getVoices() || [];
  }

  function chooseVoice(language) {
    loadVoices();

    const normalize = value =>
      String(value || "").toLowerCase().replace(/_/g, "-");

    const lang = normalize(language);
    let matching = availableVoices.filter(
      voice => normalize(voice.lang) === lang
    );

    if (!matching.length) {
      matching = availableVoices.filter(
        voice => normalize(voice.lang).startsWith(lang.split("-")[0])
      );
    }

    if (!matching.length && lang.startsWith("ur")) {
      matching = availableVoices.filter(
        voice => normalize(voice.lang).startsWith("ur")
      );
    }

    if (!matching.length) return null;

    const wanted = voiceSelect
      ? String(voiceSelect.value || "").toLowerCase()
      : "default";

    if (wanted.includes("female")) {
      return matching.find(
        voice => /female|zira|sara|heera|sania|uzma/i.test(voice.name)
      ) || matching[0];
    }

    if (wanted.includes("male")) {
      return matching.find(
        voice => /male|david|mark|hamza|asad/i.test(voice.name)
      ) || matching[0];
    }

    return matching[0];
  }

  function splitSpeechText(text, maxLength) {
    const max = maxLength || 230;
    const paragraphs = String(text || "")
      .split(/\n+/)
      .map(part => part.trim())
      .filter(Boolean);

    const chunks = [];

    paragraphs.forEach(function (paragraph) {
      const sentences = paragraph.match(/[^۔؟!]+[۔؟!]?/g) || [paragraph];
      let current = "";

      sentences.forEach(function (sentence) {
        const part = sentence.trim();
        if (!part) return;

        if ((current + " " + part).trim().length <= max) {
          current = (current ? current + " " : "") + part;
          return;
        }

        if (current) chunks.push(current);
        current = "";

        if (part.length <= max) {
          current = part;
        } else {
          let remaining = part;

          while (remaining.length > max) {
            let cut = remaining.lastIndexOf(" ", max);
            if (cut < Math.floor(max * 0.55)) cut = max;
            chunks.push(remaining.slice(0, cut).trim());
            remaining = remaining.slice(cut).trim();
          }

          current = remaining;
        }
      });

      if (current) chunks.push(current);
    });

    return chunks.filter(Boolean);
  }

  function speakNextChunk(runId) {
    if (runId !== speechRunId) return;

    if (speechChunkIndex >= speechChunks.length) {
      speechIsPaused = false;
      setAudioStatus("متن کی آواز مکمل ہو گئی ہے۔");
      return;
    }

    const part = speechChunks[speechChunkIndex];
    const language = getSpeechLanguage();
    const utterance = new SpeechSynthesisUtterance(part);

    utterance.lang = language;

    const voice = chooseVoice(language);
    if (voice) {
      utterance.voice = voice;
      if (voice.lang) utterance.lang = voice.lang;
    }

    const rate = speedSelect ? Number(speedSelect.value) : 1;
    utterance.rate = Number.isFinite(rate)
      ? Math.max(0.6, Math.min(1.5, rate))
      : 1;

    utterance.onstart = function () {
      if (runId === speechRunId) {
        setAudioStatus(
          "براؤزر کی آواز چل رہی ہے۔۔۔ حصہ " +
          (speechChunkIndex + 1) +
          " از " +
          speechChunks.length
        );
      }
    };

    utterance.onend = function () {
      if (runId !== speechRunId) return;

      speechChunkIndex++;

      setTimeout(function () {
        speakNextChunk(runId);
      }, 150);
    };

    utterance.onerror = function (event) {
      if (runId !== speechRunId) return;

      speechIsPaused = false;
      setAudioStatus(
        "براؤزر کی آواز نہیں چل سکی: " +
        (event.error || "نامعلوم مسئلہ") +
        "۔ دستیاب زبان کی آواز چیک کریں۔"
      );
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      setAudioStatus("آواز شروع نہیں ہو سکی۔ دوبارہ کوشش کریں۔");
    }
  }

  function generateVoice() {
    const text = cleanTextForSpeech(getText());

    if (!text) {
      setAudioStatus("پہلے متن لکھیں یا تیار شدہ متن پیسٹ کریں۔");
      if (studioText) studioText.focus();
      return;
    }

    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      setAudioStatus("اس براؤزر میں آواز بنانے کی سہولت دستیاب نہیں۔");
      return;
    }

    const runId = ++speechRunId;
    window.speechSynthesis.cancel();

    speechChunks = splitSpeechText(text, 230);
    speechChunkIndex = 0;
    speechIsPaused = false;

    loadVoices();

    if (!availableVoices.length) {
      setAudioStatus(
        "براؤزر کی آوازیں ابھی دستیاب نہیں۔ صفحہ دوبارہ کھول کر کوشش کریں۔"
      );
      return;
    }

    setAudioStatus("مفت براؤزر آواز تیار کی جا رہی ہے۔۔۔");

    setTimeout(function () {
      if (runId === speechRunId) speakNextChunk(runId);
    }, 180);
  }

  function playAudio() {
    if (speechIsPaused && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      speechIsPaused = false;
      setAudioStatus("آواز دوبارہ چل رہی ہے۔");
      return;
    }

    if (
      "speechSynthesis" in window &&
      window.speechSynthesis.speaking
    ) {
      setAudioStatus("آواز پہلے ہی چل رہی ہے۔");
      return;
    }

    generateVoice();
  }

  function pauseAudio() {
    if (
      "speechSynthesis" in window &&
      window.speechSynthesis.speaking
    ) {
      window.speechSynthesis.pause();
      speechIsPaused = true;
      setAudioStatus("آواز روک دی گئی ہے۔");
    } else {
      setAudioStatus("اس وقت کوئی آواز نہیں چل رہی۔");
    }
  }

  function stopAudio() {
    speechRunId++;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    speechIsPaused = false;
    setAudioStatus("آواز بند کر دی گئی ہے۔");
  }

  function downloadAudio() {
    setAudioStatus(
      "براؤزر کی آواز کو براہِ راست MP3 یا WAV میں محفوظ کرنے کے لیے الگ آڈیو ریکارڈنگ کا نظام درکار ہے۔"
    );
  }

  /* ---------------- RESPONSE ACTIONS ---------------- */

  async function copyResponse() {
    if (!responseContent) return;
    const text = responseContent.textContent.trim();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      showMessage("جواب کامیابی سے کاپی ہو گیا ہے۔");
    } catch (_) {
      showMessage("جواب کاپی نہیں ہو سکا۔");
    }
  }

  function useResponse() {
    if (!responseContent) return;
    const text = responseContent.textContent.trim();
    if (!text) return;

    setText(text);
    if (studioText) studioText.focus();
    setAudioStatus("جواب متن والے خانے میں منتقل ہو گیا ہے۔");
  }

  /* ---------------- SETTINGS ---------------- */

  function saveSettings() {
    try {
      localStorage.setItem(
        "urduVoiceStudioStudioSettings",
        JSON.stringify({
          language: languageSelect ? languageSelect.value : "ur-PK",
          voice: voiceSelect ? voiceSelect.value : "default",
          speed: speedSelect ? speedSelect.value : "1",
          format: formatSelect ? formatSelect.value : "mp3"
        })
      );
    } catch (_) {}
  }

  function loadSettings() {
    try {
      const saved = localStorage.getItem("urduVoiceStudioStudioSettings");
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
    } catch (_) {}
  }

  /* ---------------- EVENT SETUP ---------------- */

  function setupMicrophoneEvents() {
    if (startMicButton) {
      startMicButton.addEventListener("click", startMicrophone);
    }
    if (stopMicButton) {
      stopMicButton.addEventListener("click", stopMicrophone);
    }
    updateMicButtons();
  }

  function setupButtonEvents() {
    if (clearTextButton) clearTextButton.addEventListener("click", clearText);
    if (copyTextButton) copyTextButton.addEventListener("click", copyText);
    if (generateTextButton) generateTextButton.addEventListener("click", generateText);
    if (improveTextButton) improveTextButton.addEventListener("click", improveText);
    if (imageButton) imageButton.addEventListener("click", openImageTool);
    if (voiceButton) voiceButton.addEventListener("click", generateVoice);
    if (playAudioButton) playAudioButton.addEventListener("click", playAudio);
    if (pauseAudioButton) pauseAudioButton.addEventListener("click", pauseAudio);
    if (stopAudioButton) stopAudioButton.addEventListener("click", stopAudio);
    if (downloadAudioButton) downloadAudioButton.addEventListener("click", downloadAudio);
    if (copyResponseButton) copyResponseButton.addEventListener("click", copyResponse);
    if (useResponseButton) useResponseButton.addEventListener("click", useResponse);
  }

  function setupSettingsEvents() {
    [languageSelect, voiceSelect, speedSelect, formatSelect].forEach(function (element) {
      if (element) element.addEventListener("change", saveSettings);
    });
  }

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

  function exposePublicAPI() {
    window.UrduVoiceStudio = {
      getText,
      setText,
      clearText,
      updateWordCounter,
      generateText,
      improveText,
      generateVoice,
      playAudio,
      pauseAudio,
      stopAudio,
      downloadAudio,
      startMicrophone,
      stopMicrophone,
      cleanTextForSpeech
    };
  }

  function initializeStudio() {
    getElements();
    loadSettings();
    setupButtonEvents();
    setupSettingsEvents();
    setupTextEvents();
    setupMicrophoneEvents();
    updateWordCounter();
    hideResponse();
    loadVoices();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    if (intro) {
      startStudioIntro();
      setTimeout(playIntroSound, 500);
    } else if (studioMain) {
      studioMain.style.visibility = "visible";
      studioMain.style.opacity = "1";
    }

    exposePublicAPI();

    console.log("Urdu Voice Studio AI: free browser speech mode loaded.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeStudio, { once: true });
  } else {
    initializeStudio();
  }
})();
