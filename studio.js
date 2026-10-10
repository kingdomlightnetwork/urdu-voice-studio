/* =========================================================
   URDU VOICE STUDIO AI — studio.js
   Plain Urdu text + long-text speech playback
========================================================= */
(function () {
  "use strict";

  const API_BASE_URL = "http://localhost:3000";
  const AI_ENDPOINT = API_BASE_URL + "/api/ai";
  const VOICE_ENDPOINT = API_BASE_URL + "/api/voice";

  let isGenerating = false;
  let recognition = null;
  let isListening = false;
  let micBaseText = "";
  let micFinalTranscript = "";
  let micErrorMessage = "";

  let intro, studioMain, studioText, wordCounter;
  let generateTextButton, imageButton, improveTextButton, voiceButton;
  let clearTextButton, copyTextButton;
  let languageSelect, voiceSelect, speedSelect, formatSelect;
  let aiResponseSection, aiResponseBox, responseEmpty, responseContent;
  let copyResponseButton, useResponseButton;
  let audio, playAudioButton, pauseAudioButton, stopAudioButton;
  let downloadAudioButton, audioStatus;
  let startMicButton, stopMicButton, micStatus;

  let availableVoices = [];
  let currentSpeechText = "";
  let speechIsPaused = false;
  let speechChunks = [];
  let speechChunkIndex = 0;
  let speechRunId = 0;
  let generatedAudioUrl = null;
  let usingGeneratedAudio = false;

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
    aiResponseBox = document.getElementById("aiResponseBox");
    responseEmpty = document.getElementById("responseEmpty");
    responseContent = document.getElementById("responseContent");

    copyResponseButton = document.getElementById("copyResponseButton");
    useResponseButton = document.getElementById("useResponseButton");

    audio = document.getElementById("studioAudio");
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

  async function callAI(tool, text) {
    const cleanText = typeof text === "string" ? text.trim() : "";

    if (!cleanText) {
      throw new Error("براہِ کرم پہلے متن لکھیں۔");
    }

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
          language: languageSelect && languageSelect.value
            ? languageSelect.value
            : "ur-PK"
        })
      });
    } catch (_) {
      throw new Error(
        "Backend سے رابطہ نہیں ہو سکا۔ چیک کریں کہ سرور چل رہا ہے۔"
      );
    }

    let data;

    try {
      data = await response.json();
    } catch (_) {
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

  function updateWordCounter() {
    if (!studioText || !wordCounter) return;

    const text = studioText.value.trim();
    const count = text ? text.split(/\s+/).filter(Boolean).length : 0;

    wordCounter.textContent = count + " الفاظ";
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
          "network": "آواز پہچاننے کے لیے نیٹ ورک کا مسئلہ آیا۔",
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
        523.25,
        context.currentTime + 1.8
      );

      gain.gain.setValueAtTime(0.0001, context.currentTime);
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

  /* ---------------- AI TEXT ---------------- */

  async function generateText() {
    if (isGenerating) return;

    isGenerating = true;
    showMessage("AI جواب تیار کر رہا ہے۔۔۔");

    try {
      const data = await callAI(
        "default",
        getText() || "پاکستانی اردو میں ایک مختصر اور خوبصورت متن تیار کریں۔"
      );

      showMessage(data.text || "AI نے کوئی متن واپس نہیں کیا۔");
    } catch (error) {
      showMessage("AI سے رابطہ نہیں ہو سکا: " + error.message);
    } finally {
      isGenerating = false;
    }
  }

  async function improveText() {
    const text = getText();

    if (!text) {
      showMessage("متن بہتر کرنے کے لیے پہلے اپنا متن لکھیں۔");
      return;
    }

    if (isGenerating) return;

    isGenerating = true;
    showMessage("متن بہتر کیا جا رہا ہے۔۔۔");

    try {
      const data = await callAI("improve", text);
      showMessage(data.text || "AI نے کوئی جواب واپس نہیں کیا۔");
    } catch (error) {
      showMessage("متن بہتر نہیں ہو سکا: " + error.message);
    } finally {
      isGenerating = false;
    }
  }

  async function openImageTool() {
    const text = getText();

    if (!text) {
      showMessage("تصویر کے لیے پہلے اپنی ہدایت یا خیال لکھیں۔");
      if (studioText) studioText.focus();
      return;
    }

    if (isGenerating) return;

    isGenerating = true;
    showMessage("Image AI کی درخواست بھیجی جا رہی ہے۔۔۔");

    try {
      const data = await callAI("image", text);
      showMessage(data.text || "Image AI کی درخواست مکمل ہوئی۔");
    } catch (error) {
      showMessage("Image AI سے رابطہ نہیں ہو سکا: " + error.message);
    } finally {
      isGenerating = false;
    }
  }

  /* ---------------- TEXT CLEANUP FOR SPEECH ---------------- */

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

  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    availableVoices = window.speechSynthesis.getVoices() || [];
  }

  function getSpeechLanguage() {
    return languageSelect && languageSelect.value
      ? languageSelect.value
      : "ur-PK";
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

    if (!matching.length) {
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

  function revokeGeneratedAudio() {
    if (generatedAudioUrl) {
      URL.revokeObjectURL(generatedAudioUrl);
      generatedAudioUrl = null;
    }

    usingGeneratedAudio = false;
  }

  async function tryGenerateServerAudio(text, runId) {
    const response = await fetch(VOICE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: text,
        language: getSpeechLanguage(),
        voice: voiceSelect ? voiceSelect.value : "default",
        speed: speedSelect ? Number(speedSelect.value) || 1 : 1
      })
    });

    if (!response.ok) {
      throw new Error("AI audio endpoint دستیاب نہیں۔");
    }

    const type = response.headers.get("content-type") || "";

    if (!type.startsWith("audio/")) {
      throw new Error("Backend نے آڈیو فائل کے بجائے دوسرا جواب دیا۔");
    }

    if (runId !== speechRunId) return false;

    const blob = await response.blob();

    revokeGeneratedAudio();
    generatedAudioUrl = URL.createObjectURL(blob);
    usingGeneratedAudio = true;

    if (!audio) throw new Error("آڈیو پلیئر موجود نہیں۔");

    audio.src = generatedAudioUrl;
    audio.onended = function () {
      setAudioStatus("اردو آواز مکمل ہو گئی ہے۔");
    };
    audio.onerror = function () {
      setAudioStatus("آڈیو چلانے میں مسئلہ آیا۔");
    };

    await audio.play();
    setAudioStatus("AI سے تیار کردہ اردو آواز چل رہی ہے۔۔۔");

    return true;
  }

  function speakNextChunk(runId) {
    if (runId !== speechRunId) return;

    if (speechChunkIndex >= speechChunks.length) {
      speechIsPaused = false;
      setAudioStatus("اردو متن کی تلاوت مکمل ہو گئی ہے۔");
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
          "آواز چل رہی ہے۔۔۔ حصہ " +
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
      }, 120);
    };

    utterance.onerror = function (event) {
      if (runId !== speechRunId) return;

      speechIsPaused = false;

      setAudioStatus(
        "براؤزر کی آواز نہیں چل سکی (" +
        (event.error || "نامعلوم مسئلہ") +
        ")۔ اگر اردو آواز نصب نہیں تو Backend میں AI audio بھی فعال کرنا ہوگا۔"
      );
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      setAudioStatus("آواز شروع نہیں ہو سکی۔ دوبارہ کوشش کریں۔");
    }
  }

  async function generateVoice() {
    const text = cleanTextForSpeech(getText());

    if (!text) {
      setAudioStatus("پہلے متن لکھیں یا AI سے متن تیار کریں۔");
      if (studioText) studioText.focus();
      return;
    }

    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      setAudioStatus(
        "اس براؤزر میں آواز پڑھنے کی سہولت دستیاب نہیں۔ Chrome استعمال کریں۔"
      );
      return;
    }

    const runId = ++speechRunId;

    try {
      window.speechSynthesis.cancel();
    } catch (_) {}

    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_) {}
    }

    revokeGeneratedAudio();

    currentSpeechText = text;
    speechChunks = splitSpeechText(text, 230);
    speechChunkIndex = 0;
    speechIsPaused = false;

    setAudioStatus("اردو آواز تیار کی جا رہی ہے۔۔۔");

    try {
      const played = await tryGenerateServerAudio(text, runId);

      if (played || runId !== speechRunId) return;
    } catch (_) {
      // اگر /api/voice موجود نہ ہو تو براؤزر کی آواز استعمال ہوگی۔
    }

    if (runId !== speechRunId) return;

    loadVoices();

    if (!availableVoices.length) {
      setAudioStatus(
        "براؤزر کی آوازیں دستیاب نہیں ہوئیں۔ Chrome کی آواز کی سہولت چیک کریں۔"
      );
      return;
    }

    setAudioStatus("براؤزر کی آواز شروع کی جا رہی ہے۔۔۔");

    // Chrome sometimes discards speech immediately after cancel().
    setTimeout(function () {
      if (runId === speechRunId) speakNextChunk(runId);
    }, 180);
  }

  function playAudio() {
    if (usingGeneratedAudio && audio) {
      audio.play()
        .then(function () {
          setAudioStatus("اردو آواز چل رہی ہے۔۔۔");
        })
        .catch(function () {
          setAudioStatus("آواز چلانے کے لیے Play دوبارہ دبائیں۔");
        });

      return;
    }

    if (!("speechSynthesis" in window)) {
      setAudioStatus("براؤزر کی آواز کی سہولت دستیاب نہیں۔");
      return;
    }

    if (speechIsPaused) {
      window.speechSynthesis.resume();
      speechIsPaused = false;
      setAudioStatus("آواز دوبارہ چل رہی ہے۔");
      return;
    }

    if (window.speechSynthesis.speaking) {
      setAudioStatus("آواز پہلے ہی چل رہی ہے۔");
      return;
    }

    generateVoice();
  }

  function pauseAudio() {
    if (usingGeneratedAudio && audio && !audio.paused) {
      audio.pause();
      setAudioStatus("آواز روک دی گئی ہے۔");
      return;
    }

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

    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_) {}
    }

    setAudioStatus("آواز بند کر دی گئی ہے۔");
  }

  function downloadAudio() {
    if (usingGeneratedAudio && generatedAudioUrl) {
      const link = document.createElement("a");
      link.href = generatedAudioUrl;

      link.download =
        formatSelect && formatSelect.value === "wav"
          ? "urdu-voice.wav"
          : "urdu-voice.mp3";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setAudioStatus("آڈیو ڈاؤن لوڈ شروع ہو گیا ہے۔");
      return;
    }

    setAudioStatus(
      "ابھی براؤزر کی آواز چل رہی ہے، یہ MP3/WAV فائل نہیں ہے۔ حقیقی ڈاؤن لوڈ کے لیے Backend میں AI audio endpoint شامل کرنا ضروری ہے۔"
    );
  }

  /* ---------------- RESPONSE ACTIONS ---------------- */

  async function copyResponse() {
    if (!responseContent) return;

    const text = responseContent.textContent.trim();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      showMessage("AI جواب کامیابی سے کاپی ہو گیا ہے۔");
    } catch (_) {
      showMessage("AI جواب کاپی نہیں ہو سکا۔");
    }
  }

  function useResponse() {
    if (!responseContent) return;

    const text = responseContent.textContent.trim();
    if (!text) return;

    setText(text);

    if (studioText) studioText.focus();

    setAudioStatus("AI جواب متن والے خانے میں منتقل ہو گیا ہے۔");
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

  function setupSettingsEvents() {
    [
      languageSelect,
      voiceSelect,
      speedSelect,
      formatSelect
    ].forEach(function (element) {
      if (element) {
        element.addEventListener("change", saveSettings);
      }
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
      callAI,
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

    console.log(
      "Urdu Voice Studio AI: studio.js loaded successfully."
    );
  }

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
