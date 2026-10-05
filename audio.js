"use strict";

/* =========================================================
   URDU VOICE STUDIO
   AUDIO CONTROLLER
   ========================================================= */


/* =========================================================
   AUDIO STATE
   ========================================================= */

const UrduVoiceAudio = {

    audio: null,

    isPlaying: false,

    currentText: "",

    currentSource: null,


    /* =====================================================
       SET AUDIO SOURCE
       ===================================================== */

    setSource(source) {

        if (!source) {
            return false;
        }

        this.stop();

        this.currentSource = source;

        this.audio = new Audio(source);

        this.attachEvents();

        return true;
    },


    /* =====================================================
       AUDIO EVENTS
       ===================================================== */

    attachEvents() {

        if (!this.audio) {
            return;
        }


        this.audio.addEventListener(
            "play",
            () => {

                this.isPlaying = true;

                this.updateStatus("playing");

            }
        );


        this.audio.addEventListener(
            "pause",
            () => {

                this.isPlaying = false;

                this.updateStatus("paused");

            }
        );


        this.audio.addEventListener(
            "ended",
            () => {

                this.isPlaying = false;

                this.updateStatus("ended");

            }
        );


        this.audio.addEventListener(
            "error",
            () => {

                this.isPlaying = false;

                this.updateStatus("error");

            }
        );

    },


    /* =====================================================
       PLAY
       ===================================================== */

    play() {

        if (!this.audio) {

            this.updateStatus("no-audio");

            return false;
        }

        const result = this.audio.play();

        if (result && typeof result.catch === "function") {

            result.catch(() => {

                this.isPlaying = false;

                this.updateStatus("error");

            });

        }

        return true;
    },


    /* =====================================================
       PAUSE
       ===================================================== */

    pause() {

        if (!this.audio) {
            return false;
        }

        this.audio.pause();

        return true;
    },


    /* =====================================================
       STOP
       ===================================================== */

    stop() {

        if (!this.audio) {
            return false;
        }

        this.audio.pause();

        this.audio.currentTime = 0;

        this.isPlaying = false;

        this.updateStatus("stopped");

        return true;
    },


    /* =====================================================
       RESTART
       ===================================================== */

    restart() {

        if (!this.audio) {
            return false;
        }

        this.audio.currentTime = 0;

        return this.play();
    },


    /* =====================================================
       SET VOLUME
       ===================================================== */

    setVolume(volume) {

        if (!this.audio) {
            return false;
        }

        let value = Number(volume);

        if (Number.isNaN(value)) {
            return false;
        }

        value = Math.max(
            0,
            Math.min(1, value)
        );

        this.audio.volume = value;

        return true;
    },


    /* =====================================================
       SET PLAYBACK SPEED
       ===================================================== */

    setSpeed(speed) {

        if (!this.audio) {
            return false;
        }

        let value = Number(speed);

        if (Number.isNaN(value)) {
            return false;
        }

        value = Math.max(
            0.5,
            Math.min(2, value)
        );

        this.audio.playbackRate = value;

        return true;
    },


    /* =====================================================
       GET CURRENT TIME
       ===================================================== */

    getCurrentTime() {

        if (!this.audio) {
            return 0;
        }

        return this.audio.currentTime || 0;
    },


    /* =====================================================
       GET DURATION
       ===================================================== */

    getDuration() {

        if (!this.audio) {
            return 0;
        }

        if (!Number.isFinite(this.audio.duration)) {
            return 0;
        }

        return this.audio.duration;
    },


    /* =====================================================
       DOWNLOAD AUDIO
       ===================================================== */

    download(filename = "urdu-voice.mp3") {

        if (!this.currentSource) {

            this.updateStatus("no-audio");

            return false;
        }


        const link =
            document.createElement("a");

        link.href =
            this.currentSource;

        link.download =
            filename;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        return true;
    },


    /* =====================================================
       STORE TEXT
       ===================================================== */

    setText(text) {

        this.currentText =
            typeof text === "string"
                ? text
                : "";

        return this.currentText;

    },


    /* =====================================================
       GET TEXT
       ===================================================== */

    getText() {

        return this.currentText;

    },


    /* =====================================================
       CLEAR AUDIO
       ===================================================== */

    clear() {

        this.stop();

        this.audio = null;

        this.currentSource = null;

        this.currentText = "";

        this.updateStatus("cleared");

    },


    /* =====================================================
       STATUS EVENT
       ===================================================== */

    updateStatus(status) {

        const event =
            new CustomEvent(
                "urduVoiceAudioStatus",
                {
                    detail: {
                        status: status,
                        playing: this.isPlaying
                    }
                }
            );

        document.dispatchEvent(event);

    }

};


/* =========================================================
   GLOBAL ACCESS
   ========================================================= */

window.UrduVoiceAudio =
    UrduVoiceAudio;


/* =========================================================
   AUDIO STATUS LISTENER
   ========================================================= */

document.addEventListener(
    "urduVoiceAudioStatus",
    function (event) {

        /*
         * Future Voice Studio interface will use
         * this event to update Play, Pause and Stop
         * buttons automatically.
         */

        if (!event || !event.detail) {
            return;
        }

        /*
         * Status is intentionally kept silent for now.
         * The visual dashboard will be connected later.
         */

    }
);
