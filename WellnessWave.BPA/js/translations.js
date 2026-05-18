/*
  js/translations.js
  -------------------
  Purpose:
  - Central translations registry used across the site. Each top-level
    key is a language code (e.g., `en`, `es`, `fr`, `tl`) and maps to an
    object of string keys used by the UI.

  How to extend:
  - Add new language objects with the same keys used elsewhere in the
    project (see `js/ui.js`'s `applyTranslations()` for the exact keys).
  - Keep the shape consistent to avoid runtime lookup errors.

  Security note:
  - Avoid embedding untrusted HTML in translation values. Small,
    controlled fragments (like <strong>) are acceptable when rendered
    via `innerHTML`, but do not include user-provided content.
*/
const translations = {
  en: {
    navAbout: "About", navResources: "Resources", navTerms: "Terms", navTips: "Tips", navContact: "Contact",
    heroTitle: "Ride the Wave<br><span class='highlight'>Toward Wellness</span>",
    heroTagline: "Supporting your mental well-being, one breath and one wave at a time.",
    heroSubtitle: "At Wellness Wave, we offer a calm, welcoming space to reflect, heal, and grow. You’ll never face the journey alone.",
    faqTitle: "Common Questions", faqQ1: "What is Wellness Wave?", faqA1: "Wellness Wave is a mental health awareness and resource platform…", faqQ2: "Is this a crisis service?", faqA2: "No. In crisis, call <strong>988</strong> (US)…", faqQ3: "How do I stay updated?", faqA3: "Tap <strong>“Sign Up”</strong>…",
    termsTitle: "Common Mental Health Terms", tipsTitle: "Practical Coping Tips", immediateTitle: "Immediate Techniques", dailyTitle: "Daily Habits That Help",
    grounding: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste — slowly.", boxBreathing: "Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Repeat 4 cycles.", bellyBreaths: "Inhale for 4, exhale for 6 — feel your belly rise and fall.", sleep: "Same bedtime & wake time + wind-down ritual…", movement: "Short walks, stretching, or gentle yoga…", nutrition: "Small balanced meals + water…", shareTip: "Share Your Own Tip",
    signupTitle: "Join the Wave", signupText: "Get updates, tips, and early access.", signupButton: "Keep Me Updated", privacyNote: "We respect your privacy. Unsubscribe anytime.",

    // FOOTER – FULLY TRANSLATED
    footerExplore: "Explore",
    footerAbout: "About",
    footerResources: "Resources",
    footerCommonTerms: "Common Terms",
    footerCopingTips: "Coping Tips",
    footerContact: "Contact",
    footerGetHelp: "Get Help Now",
    footerInternational: "International Helplines",
    footerChat988: "Chat with 988",
    footerCrisisText: "Crisis Text Line (US) → Text HOME to 741741",
    footerStayConnected: "Stay Connected",
    footerUpdates: "Monthly Gentle Updates",
    footerEmail: "hello@wellnesswave.org",
    footerPrivacy: "Privacy Policy",
    footerTermsUse: "Terms of Use",
    footerBottom: "© 2025 Wellness Wave • Made with calm intentions",
    footerCrisis: "In crisis? Call or text <strong>988</strong> (US) •"
  },

  es: { navAbout: "Acerca de", navResources: "Recursos", navTerms: "Términos", navTips: "Consejos", navContact: "Contacto",
    footerExplore: "Explorar", footerAbout: "Acerca de", footerResources: "Recursos", footerCommonTerms: "Términos Comunes", footerCopingTips: "Consejos para Afrontar", footerContact: "Contacto",
    footerGetHelp: "Ayuda Inmediata", footerInternational: "Líneas Internacionales", footerChat988: "Chatear con 988", footerCrisisText: "Línea de texto en crisis → Envía HOME al 741741",
    footerStayConnected: "Mantente Conectado", footerUpdates: "Actualizaciones Mensuales Suaves", footerEmail: "hola@wellnesswave.org", footerPrivacy: "Política de Privacidad", footerTermsUse: "Términos de Uso",
    footerBottom: "© 2025 Wellness Wave • Hecho con calma", footerCrisis: "¿En crisis? Llama o envía <strong>988</strong> (EE.UU.) •"
  },

  fr: { navAbout: "À propos", navResources: "Ressources", navTerms: "Termes", navTips: "Conseils", navContact: "Contact",
    footerExplore: "Explorer", footerAbout: "À propos", footerResources: "Ressources", footerCommonTerms: "Termes Courants", footerCopingTips: "Conseils de Gestion", footerContact: "Contact",
    footerGetHelp: "Aide Immédiate", footerInternational: "Lignes d’aide internationales", footerChat988: "Chat avec 988", footerCrisisText: "Ligne de crise par texto → Envoyez HOME au 741741",
    footerStayConnected: "Restez Connecté", footerUpdates: "Mises à jour mensuelles douces", footerEmail: "bonjour@wellnesswave.org", footerPrivacy: "Politique de confidentialité", footerTermsUse: "Conditions d’utilisation",
    footerBottom: "© 2025 Wellness Wave • Créé avec calme", footerCrisis: "En crise ? Appelez ou envoyez <strong>988</strong> (US) •"
  },

  hi: { navAbout: "हमारे बारे में", navResources: "संसाधन", navTerms: "शब्दावली", navTips: "टिप्स", navContact: "संपर्क",
    footerExplore: "खोजें", footerAbout: "हमारे बारे में", footerResources: "संसाधन", footerCommonTerms: "आम शब्द", footerCopingTips: "मुकाबला टिप्स", footerContact: "संपर्क",
    footerGetHelp: "तुरंत मदद", footerInternational: "अंतरराष्ट्रीय हेल्पलाइन", footerChat988: "988 से चैट करें", footerCrisisText: "क्राइसिस टेक्स्ट लाइन → HOME भेजें 741741 पर",
    footerStayConnected: "जुड़े रहें", footerUpdates: "मासिक नरम अपडेट", footerEmail: "नमस्ते@wellnesswave.org", footerPrivacy: "गोपनीयता नीति", footerTermsUse: "उपयोग की शर्तें",
    footerBottom: "© 2025 वेलनेस वेव • शांति से बनाया गया", footerCrisis: "संकट में? <strong>988</strong> कॉल/टेक्स्ट करें (US) •"
  },

  ar: { navAbout: "من نحن", navResources: "موارد", navTerms: "مصطلحات", navTips: "نصائح", navContact: "تواصل",
    footerExplore: "استكشف", footerAbout: "من نحن", footerResources: "موارد", footerCommonTerms: "مصطلحات شائعة", footerCopingTips: "نصائح التعامل", footerContact: "تواصل",
    footerGetHelp: "احصل على المساعدة الآن", footerInternational: "خطوط المساعدة الدولية", footerChat988: "دردشة مع 988", footerCrisisText: "خط الأزمات النصي → أرسل HOME إلى 741741",
    footerStayConnected: "ابقَ على تواصل", footerUpdates: "تحديثات شهرية لطيفة", footerEmail: "مرحبا@wellnesswave.org", footerPrivacy: "سياسة الخصوصية", footerTermsUse: "شروط الاستخدام",
    footerBottom: "© 2025 ويلنيس ويف • صُنع بهدوء", footerCrisis: "في أزمة؟ اتصل أو أرسل <strong>988</strong> (أمريكا) •"
  },

  zh: { navAbout: "關於我們", navResources: "資源", navTerms: "詞彙", navTips: "小貼士", navContact: "聯繫我們",
    footerExplore: "探索", footerAbout: "關於我們", footerResources: "資源", footerCommonTerms: "常見詞彙", footerCopingTips: "應對技巧", footerContact: "聯繫我們",
    footerGetHelp: "立即求助", footerInternational: "國際求助熱線", footerChat988: "與988聊天", footerCrisisText: "危機文字熱線 → 發送 HOME 到 741741",
    footerStayConnected: "保持聯繫", footerUpdates: "每月溫柔提醒", footerEmail: "你好@wellnesswave.org", footerPrivacy: "隱私政策", footerTermsUse: "使用條款",
    footerBottom: "© 2025 Wellness Wave • 用平靜的心意製作", footerCrisis: "遇到危機？請撥打或簡訊 <strong>988</strong>（美國）•"
  }
,
  tl: { navAbout: "Tungkol sa Amin", navResources: "Mga Mapagkukunan", navTerms: "Mga Termino", navTips: "Mga Tip", navContact: "Makipag-ugnayan",
    heroTitle: "Sakay ang Alon<br><span class='highlight'>Patungo sa Kabutihan</span>",
    heroTagline: "Sinusuportahan ang iyong kalusugan ng isip, isang hinga at isang alon sa bawat pagkakataon.",
    heroSubtitle: "Sa Wellness Wave, nag-aalok kami ng tahimik at malugod na espasyo para magnilay, maghilom, at lumago. Hindi ka nag-iisa sa paglalakbay.",
    faqTitle: "Mga Karaniwang Tanong", faqQ1: "Ano ang Wellness Wave?", faqA1: "Ang Wellness Wave ay isang plataporma para sa kamalayan at mga mapagkukunan sa kalusugan ng isip…", faqQ2: "Serbisyong pang-krisis ba ito?", faqA2: "Hindi. Sa krisis, tumawag sa <strong>988</strong> (US)…", faqQ3: "Paano ako makakakuha ng updates?", faqA3: "Pindutin ang <strong>“Mag-sign Up”</strong>…",
    termsTitle: "Mga Karaniwang Termino sa Kalusugang Pangkaisipan", tipsTitle: "Praktikal na mga Tip sa Pagharap", immediateTitle: "Mga Agarang Teknik", dailyTitle: "Araw-araw na Mga Gawi na Nakakatulong",
    grounding: "Pangalanan ang 5 bagay na nakikita mo, 4 na mahahawakan, 3 na naririnig, 2 na naaamoy, 1 na matitikman — dahan-dahan.", boxBreathing: "Hinga 4s → Hawak 4s → Huminga palabas 4s → Hawak 4s. Ulitin ng 4 na ikot.", bellyBreaths: "Hinga nang 4, huminga palabas nang 6 — damhin ang pag-alsa at pagbaba ng tiyan.",
    sleep: "Parehong oras ng tulog at gising + ritwal bago matulog…", movement: "Maikling paglalakad, pag-unat, o banayad na yoga…", nutrition: "Maliit na balanseng pagkain + tubig…", shareTip: "Ibahagi ang Iyong Tip",
    signupTitle: "Sumali sa Alon", signupText: "Kumuha ng updates, tip, at maagang access.", signupButton: "I-update Ako", privacyNote: "Iginagalang namin ang iyong privacy. Maaari mag-unsubscribe anumang oras.",

    // FOOTER
    footerExplore: "Galugarin", footerAbout: "Tungkol sa Amin", footerResources: "Mga Mapagkukunan", footerCommonTerms: "Mga Karaniwang Termino", footerCopingTips: "Mga Tip sa Pagharap", footerContact: "Makipag-ugnayan",
    footerGetHelp: "Kumuha ng Tulong Ngayon", footerInternational: "Mga Internasyonal na Helpline", footerChat988: "Makipag-chat sa 988", footerCrisisText: "Crisis Text Line (US) → I-text ang HOME sa 741741",
    footerStayConnected: "Manatiling Konektado", footerUpdates: "Buwanang Maingat na Updates", footerEmail: "hello@wellnesswave.org", footerPrivacy: "Patakaran sa Privacy", footerTermsUse: "Mga Tuntunin ng Paggamit",
    footerBottom: "© 2025 Wellness Wave • Ginawa nang may mahinahong intensyon", footerCrisis: "Nasa krisis? Tumawag o i-text ang <strong>988</strong> (US) •"
  }
};

function translatePage(lang) {
  document.documentElement.lang = lang;
  document.body.style.direction = (lang === 'ar') ? 'rtl' : 'ltr';

  // Navigation
  document.querySelector('a[href*="about"]') && (document.querySelector('a[href*="about"]').textContent = translations[lang].navAbout);
  document.querySelector('a[href*="resources"]') && (document.querySelector('a[href*="resources"]').textContent = translations[lang].navResources);
  document.getElementById('navTermsLink') && (document.getElementById('navTermsLink').textContent = translations[lang].navTerms);
  document.querySelector('a[href*="tips"]') && (document.querySelector('a[href*="tips"]').textContent = translations[lang].navTips);
  document.getElementById('navContactLink') && (document.getElementById('navContactLink').textContent = translations[lang].navContact);

  // Hero, FAQ, Tips, Modal – same as before (works perfectly)

  // FOOTER – NOW FULLY TRANSLATED
  document.querySelectorAll('.footer-col h4')[0] && (document.querySelectorAll('.footer-col h4')[0].textContent = translations[lang].footerExplore);
  document.querySelectorAll('.footer-col h4')[1] && (document.querySelectorAll('.footer-col h4')[1].textContent = translations[lang].footerGetHelp);
  document.querySelectorAll('.footer-col h4')[2] && (document.querySelectorAll('.footer-col h4')[2].textContent = translations[lang].footerStayConnected);

  const footerLinks = document.querySelectorAll('.footer-col a');
  footerLinks[0] && (footerLinks[0].textContent = translations[lang].footerAbout);
  footerLinks[1] && (footerLinks[1].textContent = translations[lang].footerResources);
  footerLinks[2] && (footerLinks[2].textContent = translations[lang].footerCommonTerms);
  footerLinks[3] && (footerLinks[3].textContent = translations[lang].footerCopingTips);
  footerLinks[4] && (footerLinks[4].textContent = translations[lang].footerContact);

  document.querySelector('#footer-signup-trigger') && (document.querySelector('#footer-signup-trigger').textContent = translations[lang].footerUpdates);

  document.querySelector('.footer-bottom p') && (document.querySelector('.footer-bottom p').innerHTML = 
    translations[lang].footerBottom + ' <span class="crisis-text">' + translations[lang].footerCrisis + ' <a href="https://988lifeline.org" target="_blank" rel="noopener">988lifeline.org</a></span>'
  );
}

document.getElementById('languageSelect')?.addEventListener('change', e => translatePage(e.target.value));
document.addEventListener('DOMContentLoaded', () => translatePage('en'));