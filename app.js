"use strict";

/* =========================================================
   URDU VOICE STUDIO
   Main Application JavaScript
   ========================================================= */


/* =========================================================
   GET ELEMENTS
   ========================================================= */

const googleButton = document.getElementById("googleButton");
const signupButton = document.getElementById("signupButton");
const loginLink = document.getElementById("loginLink");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");


/* =========================================================
   SMALL HELPER
   ========================================================= */

function showMessage(message) {
    window.alert(message);
}


/* =========================================================
   GOOGLE SIGN-IN
   ========================================================= */

if (googleButton) {

    googleButton.addEventListener("click", function () {

        showMessage(
            "Google Sign-In اگلے مرحلے میں فعال کیا جائے گا۔"
        );

    });

}


/* =========================================================
   SIGN UP
   ========================================================= */

if (signupButton) {

    signupButton.addEventListener("click", function () {

        const email =
            emailInput
                ? emailInput.value.trim()
                : "";

        const password =
            passwordInput
                ? passwordInput.value.trim()
                : "";


        /* Check email */

        if (!email) {

            showMessage(
                "براہِ کرم اپنا ای میل درج کریں۔"
            );

            if (emailInput) {
                emailInput.focus();
            }

            return;
        }


        /* Basic email check */

        if (
            !email.includes("@") ||
            !email.includes(".")
        ) {

            showMessage(
                "براہِ کرم درست ای میل ایڈریس درج کریں۔"
            );

            if (emailInput) {
                emailInput.focus();
            }

            return;
        }


        /* Check password */

        if (!password) {

            showMessage(
                "براہِ کرم اپنا پاس ورڈ درج کریں۔"
            );

            if (passwordInput) {
                passwordInput.focus();
            }

            return;
        }


        /* Basic password length */

        if (password.length < 6) {

            showMessage(
                "پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔"
            );

            if (passwordInput) {
                passwordInput.focus();
            }

            return;
        }


        /*
         * Real account creation will be connected later.
         */

        showMessage(
            "آپ کی معلومات درست ہیں۔\n\n" +
            "اصل اکاؤنٹ سسٹم اگلے مرحلے میں فعال کیا جائے گا۔"
        );

    });

}


/* =========================================================
   LOGIN
   ========================================================= */

if (loginLink) {

    loginLink.addEventListener("click", function (event) {

        event.preventDefault();

        showMessage(
            "Login سسٹم اگلے مرحلے میں فعال کیا جائے گا۔"
        );

    });

}


/* =========================================================
   ENTER KEY SUPPORT
   ========================================================= */

if (passwordInput) {

    passwordInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                if (signupButton) {
                    signupButton.click();
                }

            }

        }
    );

}


/* =========================================================
   PAGE READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Application initialization will be expanded
         * when the Voice Studio dashboard is added.
         */

        document.documentElement.classList.add(
            "app-ready"
        );

    }
);
