"use strict";

/* =========================================================
   URDU VOICE STUDIO AI
   Main Application JavaScript
   Multilingual Front Page
   ========================================================= */


/* =========================================================
   LANGUAGE SYSTEM
========================================================= */

const translations = {

    ur: {

        htmlLang: "ur",
        direction: "rtl",
        title: "اردو وائس اسٹوڈیو AI",
        description:
            "اردو وائس اسٹوڈیو AI — اپنے اردو الفاظ کو خوبصورت، قدرتی اور واضح آواز میں تبدیل کریں۔",

        brandSmall: "Urdu Voice Studio AI",

        brandTitle:
            "اردو وائس اسٹوڈیو AI",

        brandDescription:
            "اپنے اردو الفاظ کو خوبصورت، قدرتی اور واضح آواز دیں۔",

        feature1:
            "قدرتی اردو آواز",

        feature2:
            "آسان اور تیز استعمال",

        feature3:
            "لمبے اردو متن کے لیے تیار",

        languageTitle:
            "زبان منتخب کریں",

        languageSubtitle:
            "اپنی پسند کی زبان منتخب کریں",

        welcome:
            "خوش آمدید",

        signupTitle:
            "اپنا اکاؤنٹ بنائیں",

        signupDescription:
            "اردو وائس اسٹوڈیو AI استعمال کرنے کے لیے چند لمحوں میں اپنا اکاؤنٹ بنائیں۔",

        google:
            "Google کے ساتھ جاری رکھیں",

        or:
            "یا",

        email:
            "ای میل",

        emailPlaceholder:
            "اپنا ای میل درج کریں",

        password:
            "پاس ورڈ",

        passwordPlaceholder:
            "کم از کم 6 حروف",

        signup:
            "اکاؤنٹ بنائیں",

        existingAccount:
            "پہلے سے اکاؤنٹ موجود ہے؟",

        login:
            "لاگ اِن کریں",

        security:
            "آپ کی معلومات محفوظ رکھی جائیں گی۔",

        googleMessage:
            "Google Sign-In اگلے مرحلے میں فعال کیا جائے گا۔",

        emailRequired:
            "براہِ کرم اپنا ای میل درج کریں۔",

        emailInvalid:
            "براہِ کرم درست ای میل ایڈریس درج کریں۔",

        passwordRequired:
            "براہِ کرم اپنا پاس ورڈ درج کریں۔",

        passwordLength:
            "پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔",

        signupSuccess:
            "آپ کی معلومات درست ہیں۔\n\nاصل اکاؤنٹ سسٹم اگلے مرحلے میں فعال کیا جائے گا۔",

        loginMessage:
            "Login سسٹم اگلے مرحلے میں فعال کیا جائے گا۔"
    },


    /* =====================================================
       ENGLISH
    ===================================================== */

    en: {

        htmlLang: "en",
        direction: "ltr",
        title: "Urdu Voice Studio AI",
        description:
            "Urdu Voice Studio AI — Turn your Urdu words into beautiful, natural and clear speech.",

        brandSmall:
            "Urdu Voice Studio AI",

        brandTitle:
            "Urdu Voice Studio AI",

        brandDescription:
            "Turn your Urdu words into beautiful, natural and clear speech.",

        feature1:
            "Natural Urdu voice",

        feature2:
            "Easy and fast to use",

        feature3:
            "Ready for long Urdu text",

        languageTitle:
            "Select Language",

        languageSubtitle:
            "Choose your preferred language",

        welcome:
            "Welcome",

        signupTitle:
            "Create Your Account",

        signupDescription:
            "Create your account in a few moments to use Urdu Voice Studio AI.",

        google:
            "Continue with Google",

        or:
            "or",

        email:
            "Email",

        emailPlaceholder:
            "Enter your email",

        password:
            "Password",

        passwordPlaceholder:
            "At least 6 characters",

        signup:
            "Create Account",

        existingAccount:
            "Already have an account?",

        login:
            "Log In",

        security:
            "Your information will be kept secure.",

        googleMessage:
            "Google Sign-In will be enabled in the next stage.",

        emailRequired:
            "Please enter your email.",

        emailInvalid:
            "Please enter a valid email address.",

        passwordRequired:
            "Please enter your password.",

        passwordLength:
            "Password must contain at least 6 characters.",

        signupSuccess:
            "Your information is valid.\n\nThe real account system will be enabled in the next stage.",

        loginMessage:
            "The login system will be enabled in the next stage."
    },


    /* =====================================================
       ARABIC
    ===================================================== */

    ar: {

        htmlLang: "ar",
        direction: "rtl",
        title: "استوديو الصوت الأردي بالذكاء الاصطناعي",
        description:
            "حوّل كلماتك الأردية إلى صوت طبيعي وواضح وجميل.",

        brandSmall:
            "Urdu Voice Studio AI",

        brandTitle:
            "استوديو الصوت الأردي AI",

        brandDescription:
            "حوّل كلماتك الأردية إلى صوت طبيعي وواضح وجميل.",

        feature1:
            "صوت أردي طبيعي",

        feature2:
            "سهل وسريع الاستخدام",

        feature3:
            "جاهز للنصوص الأردية الطويلة",

        languageTitle:
            "اختر اللغة",

        languageSubtitle:
            "اختر لغتك المفضلة",

        welcome:
            "مرحباً بك",

        signupTitle:
            "أنشئ حسابك",

        signupDescription:
            "أنشئ حسابك خلال لحظات لاستخدام استوديو الصوت الأردي بالذكاء الاصطناعي.",

        google:
            "المتابعة باستخدام Google",

        or:
            "أو",

        email:
            "البريد الإلكتروني",

        emailPlaceholder:
            "أدخل بريدك الإلكتروني",

        password:
            "كلمة المرور",

        passwordPlaceholder:
            "6 أحرف على الأقل",

        signup:
            "إنشاء حساب",

        existingAccount:
            "هل لديك حساب بالفعل؟",

        login:
            "تسجيل الدخول",

        security:
            "سيتم الحفاظ على أمان معلوماتك.",

        googleMessage:
            "سيتم تفعيل تسجيل الدخول باستخدام Google في المرحلة التالية.",

        emailRequired:
            "يرجى إدخال بريدك الإلكتروني.",

        emailInvalid:
            "يرجى إدخال بريد إلكتروني صحيح.",

        passwordRequired:
            "يرجى إدخال كلمة المرور.",

        passwordLength:
            "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",

        signupSuccess:
            "معلوماتك صحيحة.\n\nسيتم تفعيل نظام الحساب الحقيقي في المرحلة التالية.",

        loginMessage:
            "سيتم تفعيل نظام تسجيل الدخول في المرحلة التالية."
    },


    /* =====================================================
       HINDI
    ===================================================== */

    hi: {

        htmlLang: "hi",
        direction: "ltr",
        title: "उर्दू वॉइस स्टूडियो AI",
        description:
            "अपने उर्दू शब्दों को सुंदर, प्राकृतिक और स्पष्ट आवाज़ में बदलें।",

        brandSmall:
            "Urdu Voice Studio AI",

        brandTitle:
            "उर्दू वॉइस स्टूडियो AI",

        brandDescription:
            "अपने उर्दू शब्दों को सुंदर, प्राकृतिक और स्पष्ट आवाज़ दें।",

        feature1:
            "प्राकृतिक उर्दू आवाज़",

        feature2:
            "आसान और तेज़ उपयोग",

        feature3:
            "लंबे उर्दू पाठ के लिए तैयार",

        languageTitle:
            "भाषा चुनें",

        languageSubtitle:
            "अपनी पसंदीदा भाषा चुनें",

        welcome:
            "स्वागत है",

        signupTitle:
            "अपना खाता बनाएँ",

        signupDescription:
            "Urdu Voice Studio AI इस्तेमाल करने के लिए कुछ ही क्षणों में अपना खाता बनाएँ।",

        google:
            "Google के साथ जारी रखें",

        or:
            "या",

        email:
            "ईमेल",

        emailPlaceholder:
            "अपना ईमेल दर्ज करें",

        password:
            "पासवर्ड",

        passwordPlaceholder:
            "कम से कम 6 अक्षर",

        signup:
            "खाता बनाएँ",

        existingAccount:
            "क्या आपके पास पहले से खाता है?",

        login:
            "लॉग इन करें",

        security:
            "आपकी जानकारी सुरक्षित रखी जाएगी।",

        googleMessage:
            "Google Sign-In अगले चरण में सक्रिय किया जाएगा।",

        emailRequired:
            "कृपया अपना ईमेल दर्ज करें।",

        emailInvalid:
            "कृपया सही ईमेल पता दर्ज करें।",

        passwordRequired:
            "कृपया अपना पासवर्ड दर्ज करें।",

        passwordLength:
            "पासवर्ड में कम से कम 6 अक्षर होने चाहिए।",

        signupSuccess:
            "आपकी जानकारी सही है।\n\nवास्तविक खाता प्रणाली अगले चरण में सक्रिय की जाएगी।",

        loginMessage:
            "लॉगिन प्रणाली अगले चरण में सक्रिय की जाएगी।"
    },


    /* =====================================================
       SPANISH
    ===================================================== */

    es: {

        htmlLang: "es",
        direction: "ltr",
        title: "Urdu Voice Studio AI",
        description:
            "Convierte tus palabras en urdu en una voz hermosa, natural y clara.",

        brandSmall:
            "Urdu Voice Studio AI",

        brandTitle:
            "Urdu Voice Studio AI",

        brandDescription:
            "Convierte tus palabras en urdu en una voz hermosa, natural y clara.",

        feature1:
            "Voz urdu natural",

        feature2:
            "Fácil y rápido de usar",

        feature3:
            "Preparado para textos urdu largos",

        languageTitle:
            "Seleccionar idioma",

        languageSubtitle:
            "Elige tu idioma preferido",

        welcome:
            "Bienvenido",

        signupTitle:
            "Crea tu cuenta",

        signupDescription:
            "Crea tu cuenta en unos momentos para utilizar Urdu Voice Studio AI.",

        google:
            "Continuar con Google",

        or:
            "o",

        email:
            "Correo electrónico",

        emailPlaceholder:
            "Introduce tu correo electrónico",

        password:
            "Contraseña",

        passwordPlaceholder:
            "Al menos 6 caracteres",

        signup:
            "Crear cuenta",

        existingAccount:
            "¿Ya tienes una cuenta?",

        login:
            "Iniciar sesión",

        security:
            "Tu información se mantendrá segura.",

        googleMessage:
            "Google Sign-In se activará en la siguiente etapa.",

        emailRequired:
            "Introduce tu correo electrónico.",

        emailInvalid:
            "Introduce una dirección de correo válida.",

        passwordRequired:
            "Introduce tu contraseña.",

        passwordLength:
            "La contraseña debe tener al menos 6 caracteres.",

        signupSuccess:
            "Tu información es correcta.\n\nEl sistema de cuentas real se activará en la siguiente etapa.",

        loginMessage:
            "El sistema de inicio de sesión se activará en la siguiente etapa."
    },


    /* =====================================================
       FRENCH
    ===================================================== */

    fr: {

        htmlLang: "fr",
        direction: "ltr",
        title: "Urdu Voice Studio AI",
        description:
            "Transformez vos mots en ourdou en une voix naturelle, claire et agréable.",

        brandSmall:
            "Urdu Voice Studio AI",

        brandTitle:
            "Urdu Voice Studio AI",

        brandDescription:
            "Transformez vos mots en ourdou en une voix naturelle, claire et agréable.",

        feature1:
            "Voix ourdoue naturelle",

        feature2:
            "Simple et rapide",

        feature3:
            "Prêt pour les longs textes ourdous",

        languageTitle:
            "Choisir la langue",

        languageSubtitle:
            "Choisissez votre langue préférée",

        welcome:
            "Bienvenue",

        signupTitle:
            "Créer votre compte",

        signupDescription:
            "Créez votre compte en quelques instants pour utiliser Urdu Voice Studio AI.",

        google:
            "Continuer avec Google",

        or:
            "ou",

        email:
            "E-mail",

        emailPlaceholder:
            "Entrez votre e-mail",

        password:
            "Mot de passe",

        passwordPlaceholder:
            "Au moins 6 caractères",

        signup:
            "Créer un compte",

        existingAccount:
            "Vous avez déjà un compte ?",

        login:
            "Se connecter",

        security:
            "Vos informations resteront sécurisées.",

        googleMessage:
            "La connexion Google sera activée à l'étape suivante.",

        emailRequired:
            "Veuillez saisir votre e-mail.",

        emailInvalid:
            "Veuillez saisir une adresse e-mail valide.",

        passwordRequired:
            "Veuillez saisir votre mot de passe.",

        passwordLength:
            "Le mot de passe doit contenir au moins 6 caractères.",

        signupSuccess:
            "Vos informations sont correctes.\n\nLe véritable système de compte sera activé à l'étape suivante.",

        loginMessage:
            "Le système de connexion sera activé à l'étape suivante."
    },


    /* =====================================================
       GERMAN
    ===================================================== */

    de: {

        htmlLang: "de",
        direction: "ltr",
        title: "Urdu Voice Studio AI",
        description:
            "Verwandle deine Urdu-Wörter in eine schöne, natürliche und klare Stimme.",

        brandSmall:
            "Urdu Voice Studio AI",

        brandTitle:
            "Urdu Voice Studio AI",

        brandDescription:
            "Verwandle deine Urdu-Wörter in eine schöne, natürliche und klare Stimme.",

        feature1:
            "Natürliche Urdu-Stimme",

        feature2:
            "Einfach und schnell",

        feature3:
            "Für lange Urdu-Texte geeignet",

        languageTitle:
            "Sprache auswählen",

        languageSubtitle:
            "Wähle deine bevorzugte Sprache",

        welcome:
            "Willkommen",

        signupTitle:
            "Konto erstellen",

        signupDescription:
            "Erstelle in wenigen Augenblicken dein Konto, um Urdu Voice Studio AI zu nutzen.",

        google:
            "Mit Google fortfahren",

        or:
            "oder",

        email:
            "E-Mail",

        emailPlaceholder:
            "E-Mail eingeben",

        password:
            "Passwort",

        passwordPlaceholder:
            "Mindestens 6 Zeichen",

        signup:
            "Konto erstellen",

        existingAccount:
            "Du hast bereits ein Konto?",

        login:
            "Anmelden",

        security:
            "Deine Informationen werden sicher aufbewahrt.",

        googleMessage:
            "Google Sign-In wird im nächsten Schritt aktiviert.",

        emailRequired:
            "Bitte gib deine E-Mail ein.",

        emailInvalid:
            "Bitte gib eine gültige E-Mail-Adresse ein.",

        passwordRequired:
            "Bitte gib dein Passwort ein.",

        passwordLength:
            "Das Passwort muss mindestens 6 Zeichen enthalten.",

        signupSuccess:
            "Deine Angaben sind korrekt.\n\nDas echte Kontosystem wird im nächsten Schritt aktiviert.",

        loginMessage:
            "Das Anmeldesystem wird im nächsten Schritt aktiviert."
    },


    /* =====================================================
       CHINESE
    ===================================================== */

    zh: {

        htmlLang: "zh-CN",
        direction: "ltr",
        title: "乌尔都语语音工作室 AI",
        description:
            "将您的乌尔都语文字转换成自然、清晰、优美的语音。",

        brandSmall:
            "Urdu Voice Studio AI",

        brandTitle:
            "乌尔都语语音工作室 AI",

        brandDescription:
            "将您的乌尔都语文字转换成自然、清晰、优美的语音。",

        feature1:
            "自然的乌尔都语声音",

        feature2:
            "简单快速",

        feature3:
            "支持长篇乌尔都语文本",

        languageTitle:
            "选择语言",

        languageSubtitle:
            "选择您喜欢的语言",

        welcome:
            "欢迎",

        signupTitle:
            "创建您的账户",

        signupDescription:
            "只需几分钟即可创建账户并使用 Urdu Voice Studio AI。",

        google:
            "使用 Google 继续",

        or:
            "或",

        email:
            "电子邮箱",

        emailPlaceholder:
            "请输入您的电子邮箱",

        password:
            "密码",

        passwordPlaceholder:
            "至少 6 个字符",

        signup:
            "创建账户",

        existingAccount:
            "已经有账户了吗？",

        login:
            "登录",

        security:
            "您的信息将受到安全保护。",

        googleMessage:
            "Google 登录将在下一阶段启用。",

        emailRequired:
            "请输入您的电子邮箱。",

        emailInvalid:
            "请输入有效的电子邮箱地址。",

        passwordRequired:
            "请输入您的密码。",

        passwordLength:
            "密码至少需要 6 个字符。",

        signupSuccess:
            "您的信息正确。\n\n真正的账户系统将在下一阶段启用。",

        loginMessage:
            "登录系统将在下一阶段启用。"
    }

};


/* =========================================================
   CURRENT LANGUAGE
========================================================= */

let currentLanguage = "ur";


/* =========================================================
   GET ELEMENTS
========================================================= */

const googleButton =
    document.getElementById("googleButton");

const signupButton =
    document.getElementById("signupButton");

const loginButton =
    document.getElementById("loginButton");

const loginLink =
    document.getElementById("loginLink");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const languageSelect =
    document.getElementById("languageSelect");


/* =========================================================
   SMALL HELPER
========================================================= */

function showMessage(message) {

    window.alert(message);

}


/* =========================================================
   APPLY LANGUAGE
========================================================= */

function applyLanguage(language) {

    if (!translations[language]) {

        language = "ur";

    }


    currentLanguage = language;

    const t =
        translations[language];


    /* -----------------------------------------
       HTML LANGUAGE + DIRECTION
    ----------------------------------------- */

    document.documentElement.lang =
        t.htmlLang;

    document.documentElement.dir =
        t.direction;


    /* -----------------------------------------
       PAGE TITLE
    ----------------------------------------- */

    document.title =
        t.title;


    /* -----------------------------------------
       META DESCRIPTION
    ----------------------------------------- */

    const descriptionMeta =
        document.querySelector(
            'meta[name="description"]'
        );

    if (descriptionMeta) {

        descriptionMeta.setAttribute(
            "content",
            t.description
        );

    }


    /* -----------------------------------------
       BRAND
    ----------------------------------------- */

    const brandSmall =
        document.querySelector(
            ".brand-small"
        );

    if (brandSmall) {

        brandSmall.textContent =
            t.brandSmall;

    }


    const brandTitle =
        document.querySelector(
            ".brand-text h1"
        );

    if (brandTitle) {

        brandTitle.textContent =
            t.brandTitle;

    }


    const brandDescription =
        document.querySelector(
            ".brand-text p"
        );

    if (brandDescription) {

        brandDescription.textContent =
            t.brandDescription;

    }


    /* -----------------------------------------
       FEATURES
    ----------------------------------------- */

    const features =
        document.querySelectorAll(
            ".feature"
        );

    if (features.length >= 3) {

        features[0].childNodes[
            features[0].childNodes.length - 1
        ].textContent =
            " " + t.feature1;

        features[1].childNodes[
            features[1].childNodes.length - 1
        ].textContent =
            " " + t.feature2;

        features[2].childNodes[
            features[2].childNodes.length - 1
        ].textContent =
            " " + t.feature3;

    }


    /* -----------------------------------------
       LANGUAGE HEADING
    ----------------------------------------- */

    const languageTitle =
        document.querySelector(
            ".language-step-text strong"
        );

    if (languageTitle) {

        languageTitle.textContent =
            t.languageTitle;

    }


    const languageSubtitle =
        document.querySelector(
            ".language-step-text small"
        );

    if (languageSubtitle) {

        languageSubtitle.textContent =
            t.languageSubtitle;

    }


    /* -----------------------------------------
       WELCOME
    ----------------------------------------- */

    const welcome =
        document.querySelector(
            ".welcome"
        );

    if (welcome) {

        welcome.textContent =
            t.welcome;

    }


    /* -----------------------------------------
       SIGNUP TITLE
    ----------------------------------------- */

    const signupTitle =
        document.querySelector(
            ".form-heading h2"
        );

    if (signupTitle) {

        signupTitle.textContent =
            t.signupTitle;

    }


    /* -----------------------------------------
       SIGNUP DESCRIPTION
    ----------------------------------------- */

    const signupDescription =
        document.querySelector(
            ".form-heading p"
        );

    if (signupDescription) {

        signupDescription.textContent =
            t.signupDescription;

    }


    /* -----------------------------------------
       GOOGLE BUTTON
    ----------------------------------------- */

    if (googleButton) {

        const googleText =
            googleButton.querySelector(
                "span:last-child"
            );

        if (googleText) {

            googleText.textContent =
                t.google;

        }

    }


    /* -----------------------------------------
       DIVIDER
    ----------------------------------------- */

    const divider =
        document.querySelector(
            ".divider span"
        );

    if (divider) {

        divider.textContent =
            t.or;

    }


    /* -----------------------------------------
       EMAIL
    ----------------------------------------- */

    const emailLabel =
        document.querySelector(
            'label[for="email"]'
        );

    if (emailLabel) {

        emailLabel.textContent =
            t.email;

    }


    if (emailInput) {

        emailInput.placeholder =
            t.emailPlaceholder;

    }


    /* -----------------------------------------
       PASSWORD
    ----------------------------------------- */

    const passwordLabel =
        document.querySelector(
            'label[for="password"]'
        );

    if (passwordLabel) {

        passwordLabel.textContent =
            t.password;

    }


    if (passwordInput) {

        passwordInput.placeholder =
            t.passwordPlaceholder;

    }


    /* -----------------------------------------
       SIGNUP BUTTON
    ----------------------------------------- */

    if (signupButton) {

        signupButton.textContent =
            t.signup;

    }


    /* -----------------------------------------
       LOGIN ROW
    ----------------------------------------- */

    const loginRow =
        document.querySelector(
            ".login-row"
        );

    if (loginRow) {

        const spans =
            loginRow.querySelectorAll(
                "span"
            );

        if (spans.length > 0) {

            spans[0].textContent =
                t.existingAccount;

        }

    }


    if (loginButton) {

        loginButton.textContent =
            t.login;

    }


    if (loginLink) {

        loginLink.textContent =
            t.login;

    }


    /* -----------------------------------------
       SECURITY
    ----------------------------------------- */

    const securityNote =
        document.querySelector(
            ".security-note"
        );

    if (securityNote) {

        const securitySpans =
            securityNote.querySelectorAll(
                "span"
            );

        if (securitySpans.length > 1) {

            securitySpans[
                securitySpans.length - 1
            ].textContent =
                t.security;

        }

    }


    /* -----------------------------------------
       SELECTOR VALUE
    ----------------------------------------- */

    if (
        languageSelect &&
        languageSelect.value !== language
    ) {

        languageSelect.value =
            language;

    }


    /* -----------------------------------------
       SAVE LANGUAGE
    ----------------------------------------- */

    try {

        localStorage.setItem(
            "urduVoiceStudioLanguage",
            language
        );

    } catch (error) {

        /* Ignore localStorage errors */

    }

}


/* =========================================================
   LANGUAGE SELECTOR
========================================================= */

if (languageSelect) {

    languageSelect.addEventListener(
        "change",
        function () {

            applyLanguage(
                languageSelect.value
            );

        }
    );

}


/* =========================================================
   LOAD SAVED LANGUAGE
========================================================= */

function loadSavedLanguage() {

    let savedLanguage = "ur";

    try {

        const saved =
            localStorage.getItem(
                "urduVoiceStudioLanguage"
            );

        if (
            saved &&
            translations[saved]
        ) {

            savedLanguage =
                saved;

        }

    } catch (error) {

        savedLanguage = "ur";

    }


    applyLanguage(
        savedLanguage
    );

}


/* =========================================================
   GOOGLE SIGN-IN
========================================================= */

if (googleButton) {

    googleButton.addEventListener(
        "click",
        function () {

            showMessage(
                translations[currentLanguage]
                    .googleMessage
            );

        }
    );

}


/* =========================================================
   SIGN UP
========================================================= */

if (signupButton) {

    signupButton.addEventListener(
        "click",
        function () {

            const t =
                translations[currentLanguage];


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            const password =
                passwordInput
                    ? passwordInput.value.trim()
                    : "";


            /* ---------------------------------
               CHECK EMAIL
            --------------------------------- */

            if (!email) {

                showMessage(
                    t.emailRequired
                );

                if (emailInput) {

                    emailInput.focus();

                }

                return;

            }


            /* ---------------------------------
               BASIC EMAIL CHECK
            --------------------------------- */

            if (
                !email.includes("@") ||
                !email.includes(".")
            ) {

                showMessage(
                    t.emailInvalid
                );

                if (emailInput) {

                    emailInput.focus();

                }

                return;

            }


            /* ---------------------------------
               CHECK PASSWORD
            --------------------------------- */

            if (!password) {

                showMessage(
                    t.passwordRequired
                );

                if (passwordInput) {

                    passwordInput.focus();

                }

                return;

            }


            /* ---------------------------------
               PASSWORD LENGTH
            --------------------------------- */

            if (password.length < 6) {

                showMessage(
                    t.passwordLength
                );

                if (passwordInput) {

                    passwordInput.focus();

                }

                return;

            }


            /* ---------------------------------
               TEMPORARY SUCCESS
            --------------------------------- */

            showMessage(
                t.signupSuccess
            );

        }
    );

}


/* =========================================================
   LOGIN
========================================================= */

function handleLogin(event) {

    if (event) {

        event.preventDefault();

    }

    showMessage(
        translations[currentLanguage]
            .loginMessage
    );

}


if (loginButton) {

    loginButton.addEventListener(
        "click",
        handleLogin
    );

}


if (loginLink) {

    loginLink.addEventListener(
        "click",
        handleLogin
    );

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

        loadSavedLanguage();


        document.documentElement.classList.add(
            "app-ready"
        );

    }
);
