"use strict";

/* =========================================================
   URDU VOICE STUDIO
   SETTINGS
   ========================================================= */


/* =========================================================
   DEFAULT SETTINGS
   ========================================================= */

const UrduVoiceSettings = {

    /* Language */

    language: "ur-PK",


    /* Voice */

    voice: "pakistani-urdu",


    /* Speech speed */

    speed: 1.0,


    /* Volume */

    volume: 1.0,


    /* Audio format */

    format: "mp3",


    /* Audio quality */

    quality: "high",


    /* Theme */

    theme: "dark",


    /* Maximum text length for one processing request */

    chunkSize: 2500,


    /* Automatically process long text */

    autoChunk: true,


    /* Automatically join generated audio */

    autoMerge: true

};


/* =========================================================
   SETTINGS MANAGER
   ========================================================= */

const UrduVoiceSettingsManager = {


    /* =====================================================
       GET ALL SETTINGS
       ===================================================== */

    getAll() {

        return {
            ...UrduVoiceSettings
        };

    },


    /* =====================================================
       GET ONE SETTING
       ===================================================== */

    get(key) {

        if (
            !Object.prototype.hasOwnProperty.call(
                UrduVoiceSettings,
                key
            )
        ) {
            return null;
        }

        return UrduVoiceSettings[key];

    },


    /* =====================================================
       SET ONE SETTING
       ===================================================== */

    set(key, value) {

        if (
            !Object.prototype.hasOwnProperty.call(
                UrduVoiceSettings,
                key
            )
        ) {
            return false;
        }

        UrduVoiceSettings[key] = value;

        this.save();

        return true;

    },


    /* =====================================================
       SET SPEED
       ===================================================== */

    setSpeed(speed) {

        let value = Number(speed);

        if (Number.isNaN(value)) {
            return false;
        }

        value = Math.max(
            0.5,
            Math.min(2.0, value)
        );

        UrduVoiceSettings.speed = value;

        this.save();

        return value;

    },


    /* =====================================================
       SET VOLUME
       ===================================================== */

    setVolume(volume) {

        let value = Number(volume);

        if (Number.isNaN(value)) {
            return false;
        }

        value = Math.max(
            0,
            Math.min(1, value)
        );

        UrduVoiceSettings.volume = value;

        this.save();

        return value;

    },


    /* =====================================================
       SET VOICE
       ===================================================== */

    setVoice(voice) {

        if (
            typeof voice !== "string" ||
            !voice.trim()
        ) {
            return false;
        }

        UrduVoiceSettings.voice =
            voice.trim();

        this.save();

        return true;

    },


    /* =====================================================
       SET FORMAT
       ===================================================== */

    setFormat(format) {

        if (
            typeof format !== "string" ||
            !format.trim()
        ) {
            return false;
        }

        UrduVoiceSettings.format =
            format.trim().toLowerCase();

        this.save();

        return true;

    },


    /* =====================================================
       SAVE SETTINGS
       ===================================================== */

    save() {

        try {

            localStorage.setItem(
                "urduVoiceStudioSettings",
                JSON.stringify(
                    UrduVoiceSettings
                )
            );

            return true;

        } catch (error) {

            return false;

        }

    },


    /* =====================================================
       LOAD SETTINGS
       ===================================================== */

    load() {

        try {

            const saved =
                localStorage.getItem(
                    "urduVoiceStudioSettings"
                );


            if (!saved) {
                return this.getAll();
            }


            const parsed =
                JSON.parse(saved);


            if (
                parsed &&
                typeof parsed === "object"
            ) {

                Object.keys(
                    UrduVoiceSettings
                ).forEach(
                    (key) => {

                        if (
                            Object.prototype.hasOwnProperty.call(
                                parsed,
                                key
                            )
                        ) {

                            UrduVoiceSettings[key] =
                                parsed[key];

                        }

                    }
                );

            }


            return this.getAll();

        } catch (error) {

            return this.getAll();

        }

    },


    /* =====================================================
       RESET SETTINGS
       ===================================================== */

    reset() {

        UrduVoiceSettings.language =
            "ur-PK";

        UrduVoiceSettings.voice =
            "pakistani-urdu";

        UrduVoiceSettings.speed =
            1.0;

        UrduVoiceSettings.volume =
            1.0;

        UrduVoiceSettings.format =
            "mp3";

        UrduVoiceSettings.quality =
            "high";

        UrduVoiceSettings.theme =
            "dark";

        UrduVoiceSettings.chunkSize =
            2500;

        UrduVoiceSettings.autoChunk =
            true;

        UrduVoiceSettings.autoMerge =
            true;


        this.save();

        return this.getAll();

    }

};


/* =========================================================
   LOAD SAVED SETTINGS
   ========================================================= */

UrduVoiceSettingsManager.load();


/* =========================================================
   GLOBAL ACCESS
   ========================================================= */

window.UrduVoiceSettings =
    UrduVoiceSettings;

window.UrduVoiceSettingsManager =
    UrduVoiceSettingsManager;


/* =========================================================
   SETTINGS READY EVENT
   ========================================================= */

document.dispatchEvent(
    new CustomEvent(
        "urduVoiceSettingsReady",
        {
            detail:
                UrduVoiceSettingsManager.getAll()
        }
    )
);
