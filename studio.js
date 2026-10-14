
/* =========================================================
   URDU VOICE STUDIO AI
   Local Piper TTS + Audio Player + WAV Download
========================================================= */

(function () {
  "use strict";

  const TTS_ENDPOINT = "/api/tts";
  const AI_ENDPOINT = "/api/ai";

  let studioText;
  let wordCounter;
  let voiceButton;
  let playAudioButton;
  let pauseAudioButton;
  let stopAudioButton;
  let downloadAudioButton;
  let audio;
  let audioStatus;
  let languageSelect;
  let voiceSelect;
  let speedSelect;
  let formatSelect;
  let aiResponseSection;
  let responseEmpty;
  let responseContent;
  let copyResponseButton;
  let useResponseButton;
  let clearTextButton;
  let copyTextButton;
  let generateTextButton;
  let improveTextButton;
  let imageButton;
  let startMicButton;
  let stopMicButton;
  let micStatus;
  let intro;
  let studioMain;

  let generatedBlob = null;
  let generatedUrl = null;
  let isGenerating = false;
  let recognition = null;
  let isListening = false;
  let requestNumber = 0;

  function getElements() {
    studioText = document.getElementById("studioText");
    wordCounter = document.getElementById("wordCounter");

    voiceButton = document.getElementById("voiceButton");
    playAudioButton = document.getElementById("playAudioButton");
    pauseAudioButton = document.getElementById("pauseAudioButton");
    stopAudioButton = document.getElementById("stopAudioButton");
    downloadAudioButton = document.getElementById("downloadAudioButton");
    audio = document.getElementById("studioAudio");
    audioStatus = document.getElementById("audioStatus");

    languageSelect = document.getElementById("languageSelect");
    voiceSelect = document.getElementById("voiceSelect");
    speedSelect = document.getElementById("speedSelect");
    formatSelect = document.getElementById("formatSelect");

    aiResponseSection = document.getElementById("aiResponseSection");
    responseEmpty = document.getElementById("responseEmpty");
    responseContent = document.getElementById("responseContent");

    copyResponseButton = document.getElementById("copyResponseButton");
    useResponseButton = document.getElementById("useResponseButton");
    clearTextButton = document.getElementById("clearTextButton");
    copyTextButton = document.getElementById("copyTextButton");
    generateTextButton = document.getElementById("generateTextButton");
    improveTextButton = document.getElementById("improveTextButton");
    imageButton = document.getElementById("imageButton");

    startMicButton = document.getElementById("startMicButton");
    stopMicButton = document.getElementById("stopMicButton");
    micStatus = document.getElementById("micStatus");

    intro = document.getElementById("studioIntro");
    studioMain = document.getElementById("studioMain");
  }

  function getText() {
    return studioText ? studioText.value.trim() : "";
  }

  function setText(value) {
    if (!studioText) return;
    studioText.value = value || "";
    updateWordCounter();
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
    const count = text
      ? text.split(/\s+/).filter(Boolean).length
      : 0;

    wordCounter.textContent = count + " الفاظ";
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
      .replace(/[ \t]+/g, " ")
      .trim();
  }

  function revokeGeneratedAudio() {
    if (generatedUrl) {
      URL.revokeObjectURL(generatedUrl);
      generatedUrl = null;
    }

    generatedBlob = null;
  }

  /* ---------------- PIPER TEXT TO SPEECH ---------------- */

  async function generateVoice() {
    if (isGenerating) return;

    const text = cleanTextForSpeech(getText());

    if (!text) {
      setAudioStatus("پہلے متن لکھیں یا پیسٹ کریں۔");
      if (studioText) studioText.focus();
      return;
    }

    if (text.length > 10000) {
      setAudioStatus(
        "اس وقت ایک درخواست میں زیادہ سے زیادہ 10000 حروف استعمال کریں۔"
      );
      return;
    }

    if (!audio) {
      setAudioStatus("آڈیو پلیئر نہیں ملا۔ studio.html چیک کریں۔");
      return;
    }

    isGenerating = true;
    const currentRequest = ++requestNumber;

    if (voiceButton) voiceButton.disabled = true;
    setAudioStatus("Piper AI آواز تیار کر رہا ہے، براہِ کرم انتظار کریں۔۔۔");

    try {
      audio.pause();

      const response = await fetch(TTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text
        })
      });

      if (currentRequest !== requestNumber) return;

      if (!response.ok) {
        let errorMessage = "آواز تیار نہیں ہو سکی۔";

        try {
          const data = await response.json();
          if (data && data.error) {
            errorMessage = data.error;
          }
        } catch (_) {
          // سرور نے JSON جواب نہ دیا ہو تو عمومی پیغام دکھائیں۔
        }

        throw new Error(errorMessage);
      }

      const contentType =
        (response.headers.get("content-type") || "").toLowerCase();

      if (!contentType.includes("audio/")) {
        throw new Error("سرور سے آڈیو فائل موصول نہیں ہوئی۔");
      }

      const blob = await response.blob();

      if (!blob.size) {
        throw new Error("تیار شدہ آڈیو فائل خالی ہے۔");
      }

      if (currentRequest !== requestNumber) return;

      revokeGeneratedAudio();

      generatedBlob = blob;
      generatedUrl = URL.createObjectURL(blob);

      audio.src = generatedUrl;
      audio.load();

      try {
        await audio.play();
        setAudioStatus("اردو آواز تیار ہے اور چل رہی ہے۔");
      } catch (_) {
        setAudioStatus(
          "آواز تیار ہے۔ سننے کے لیے Play کا بٹن دبائیں۔"
        );
      }
    } catch (error) {
      if (currentRequest === requestNumber) {
        console.error("Piper TTS error:", error);

        setAudioStatus(
          "آواز تیار نہیں ہو سکی: " +
          (error.message || "نامعلوم مسئلہ")
        );
      }
    } finally {
      if (currentRequest === requestNumber) {
        isGenerating = false;
        if (voiceButton) voiceButton.disabled = false;
      }
    }
  }

  function playAudio() {
    if (!audio || !audio.src) {
      generateVoice();
      return;
    }

    audio.play()
      .then(function () {
        setAudioStatus("آڈیو چل رہی ہے۔");
      })
      .catch(function () {
        setAudioStatus("آڈیو چلانے کے لیے دوبارہ Play دبائیں۔");
      });
  }

  function pauseAudio() {
    if (!audio || !audio.src) {
      setAudioStatus("ابھی کوئی آڈیو تیار نہیں ہوئی۔");
      return;
    }

    audio.pause();
    setAudioStatus("آڈیو روک دی گئی ہے۔");
  }

  function stopAudio() {
    requestNumber++;
    isGenerating = false;

    if (voiceButton) voiceButton.disabled = false;

    if (audio) {
      audio.pause();

      try {
        audio.currentTime = 0;
      } catch (_) {}
    }

    setAudioStatus("آڈیو روک دی گئی ہے۔");
  }

  function downloadAudio() {
    if (!generatedBlob || !generatedUrl) {
      setAudioStatus("ڈاؤن لوڈ سے پہلے آواز تیار کریں۔");
      return;
    }

    const link = document.createElement("a");
    link.href = generatedUrl;
    link.download = "urdu-voice.wav";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setAudioStatus(
      "WAV آڈیو ڈاؤن لوڈ شروع ہو گیا ہے۔ MP3 کی تبدیلی ابھی شامل نہیں۔"
    );
  }

  /* ---------------- AI TEXT TOOLS ---------------- */

  async function callAI(tool, text) {
    const inputText = String(text || "").trim();

    if (!inputText) {
      throw new Error("براہِ کرم پہلے متن لکھیں۔");
    }

    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tool: tool || "default",
        text: inputText,
        language: languageSelect
          ? languageSelect.value
          : "ur-PK"
      })
    });

    let data;

    try {
      data = await response.json();
    } catch (_) {
      throw new Error("سرور کا جواب پڑھا نہیں جا سکا۔");
    }

    if (!response.ok || !data || data.ok === false) {
      throw new Error(
        data && data.error
          ? data.error
          : "AI سروس اس وقت جواب نہیں دے رہی۔"
      );
    }

    return data;
  }

  async function generateText() {
    const prompt = getText() ||
      "پاکستانی اردو میں ایک مختصر حوصلہ افزا پیغام لکھیں۔";

    showMessage("متن تیار کیا جا رہا ہے۔۔۔");

    try {
      const result = await callAI("default", prompt);
      showMessage(result.text || "AI نے کوئی متن واپس نہیں کیا۔");
    } catch (error) {
      showMessage("متن تیار نہیں ہو سکا: " + error.message);
    }
  }

  async function improveText() {
    const text = getText();

    if (!text) {
      showMessage("متن بہتر کرنے کے لیے پہلے متن لکھیں۔");
      return;
    }

    showMessage("متن بہتر کیا جا رہا ہے۔۔۔");

    try {
      const result = await callAI("improve", text);
      showMessage(result.text || "AI نے کوئی متن واپس نہیں کیا۔");
    } catch (error) {
      showMessage("متن بہتر نہیں ہو سکا: " + error.message);
    }
  }

  async function openImageTool() {
    const text = getText();

    if (!text) {
      showMessage("تصویر کے لیے پہلے اپنا خیال یا ہدایت لکھیں۔");
      return;
    }

    try {
      const result = await callAI("image", text);
      showMessage(result.text || "کوئی جواب واپس نہیں آیا۔");
    } catch (error) {
      showMessage("تصویر کی سروس: " + error.message);
    }
  }

  /* ---------------- TEXT CONTROLS ---------------- */

  function clearText() {
    stopAudio();
    setText("");
    hideResponse();

    if (studioText) studioText.focus();
  }

  async function copyText() {
    const text = getText();

    if (!text) {
      setAudioStatus("کاپی کرنے کے لیے پہلے متن لکھیں۔");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setAudioStatus("متن کاپی ہو گیا ہے۔");
    } catch (_) {
      studioText.focus();
      studioText.select();

      try {
        document.execCommand("copy");
        setAudioStatus("متن کاپی ہو گیا ہے۔");
      } catch (_) {
        setAudioStatus("متن کاپی نہیں ہو سکا۔");
      }
    }
  }

  async function copyResponse() {
    const text = responseContent
      ? responseContent.textContent.trim()
      : "";

    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      showMessage("جواب کاپی ہو گیا ہے۔");
    } catch (_) {
      showMessage("جواب کاپی نہیں ہو سکا۔");
    }
  }

  function useResponse() {
    const text = responseContent
      ? responseContent.textContent.trim()
      : "";

    if (!text) return;

    setText(text);
    if (studioText) studioText.focus();

    setAudioStatus("تیار کردہ متن، متن والے خانے میں منتقل ہو گیا ہے۔");
  }

  /* ---------------- MICROPHONE ---------------- */

  function startMicrophone() {
    if (isListening || !studioText) return;

    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setMicStatus(
        "اس Chrome میں آواز سے متن لکھنے کی سہولت دستیاب نہیں۔"
      );
      return;
    }

    recognition = new Recognition();
    recognition.lang = languageSelect
      ? languageSelect.value
      : "ur-PK";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
      isListening = true;
      if (startMicButton) startMicButton.disabled = true;
      if (stopMicButton) stopMicButton.disabled = false;
      setMicStatus("مائیکروفون چل رہا ہے، اب بولیں۔۔۔");
    };

    recognition.onresult = function (event) {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      studioText.value = transcript.trim();
      updateWordCounter();
      setMicStatus("آپ کی آواز متن میں تبدیل ہو رہی ہے۔۔۔");
    };

    recognition.onerror = function (event) {
      setMicStatus("مائیکروفون کا مسئلہ: " + event.error);
    };

    recognition.onend = function () {
      isListening = false;

      if (startMicButton) startMicButton.disabled = false;
      if (stopMicButton) stopMicButton.disabled = true;

      if (recognition) recognition = null;

      setMicStatus("مائیکروفون بند ہے۔");
    };

    try {
      recognition.start();
    } catch (_) {
      setMicStatus("مائیکروفون شروع نہیں ہو سکا۔");
    }
  }

  function stopMicrophone() {
    if (!recognition) {
      setMicStatus("مائیکروفون پہلے ہی بند ہے۔");
      return;
    }

    try {
      recognition.stop();
    } catch (_) {
      setMicStatus("مائیکروفون بند نہیں ہو سکا۔");
    }
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
          format: formatSelect ? formatSelect.value : "wav"
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

  /* ---------------- EVENTS ---------------- */

  function setupEvents() {
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

    if (copyResponseButton) {
      copyResponseButton.addEventListener("click", copyResponse);
    }

    if (useResponseButton) {
      useResponseButton.addEventListener("click", useResponse);
    }

    if (startMicButton) {
      startMicButton.addEventListener("click", startMicrophone);
    }

    if (stopMicButton) {
      stopMicButton.addEventListener("click", stopMicrophone);
      stopMicButton.disabled = true;
    }

    if (studioText) {
      studioText.addEventListener("input", updateWordCounter);

      studioText.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.key === "Enter") {
          event.preventDefault();
          generateVoice();
        }
      });
    }

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

    if (audio) {
      audio.addEventListener("ended", function () {
        setAudioStatus("آڈیو مکمل ہو گئی ہے۔");
      });

      audio.addEventListener("error", function () {
        setAudioStatus("آڈیو پلیئر فائل نہیں چلا سکا۔");
      });
    }
  }

  function exposePublicAPI() {
    window.UrduVoiceStudio = {
      getText: getText,
      setText: setText,
      updateWordCounter: updateWordCounter,
      generateVoice: generateVoice,
      playAudio: playAudio,
      pauseAudio: pauseAudio,
      stopAudio: stopAudio,
      downloadAudio: downloadAudio,
      callAI: callAI,
      cleanTextForSpeech: cleanTextForSpeech
    };
  }

  function initializeStudio() {
    getElements();
    loadSettings();
    setupEvents();
    updateWordCounter();
    hideResponse();
    startStudioIntro();
    exposePublicAPI();

    console.log("Urdu Voice Studio AI: Piper TTS mode loaded.");
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
