/*
  Main initialization block.
  - Waits for DOMContentLoaded so we can safely query and modify DOM nodes.
  - Sets up UI behaviors (sticky nav), modal wiring, event listeners,
    translations and any runtime UI adjustments.
  This is the entry point for client-side UI logic; keep heavy work
  lazy and DOM-safe inside this handler.
*/
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("nav");
  if (nav) {
    window.addEventListener("scroll", () =>
      nav.classList.toggle("scrolled", window.scrollY > 50)
    );
  }

  // MODAL
  /*
    Modal helpers: openModal/closeModal manage the signup modal's
    visibility, focus, and page-scroll locking. They operate purely
    on DOM state (hidden attribute + show class) so CSS transitions
    can handle animation. Always guard with existence checks because
    not every page includes the modal (e.g., some pages may omit it).
  */
  const signupBtn = document.querySelector(".signup-btn");
  const modal = document.getElementById("signupModal");
  const closeBtn = document.querySelector(".modal-close");
  const modalContent = modal?.querySelector(".modal");

  function openModal() {
    if (!modal) return;
    modal.removeAttribute("hidden");
    modal.classList.add("show");
    modalContent?.focus();
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
    setTimeout(() => modal.setAttribute("hidden", ""), 400);
    document.body.style.overflow = "";
  }

  signupBtn?.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => e.target === modal && closeModal());
  document.addEventListener(
    "keydown",
    (e) =>
      e.key === "Escape" && modal?.classList.contains("show") && closeModal()
  );

  /*
    Signup flow (modal form submit)
    - Basic client-side validation: check for an '@' inside the email.
    - Persist a lightweight signed-up flag in localStorage so the UI
      can show a welcome state across reloads (no server required).
    - Open a mailto to notify the site owner (demo behavior), then
      close the modal and reset the form. Keep this flow simple and
      intentionally client-only for privacy and demo safety.
  */
  document.getElementById("signupForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value.trim();
    if (email && email.includes("@")) {
      // Update modal heading to welcome message (localized)
      const heading = document.querySelector(".modal h3");
      if (heading) {
        const lang = document.getElementById("langSelect")?.value || localStorage.getItem("wellnessLang") || document.documentElement.lang || "en";
        const t = translations[lang] || translations.en;
        heading.textContent = t.welcomeWave || "Welcome to the Wave";
      }

      // mark signed up locally so button state persists
      try {
        localStorage.setItem("wellnessSignedUp", "true");
      } catch (err) {}
      if (typeof updateSignupButtons === "function") updateSignupButtons();

      // Prepare mailto to notify site owner (will open user's email client)
      const owner = "youremail@example.com";
      const subject = `Welcome to the Wave — New signup: ${email}`;
      const body = `Please welcome ${email} to the Wave.%0D%0A%0D%0ASubscriber email: ${email}`;
      // Open mail client compose to notify owner
      location.href = `mailto:${owner}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Close modal and reset form
      setTimeout(() => {
        closeModal();
        e.target.reset();
      }, 300);
    }
  });

  // FAQ
  document
    .querySelectorAll(".faq-question")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        btn.closest(".faq-item").classList.toggle("active")
      )
    );

  /*
    Translations object
    - Centralized lookup for all visible strings used by the UI.
    - Keys mirror the DOM areas they affect (nav, hero, tips, footer, forms).
    - When adding new UI text, add corresponding entries here for
      each language and then reference them from `applyTranslations()`.
    - Keep HTML markup minimal inside translation strings; prefer
      using DOM APIs to insert structure when possible to avoid XSS.
  */
  const translations = {
    en: {
      navAbout: "About",
      navResources: "Resources",
      navTerms: "Terms",
      navTips: "Tips",
      navContact: "Contact",
      navSignUp: "Sign Up",
      heroTitle:
        'Ride the Wave<br><span class="highlight">Toward Wellness</span>',
      heroTagline:
        "Supporting your mental well-being, one breath and one wave at a time.",
      heroSubtitle:
        "At Wellness Wave, we offer a calm, welcoming space to reflect, heal, and grow. You’ll never face the journey alone.",
      faqTitle: "Common Questions",
      faq1q: "What is Wellness Wave?",
      faq2q: "Is this a crisis service?",
      faq3q: "How do I stay updated?",
      faq1a:
        "Wellness Wave is a mental health awareness and resource platform dedicated to making mental well-being accessible and understandable. We provide evidence-based information, practical tools, self-care strategies, and guidance on when and how to seek professional help. Our mission is to meet people wherever they are on their mental health journey.",
      faq2a:
        "No, Wellness Wave is not a crisis or emergency service. We do not provide immediate counseling, therapy, or crisis intervention. If you or someone you know is in immediate danger or experiencing a mental health crisis, please reach out to a professional crisis service right away — for example, call <strong>988</strong> in the United States.",
      faq3a:
        "Tap <strong>“Sign Up”</strong> above. We send gentle monthly tips with easy unsubscribe. Follow us on social channels for daily insights, reminders, and community stories.",
      tipsTitle: "Practical Coping Tips",
      tipsImmediate: "Immediate Techniques",
      tipsDaily: "Daily Habits That Help",
      tip1: "5-4-3-2-1 Grounding<br>Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste — slowly.",
      tip2: "Box Breathing<br>Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Repeat 4 cycles.",
      tip3: "Slow Belly Breaths<br>Inhale for 4, exhale for 6 — feel your belly rise and fall.",
      tip4: "Consistent Sleep Routine<br>Same bedtime & wake time + wind-down ritual (limit screens 30–60 min before bed).",
      tip5: "Move Your Body<br>Short walks, stretching, or gentle yoga — 10–30 min most days lifts mood.",
      tip6: "Eat & Hydrate Regularly<br>Small balanced meals + water keep energy and focus steady.",
      tipsCta: "Share Your Own Tip →",
      contactTitle: "Contact & Feedback",
      contactSubtitle: "We’d love to hear from you.",
      contactName: "Name",
      contactEmail: 'Email <span class="optional">(optional)</span>',
      contactSubject: "Subject",
      contactMessage: "Message",
      contactConsent:
        "I consent to using my email client and local storage for demo purposes.",
      contactSubmit: "Send Message",
      contactBack: "← Back to Home",
      signupTitle: "Join the Wave",
      signupText: "Get updates, tips, and early access to new resources.",
      signupButton: "Keep Me Updated",
      signupPlaceholder: "Enter your email",
      privacyNote: "We respect your privacy. Unsubscribe anytime.",
      placeholderName: "Your name",
      placeholderEmail: "you@example.com",
      placeholderSubject: "What’s this about?",
      placeholderMessage: "How can we help? We’re listening.",
      termsTitle: "Common Mental Health Terms",
      termsSubtitle: "Tap any term to learn more in a calm, simple way",

      // Definitions
      anxiety:
        "Anxiety is a feeling of worry, nervousness, or unease — often about something with an uncertain outcome. It’s your body’s natural response to stress.",
      depression:
        "Depression is more than just feeling sad. It’s a mood disorder that can affect how you feel, think, and handle daily activities. It’s okay to not be okay.",
      stress:
        "Stress is your body’s response to pressure. Short bursts can help you perform — but long-term stress can harm both mind and body.",
      burnout:
        "Burnout is a state of emotional, physical, and mental exhaustion caused by prolonged stress. It happens when you feel overwhelmed and unable to meet constant demands.",
      panic:
        "A panic attack is a sudden episode of intense fear that triggers severe physical reactions when there is no real danger. You are safe — it will pass.",
      mindfulness:
        "Mindfulness means paying full attention to the present moment, without judgment. It helps reduce anxiety and brings calm.",
      selfcare:
        "Self-care is anything you do to take care of your mental, emotional, and physical health. It’s not selfish — it’s necessary.",
      resilience:
        "Resilience is your ability to bounce back from difficult experiences. It’s like a muscle — it gets stronger with practice.",
      boundaries:
        "Boundaries are limits you set to protect your well-being. Saying “no” is a complete sentence and a form of self-respect.",
      therapy:
        "Therapy is a safe space to talk with a trained professional about your thoughts and feelings. Asking for help is a sign of strength.",
      trigger:
        "A trigger is anything that sets off a memory or emotional response — like a flashback or intense feeling. You’re allowed to step away.",
      grounding:
        "Grounding techniques help bring you back to the present moment when feeling overwhelmed. Try the 5-4-3-2-1 method.",
      support:
        "Your support system includes people who care about you and want you to thrive. You never have to face things alone.",
        termAnxiety: "Anxiety",
        termDepression: "Depression",
        termStress: "Stress",
        termBurnout: "Burnout",
        termPanic: "Panic Attack",
        termMindfulness: "Mindfulness",
        termSelfcare: "Self-Care",
        termResilience: "Resilience",
        termBoundaries: "Boundaries",
        termTherapy: "Therapy",
        termTrigger: "Trigger",
        termGrounding: "Grounding",
        termSupport: "Support System",
      typing1: "You are not alone.",
      typing2: "Healing begins with one breath.",
      typing3: "Your wave matters.",
      footerExplore: "Explore",
      footerGetHelp: "Get Help Now",
      footerStayConnected: "Stay Connected",
      footerDesc:
        "A calming space for mental health awareness, education, and gentle support.",
      intlHelplines: "International Helplines",
      chat988: "Chat with 988",
      crisisTextLine: "Crisis Text Line (US) → Text HOME to 741741",
      welcomeWave: "Welcome to the Wave",
      emailDisplay: "hello@wellnesswave.org",
      privacyPolicy: "Privacy Policy",
      termsOfUse: "Terms of Use",
    },
    zh: {
      navAbout: "关于",
      navResources: "资源",
      navTerms: "术语",
      navTips: "小贴士",
      navContact: "联系",
      navSignUp: "订阅",
      heroTitle: '乘风破浪<br><span class="highlight">走向健康</span>',
      heroTagline: "一次呼吸、一次浪潮，陪伴你的心理健康。",
      heroSubtitle:
        "在 Wellness Wave，我们提供一个平静、温暖的空间，让你反思、疗愈、成长。你永远不孤单。",
      faqTitle: "常见问题",
      faq1q: "Wellness Wave 是什么？",
      faq2q: "这是危机服务吗？",
      faq3q: "如何保持更新？",
      faq1a:
        "Wellness Wave 是一个心理健康意识与资源平台，致力于让心理健康变得易懂且触手可及。我们提供基于证据的信息、实用工具、自我关怀策略，以及关于何时、何地寻求专业帮助的指导。我们的使命是陪伴每个人在心理健康旅程中的任何阶段。",
      faq2a:
        "不是，Wellness Wave 不是危机或紧急服务。我们不提供即时咨询、心理治疗或危机干预。如果您或您认识的人正处于即时危险或心理健康危机，请立即联系专业危机服务——例如在美国拨打 <strong>988</strong>。",
      faq3a:
        "点击上方的 <strong>“订阅”</strong> 按钮。我们每月发送温和的小贴士，随时可取消订阅。关注我们的社交频道，获取每日心得、提醒和社区故事。",
      tipsTitle: "实用应对技巧",
      tipsImmediate: "即时技巧",
      tipsDaily: "日常好习惯",
      tip1: "5-4-3-2-1 接地<br>慢慢说出你看到的5样、触摸的4样、听到的3样、闻到的2样、尝到的1样。",
      tip2: "方形呼吸<br>吸气4秒 → 屏气4秒 → 呼气4秒 → 屏气4秒。重复4轮。",
      tip3: "慢腹式呼吸<br>吸气4秒，呼气6秒 — 感受腹部起伏。",
      tip4: "规律睡眠<br>固定作息 + 睡前放松仪式（睡前30-60分钟远离屏幕）。",
      tip5: "适度运动<br>短时散步、伸展或轻柔瑜伽 — 大多数日子10-30分钟能提升情绪。",
      tip6: "规律饮食与补水<br>少量均衡饮食 + 多喝水，稳定能量与注意力。",
      tipsCta: "分享你的小妙招 →",
      termsTitle: "常见心理健康术语",
      termsSubtitle: "点击任何术语以平静、简单的方式了解更多",
      contactTitle: "联系与反馈",
      contactSubtitle: "很想听听你的声音",
      contactName: "姓名",
      contactEmail: '邮箱 <span class="optional">(可选)</span>',
      contactSubject: "主题",
      contactMessage: "留言",
      contactConsent: "我同意使用邮件客户端和本地存储（仅用于演示）",
      contactSubmit: "发送消息",
      contactBack: "← 返回首页",
      signupTitle: "加入浪潮",
      signupText: "获取更新、技巧和优先访问新资源。",
      signupButton: "保持我更新",
      signupPlaceholder: "输入您的电子邮件",
      privacyNote: "我们尊重您的隐私。随时取消订阅。",
      placeholderName: "你的名字",
      placeholderEmail: "you@example.com",
      placeholderSubject: "这件事关于什么？",
      placeholderMessage: "我们能如何帮助？我们在聆听。",
        anxiety:
          "焦虑是一种担忧、紧张或不安的感觉——通常与不确定的结果有关。它是身体对压力的自然反应。",
        depression:
          "抑郁不仅仅是感到悲伤。它是一种情绪障碍，可能影响你的感觉、思考和日常活动。感到不舒服是可以的。",
        stress:
          "压力是身体对压力源的反应。短期压力可以帮助表现，但长期压力可能损害身心。",
        burnout:
          "倦怠是由长期压力引起的情绪、身体和心理耗竭状态。它发生在你感到不堪重负，无法应对持续的要求时。",
        panic:
          "惊恐发作是突然的强烈恐惧感发作，会引发严重的生理反应，即使没有真实危险。你是安全的——它会过去。",
        mindfulness:
          "正念是以不评判的方式全然关注当下。它有助于减少焦虑并带来平静。",
        selfcare:
          "自我照护是你为照顾心理、情绪和身体健康所做的任何事。这并非自私，而是必要的。",
        resilience:
          "韧性是你从困难中恢复的能力。它像肌肉一样，通过练习变得更强。",
        boundaries:
          "界限是你为保护自身福祉而设的限制。说“否”是一句完整的话，也是自我尊重的一种形式。",
        therapy:
          "治疗是与受过训练的专业人士谈论你的想法和感受的安全空间。寻求帮助是力量的表现。",
        trigger:
          "触发因素是任何引发记忆或情绪反应的事物——像闪回或强烈感受。你可以选择离开。",
        grounding:
          "接地技术帮助你在感到不知所措时回到当下。试试5-4-3-2-1方法。",
        support:
          "你的支持系统包括关心你并希望你过得好的人。你不必独自面对。",
          termAnxiety: "焦虑",
          termDepression: "抑郁",
          termStress: "压力",
          termBurnout: "倦怠",
          termPanic: "惊恐发作",
          termMindfulness: "正念",
          termSelfcare: "自我关怀",
          termResilience: "韧性",
          termBoundaries: "界限",
          termTherapy: "治疗",
          termTrigger: "触发因素",
          termGrounding: "接地",
          termSupport: "支持系统",
          typing1: "你并不孤单。",
          typing2: "疗愈始于一口呼吸。",
          typing3: "你的浪潮很重要。",
          footerExplore: "探索",
          footerGetHelp: "立即寻求帮助",
          footerStayConnected: "保持联系",
          footerDesc: "一个平静的空间，提供心理健康意识、教育和温柔的支持。",
          intlHelplines: "国际求助热线",
          chat988: "与 988 在线聊天",
          crisisTextLine: "危机短信线（美国）→ 发送 HOME 到 741741",
          welcomeWave: "欢迎加入浪潮",
          emailDisplay: "hello@wellnesswave.org",
          privacyPolicy: "隐私政策",
          termsOfUse: "使用条款",
    },
    hi: {
      navAbout: "हमारे बारे में",
      navResources: "संसाधन",
      navTerms: "शब्दावली",
      navTips: "टिप्स",
      navContact: "संपर्क",
      navSignUp: "साइन अप",
      heroTitle:
        'लहर पर सवार<br><span class="highlight">स्वास्थ्य की ओर</span>',
      heroTagline: "आपकी मानसिक सेहत का साथ, एक सांस और एक लहर हर बार।",
      heroSubtitle:
        "Wellness Wave में हम एक शांत और स्वागत करने वाला स्थान देते हैं जहाँ आप सोचें, ठीक हों और बढ़ें। आप अकेले नहीं हैं।",
      faqTitle: "सामान्य प्रश्न",
      faq1q: "Wellness Wave क्या है?",
      faq2q: "क्या यह संकट सेवा है?",
      faq3q: "मैं अपडेट कैसे रहूँ?",
      faq1a:
        "वेलनेस वेव एक मानसिक स्वास्थ्य जागरूकता और संसाधन मंच है जो मानसिक स्वास्थ्य को सरल और समझने योग्य बनाने के लिए समर्पित है। हम प्रमाण-आधारित जानकारी, व्यावहारिक उपकरण, आत्म-देखभाल की रणनीतियाँ और पेशेवर मदद कब और कैसे लें इसकी मार्गदर्शिका प्रदान करते हैं। हमारा मिशन हर व्यक्ति को उनकी मानसिक स्वास्थ्य यात्रा के किसी भी चरण में मिलना है।",
      faq2a:
        "नहीं, वेलनेस वेव कोई संकट या आपातकालीन सेवा नहीं है। हम तत्काल परामर्श, थेरेपी या संकट हस्तक्षेप प्रदान नहीं करते। यदि आप या आपका कोई परिचित तत्काल खतरे में है या मानसिक स्वास्थ्य संकट का सामना कर रहा है, तो कृपया तुरंत किसी पेशेवर संकट सेवा से संपर्क करें — उदाहरण के लिए अमेरिका में <strong>988</strong> डायल करें।",
      faq3a:
        "ऊपर दिए <strong>“साइन अप”</strong> बटन पर टैप करें। हम हर महीने कोमल टिप्स भेजते हैं जिन्हें कभी भी अनसब्सक्राइब किया जा सकता है। दैनिक प्रेरणा, रिमाइंडर और समुदाय की कहानियों के लिए हमें सोशल मीडिया पर फॉलो करें।",
      tipsTitle: "व्यावहारिक सामना करने के टिप्स",
      tipsImmediate: "तुरंत तकनीकें",
      tipsDaily: "दैनिक आदतें जो मदद करती हैं",
      tip1: "5-4-3-2-1 ग्राउंडिंग<br>5 चीजें जो आप देख सकते हैं, 4 छू सकते हैं… धीरे-धीरे करें।",
      tip2: "बॉक्स ब्रीदिंग<br>4 सेकंड सांस लें → 4 रोकें → 4 छोड़ें → 4 रोकें। 4 चक्र दोहराएँ।",
      tip3: "धीमी पेट की सांस<br>4 के लिए अंदर लें, 6 के लिए बाहर छोड़ें।",
      tip4: "नियमित नींद की दिनचर्या<br>एक ही समय पर सोना और उठना + स्क्रीन से दूर रहें।",
      tip5: "शरीर को हिलाएं<br>छोटी सैर, स्ट्रेचिंग या योग — 10-30 मिनट ज्यादातर दिन।",
      tip6: "नियमित भोजन और पानी<br>संतुलित भोजन और हाइड्रेशन ऊर्जा बनाए रखते हैं।",
      tipsCta: "अपना टिप शेयर करें →",
      termsTitle: "सामान्य मानसिक स्वास्थ्य शब्द",
      termsSubtitle: "किसी भी शब्द पर टैप करके शांत और सरल तरीके से और जानें।",
      contactTitle: "संपर्क और फीडबैक",
      contactSubtitle: "हम आपसे सुनना चाहते हैं",
      contactName: "नाम",
      contactEmail: 'ईमेल <span class="optional">(वैकल्पिक)</span>',
      contactSubject: "विषय",
      contactMessage: "संदेश",
      contactConsent:
        "मैं डेमो के लिए ईमेल और स्थानीय स्टोरेज के उपयोग की सहमति देता हूँ",
      contactSubmit: "संदेश भेजें",
      contactBack: "← होम पर वापस",
      signupTitle: "लहर में शामिल हों",
      signupText: "अपडेट्स, टिप्स, और नए संसाधनों तक जल्दी पहुँच प्राप्त करें।",
      signupButton: "मुझे अपडेट रखें",
      signupPlaceholder: "अपना ईमेल दर्ज करें",
      privacyNote: "हम आपकी गोपनीयता का सम्मान करते हैं। कभी भी सदस्यता रद्द करें।",
      placeholderName: "आपका नाम",
      placeholderEmail: "you@example.com",
      placeholderSubject: "यह किस बारे में है?",
      placeholderMessage: "हम आपकी कैसे मदद कर सकते हैं? हम सुन रहे हैं।",
        anxiety:
          "चिंता वह भावना है जिसमें अनिश्चित परिणाम के बारे में चिंता, नस-नस में खिंचाव या बेचैनी होती है। यह तनाव पर शरीर की प्राकृतिक प्रतिक्रिया है।",
        depression:
          "डिप्रेशन केवल उदासी नहीं है। यह एक मूड विकार है जो आपकी भावनाओं, सोच और दैनिक गतिविधियों को प्रभावित कर सकता है। ठीक न होना ठीक है।",
        stress:
          "तनाव दबाव के प्रति आपके शरीर की प्रतिक्रिया है। अल्पकालिक तनाव प्रदर्शन में मदद कर सकता है, लेकिन दीर्घकालिक तनाव मन और शरीर को नुकसान पहुंचा सकता है।",
        burnout:
          "बर्नआउट लंबी अवधि के तनाव के कारण भावनात्मक, शारीरिक और मानसिक थकावट की स्थिति है। यह तब होता है जब आप अभिभूत महसूस करते हैं और लगातार मांगों का सामना नहीं कर पाते।",
        panic:
          "पैनिक अटैक अचानक तीव्र भय की घटना है जो बिना किसी वास्तविक खतरे के गंभीर शारीरिक प्रतिक्रियाएँ उत्पन्न कर सकती है। आप सुरक्षित हैं — यह गुजर जाएगा।",
        mindfulness:
          "माइंडफुलनेस बिना निर्णय के वर्तमान क्षण पर पूरा ध्यान देना है। यह चिंता को कम करने और शांति लाने में मदद करता है।",
        selfcare:
          "सेल्फ-केयर वह कुछ भी है जो आप अपनी मानसिक, भावनात्मक और शारीरिक सेहत का ख्याल रखने के लिए करते हैं। यह स्वार्थी नहीं है — यह आवश्यक है।",
        resilience:
          "लचीलापन कठिन अनुभवों से उबरने की आपकी क्षमता है। यह एक मांसपेशी की तरह है — अभ्यास से मजबूत होता है।",
        boundaries:
          "बाउंड्रीज़ वे सीमाएँ हैं जो आप अपनी भलाई की रक्षा के लिए तय करते हैं। 'ना' कहना एक पूरा वाक्य है और आत्म-सम्मान का एक रूप है।",
        therapy:
          "थेरेपी एक सुरक्षित जगह है जहाँ आप प्रशिक्षित पेशेवर के साथ अपनी सोच और भावनाओं के बारे में बात कर सकते हैं। मदद माँगना ताकत की निशानी है।",
        trigger:
          "ट्रिगर कोई भी चीज़ हो सकती है जो किसी याद या भावनात्मक प्रतिक्रिया को उत्पन्न कर दे — जैसे एक फ्लैशबैक या तीव्र भावना। आप दूर जा सकते हैं।",
        grounding:
          "ग्राउंडिंग तकनीकें आपको वर्तमान में वापस लाने में मदद करती हैं जब आप अभिभूत महसूस करते हैं — 5-4-3-2-1 विधि आज़माएँ।",
        support:
          "आपका समर्थन नेटवर्क उन लोगों को शामिल करता है जो आपकी परवाह करते हैं और चाहते हैं कि आप फलें-फूलें। आपको अकेले इसका सामना करने की जरूरत नहीं है।",
          termAnxiety: "चिंता",
          termDepression: "अवसाद",
          termStress: "तनाव",
          termBurnout: "बर्नआउट",
          termPanic: "पैनिक अटैक",
          termMindfulness: "माइंडफुलनेस",
          termSelfcare: "आत्म-देखभाल",
          termResilience: "लचीलापन",
          termBoundaries: "सीमाएँ",
          termTherapy: "थेरेपी",
          termTrigger: "ट्रिगर",
          termGrounding: "ग्राउंडिंग",
          termSupport: "समर्थन प्रणाली",
        typing1: "आप अकेले नहीं हैं।",
        typing2: "चिकित्सा एक सांस से शुरू होती है।",
        typing3: "आपकी लहर मायने रखती है।",
        footerExplore: "खोजें",
        footerGetHelp: "अब मदद प्राप्त करें",
        footerStayConnected: "जुड़े रहें",
        footerDesc: "मानसिक स्वास्थ्य जागरूकता, शिक्षा, और कोमल समर्थन के लिए एक शांत स्थान।",
        intlHelplines: "अंतरराष्ट्रीय हेल्पलाइन",
        chat988: "988 से चैट करें",
        crisisTextLine: "Crisis Text Line (US) → HOME को 741741 पर टेक्स्ट करें",
        welcomeWave: "लहर में आपका स्वागत है",
        emailDisplay: "hello@wellnesswave.org",
        privacyPolicy: "गोपनीयता नीति",
        termsOfUse: "उपयोग की शर्तें",
    },
    es: {
      navAbout: "Sobre nosotros",
      navResources: "Recursos",
      navTerms: "Términos",
      navTips: "Consejos",
      navContact: "Contacto",
      navSignUp: "Regístrate",
      heroTitle:
        'Surfea la ola<br><span class="highlight">hacia el bienestar</span>',
      heroTagline:
        "Apoyando tu bienestar mental, una respiración y una ola a la vez.",
      heroSubtitle:
        "En Wellness Wave ofrecemos un espacio tranquilo y acogedor para reflexionar, sanar y crecer. Nunca estarás solo en el camino.",
      faqTitle: "Preguntas frecuentes",
      faq1q: "¿Qué es Wellness Wave?",
      faq2q: "¿Es este un servicio de crisis?",
      faq3q: "¿Cómo me mantengo actualizado?",
      faq1a:
        "Wellness Wave es una plataforma de concienciación y recursos de salud mental dedicada a hacer que el bienestar mental sea accesible y comprensible. Ofrecemos información basada en evidencia, herramientas prácticas, estrategias de autocuidado y orientación sobre cuándo y cómo buscar ayuda profesional. Nuestra misión es acompañar a las personas en cualquier etapa de su viaje de salud mental.",
      faq2a:
        "No, Wellness Wave no es un servicio de crisis o emergencia. No ofrecemos asesoramiento inmediato, terapia ni intervención en crisis. Si tú o alguien que conoces está en peligro inmediato o atravesando una crisis de salud mental, por favor contacta de inmediato con un servicio profesional de crisis — por ejemplo, llama al <strong>988</strong> en Estados Unidos.",
      faq3a:
        "Toca <strong>“Regístrate”</strong> arriba. Enviamos suaves consejos mensuales con opción de cancelar en cualquier momento. Síguenos en redes sociales para inspiración diaria, recordatorios e historias de la comunidad.",
      tipsTitle: "Consejos prácticos",
      tipsImmediate: "Técnicas inmediatas",
      tipsDaily: "Hábitos diarios que ayudan",
      tip1: "Técnica 5-4-3-2-1<br>Nombra 5 cosas que ves, 4 que tocas… despacio y con calma.",
      tip2: "Respiración en caja<br>Inhala 4s → Retén 4s → Exhala 4s → Retén 4s. Repite 4 veces.",
      tip3: "Respiraciones lentas<br>Inhala 4, exhala 6 — siente tu abdomen.",
      tip4: "Rutina de sueño<br>Horarios consistentes + ritual de relajación.",
      tip5: "Muévete regularmente<br>Caminatas cortas o yoga suave — 10-30 min la mayoría de días.",
      tip6: "Come e hidrátate regularmente<br>Pequeñas comidas equilibradas.",
      tipsCta: "Comparte tu propio consejo →",
      termsTitle: "Términos comunes de salud mental",
      termsSubtitle: "Toca cualquier término para aprender más de forma calmada y sencilla.",
      contactTitle: "Contacto y Feedback",
      contactSubtitle: "Nos encantaría saber de ti",
      contactName: "Nombre",
      contactEmail: 'Email <span class="optional">(opcional)</span>',
      contactSubject: "Asunto",
      contactMessage: "Mensaje",
      contactConsent:
        "Acepto usar mi cliente de correo y almacenamiento local para demo",
      contactSubmit: "Enviar mensaje",
      contactBack: "← Volver al inicio",
      signupTitle: "Únete a la Ola",
      signupText: "Recibe actualizaciones, consejos y acceso anticipado a nuevos recursos.",
      signupButton: "Mantenerme actualizado",
      signupPlaceholder: "Introduce tu correo",
      privacyNote: "Respetamos tu privacidad. Cancela en cualquier momento.",
      placeholderName: "Tu nombre",
      placeholderEmail: "you@example.com",
      placeholderSubject: "¿De qué se trata?",
      placeholderMessage: "¿Cómo podemos ayudar? Te estamos escuchando.",
        anxiety:
          "La ansiedad es una sensación de preocupación, nerviosismo o inquietud, a menudo sobre algo con un resultado incierto. Es la respuesta natural del cuerpo al estrés.",
        depression:
          "La depresión es más que sentirse triste. Es un trastorno del estado de ánimo que puede afectar cómo te sientes, piensas y realizas las actividades diarias. Está bien no estar bien.",
        stress:
          "El estrés es la respuesta del cuerpo a la presión. Los estreses a corto plazo pueden ayudar al rendimiento, pero el estrés prolongado puede dañar la mente y el cuerpo.",
        burnout:
          "El agotamiento es un estado de cansancio emocional, físico y mental causado por el estrés prolongado. Ocurre cuando te sientes abrumado y no puedes hacer frente a las demandas constantes.",
        panic:
          "Un ataque de pánico es un episodio repentino de miedo intenso que provoca reacciones físicas fuertes cuando no existe un peligro real. Estás a salvo — pasará.",
        mindfulness:
          "La atención plena es prestar atención completa al momento presente sin juzgar. Ayuda a reducir la ansiedad y a traer calma.",
        selfcare:
          "El autocuidado es cualquier cosa que hagas para cuidar tu salud mental, emocional y física. No es egoísta, es necesario.",
        resilience:
          "La resiliencia es tu capacidad para recuperarte de experiencias difíciles. Es como un músculo: se fortalece con la práctica.",
        boundaries:
          "Los límites son las fronteras que estableces para proteger tu bienestar. Decir 'no' es una frase completa y una forma de respeto propio.",
        therapy:
          "La terapia es un espacio seguro para hablar con un profesional formado sobre tus pensamientos y sentimientos. Pedir ayuda es una señal de fortaleza.",
        trigger:
          "Un desencadenante es cualquier cosa que provoque una memoria o respuesta emocional, como un flashback o una emoción intensa. Puedes apartarte si lo necesitas.",
        grounding:
          "Las técnicas de grounding te ayudan a volver al momento presente cuando te sientes abrumado. Prueba el método 5-4-3-2-1.",
        support:
          "Tu sistema de apoyo incluye a las personas que se preocupan por ti y quieren que prosperes. No tienes que afrontarlo solo.",
          termAnxiety: "Ansiedad",
          termDepression: "Depresión",
          termStress: "Estrés",
          termBurnout: "Agotamiento",
          termPanic: "Ataque de pánico",
          termMindfulness: "Atención plena",
          termSelfcare: "Autocuidado",
          termResilience: "Resiliencia",
          termBoundaries: "Límites",
          termTherapy: "Terapia",
          termTrigger: "Desencadenante",
          termGrounding: "Enraizamiento",
          termSupport: "Sistema de apoyo",
        typing1: "No estás solo.",
        typing2: "La sanación comienza con una respiración.",
        typing3: "Tu ola importa.",
        footerExplore: "Explorar",
        footerGetHelp: "Obtener ayuda ahora",
        footerStayConnected: "Mantente conectado",
        footerDesc:
          "Un espacio calmado para la concienciación, la educación y el apoyo suave en salud mental.",
        intlHelplines: "Líneas de ayuda internacionales",
        chat988: "Chatea con 988",
        crisisTextLine: "Línea de texto de crisis (EE. UU.) → Envía HOME al 741741",
        welcomeWave: "Bienvenido a la Ola",
        emailDisplay: "hello@wellnesswave.org",
        privacyPolicy: "Política de privacidad",
        termsOfUse: "Términos de uso",
    },
    fr: {
      navAbout: "À propos",
      navResources: "Ressources",
      navTerms: "Termes",
      navTips: "Astuces",
      navContact: "Contact",
      navSignUp: "S’inscrire",
      heroTitle:
        'Chevauchez la vague<br><span class="highlight">vers le bien-être</span>',
      heroTagline:
        "Accompagner votre santé mentale, une respiration et une vague à la fois.",
      heroSubtitle:
        "Chez Wellness Wave, nous offrons un espace calme et accueillant pour réfléchir, guérir et grandir. Vous ne serez jamais seul.",
      faqTitle: "Questions fréquentes",
      faq1q: "Qu’est-ce que Wellness Wave ?",
      faq2q: "Est-ce un service de crise ?",
      faq3q: "Comment rester informé ?",
      faq1a:
        "Wellness Wave est une plateforme de sensibilisation et de ressources en santé mentale dédiée à rendre le bien-être mental accessible et compréhensible. Nous proposons des informations fondées sur des preuves, des outils pratiques, des stratégies d’auto-soin et des conseils sur le moment et la manière de consulter un professionnel. Notre mission est d’accompagner chacun là où il se trouve dans son parcours de santé mentale.",
      faq2a:
        "Non, Wellness Wave n’est pas un service de crise ou d’urgence. Nous ne proposons pas de counseling immédiat, de thérapie ou d’intervention en cas de crise. Si vous ou une personne que vous connaissez êtes en danger immédiat ou traversez une crise de santé mentale, veuillez contacter immédiatement un service professionnel de crise — par exemple, composez le <strong>988</strong> aux États-Unis.",
      faq3a:
        "Appuyez sur <strong>“S’inscrire”</strong> ci-dessus. Nous envoyons de doux conseils mensuels avec désinscription facile. Suivez-nous sur les réseaux sociaux pour des inspirations quotidiennes, des rappels et des histoires de la communauté.",
      tipsTitle: "Conseils pratiques",
      tipsImmediate: "Techniques immédiates",
      tipsDaily: "Habitudes quotidiennes utiles",
      tip1: "Ancrage 5-4-3-2-1<br>Nommez lentement 5 choses que vous voyez…",
      tip2: "Respiration carrée<br>Inspirez 4s → Retenez 4s → Expirez 4s → Retenez 4s.",
      tip3: "Respiration abdominale lente<br>Inspirez 4, expirez 6.",
      tip4: "Routine de sommeil<br>Heures régulières + rituel de détente.",
      tip5: "Bougez régulièrement<br>Marches courtes ou yoga doux 10-30 min.",
      tip6: "Mangez et hydratez-vous régulièrement<br>Petits repas équilibrés.",
      tipsCta: "Partagez votre propre astuce →",
      termsTitle: "Termes courants en santé mentale",
      termsSubtitle: "Appuyez sur un terme pour en savoir plus de manière calme et simple.",
      contactTitle: "Contact & Feedback",
      contactSubtitle: "Nous serions ravis de vous lire",
      contactName: "Nom",
      contactEmail: 'Email <span class="optional">(facultatif)</span>',
      contactSubject: "Sujet",
      contactMessage: "Message",
      contactConsent:
        "J’accepte l’utilisation de mon client mail et du stockage local (démo)",
      contactSubmit: "Envoyer",
      contactBack: "← Retour à l’accueil",
      signupTitle: "Rejoignez la Vague",
      signupText: "Recevez des mises à jour, astuces et un accès anticipé aux nouvelles ressources.",
      signupButton: "Tenez‑moi au courant",
      signupPlaceholder: "Entrez votre e‑mail",
      privacyNote: "Nous respectons votre vie privée. Désabonnez‑vous à tout moment.",
      placeholderName: "Votre nom",
      placeholderEmail: "you@example.com",
      placeholderSubject: "De quoi s'agit‑il ?",
      placeholderMessage: "Comment pouvons‑nous aider ? Nous sommes à l'écoute.",
        anxiety:
          "L'anxiété est un sentiment d'inquiétude, de nervosité ou de malaise — souvent lié à quelque chose dont l'issue est incertaine. C'est la réponse naturelle du corps au stress.",
        depression:
          "La dépression n'est pas seulement le fait de se sentir triste. C'est un trouble de l'humeur qui peut affecter la façon dont vous ressentez, pensez et gérez les activités quotidiennes. Il est normal de ne pas aller bien.",
        stress:
          "Le stress est la réponse du corps à la pression. Des poussées de stress peuvent aider à la performance, mais un stress prolongé peut nuire au corps et à l'esprit.",
        burnout:
          "L'épuisement professionnel est un état d'épuisement émotionnel, physique et mental causé par un stress prolongé. Il survient lorsque vous vous sentez dépassé et incapable de répondre aux demandes constantes.",
        panic:
          "Une attaque de panique est un épisode soudain de peur intense qui déclenche de fortes réactions physiques en l'absence de danger réel. Vous êtes en sécurité — cela passera.",
        mindfulness:
          "La pleine conscience consiste à porter une attention totale au moment présent, sans jugement. Elle aide à réduire l'anxiété et à apporter du calme.",
        selfcare:
          "Les soins personnels regroupent tout ce que vous faites pour prendre soin de votre santé mentale, émotionnelle et physique. Ce n'est pas égoïste — c'est nécessaire.",
        resilience:
          "La résilience est votre capacité à rebondir après des expériences difficiles. C'est comme un muscle — elle se renforce avec la pratique.",
        boundaries:
          "Les limites sont des barrières que vous posez pour protéger votre bien‑être. Dire « non » est une phrase complète et une forme de respect de soi.",
        therapy:
          "La thérapie est un espace sûr pour parler avec un professionnel formé de vos pensées et sentiments. Demander de l'aide est une preuve de force.",
        trigger:
          "Un déclencheur est tout ce qui provoque un souvenir ou une réaction émotionnelle — comme un flashback ou une émotion intense. Vous pouvez vous éloigner si nécessaire.",
        grounding:
          "Les techniques d'ancrage vous aident à revenir au moment présent lorsque vous êtes submergé. Essayez la méthode 5-4-3-2-1.",
        support:
          "Votre réseau de soutien comprend les personnes qui se soucient de vous et qui veulent que vous vous épanouissiez. Vous n'avez pas à faire face seul.",
          termAnxiety: "Anxiété",
          termDepression: "Dépression",
          termStress: "Stress",
          termBurnout: "Épuisement",
          termPanic: "Crise de panique",
          termMindfulness: "Pleine conscience",
          termSelfcare: "Soin de soi",
          termResilience: "Résilience",
          termBoundaries: "Limites",
          termTherapy: "Thérapie",
          termTrigger: "Déclencheur",
          termGrounding: "Ancrage",
          termSupport: "Réseau de soutien",
        typing1: "Vous n'êtes pas seul.",
        typing2: "La guérison commence par une respiration.",
        typing3: "Votre vague compte.",
        footerExplore: "Explorer",
        footerGetHelp: "Obtenir de l'aide",
        footerStayConnected: "Restez connecté",
        footerDesc:
          "Un espace apaisant pour la sensibilisation, l'éducation et un soutien bienveillant en santé mentale.",
        intlHelplines: "Lignes d'assistance internationales",
        chat988: "Discuter avec 988",
        crisisTextLine: "Ligne de texte de crise (US) → Envoyez HOME au 741741",
        welcomeWave: "Bienvenue sur la Vague",
        emailDisplay: "hello@wellnesswave.org",
        privacyPolicy: "Politique de confidentialité",
        termsOfUse: "Conditions d'utilisation",
    },
    tl: {
      navAbout: "Tungkol sa Amin",
      navResources: "Mga Mapagkukunan",
      navTerms: "Mga Termino",
      navTips: "Mga Tip",
      navContact: "Makipag-ugnayan",
      navSignUp: "Mag-sign Up",
      heroTitle: 'Sakay ang Alon<br><span class="highlight">Patungo sa Kabutihan</span>',
      heroTagline: "Sinusuportahan ang iyong kalusugan ng isip, isang hinga at isang alon sa bawat pagkakataon.",
      heroSubtitle:
        "Sa Wellness Wave, nag-aalok kami ng tahimik at malugod na espasyo para magnilay, maghilom, at lumago. Hindi ka nag-iisa sa paglalakbay.",
      faqTitle: "Mga Karaniwang Tanong",
      faq1q: "Ano ang Wellness Wave?",
      faq2q: "Serbisyong pang-krisis ba ito?",
      faq3q: "Paano ako makakakuha ng updates?",
      faq1a:
        "Ang Wellness Wave ay isang plataporma para sa kamalayan at mga mapagkukunan sa kalusugan ng isip na naglalayong gawing mas madaling maunawaan at ma-access ang kabutihang pangkaisipan. Nagbibigay kami ng impormasyon batay sa ebidensya, praktikal na mga kasangkapan, estratehiya ng pag-aalaga sa sarili, at gabay kung kailan at paano humingi ng propesyonal na tulong.",
      faq2a:
        "Hindi. Ang Wellness Wave ay hindi isang serbisyo sa krisis o emergency. Hindi kami nagbibigay ng agarang counseling, therapy, o intervention sa krisis. Kung ikaw o ang kilala mong tao ay nasa agarang panganib o dumaranas ng krisis sa kalusugan ng isip, makipag-ugnayan kaagad sa propesyonal na serbisyo sa krisis — halimbawa, tumawag sa <strong>988</strong> sa Estados Unidos.",
      faq3a:
        "Pindutin ang <strong>“Mag-sign Up”</strong> sa itaas. Nagpapadala kami ng banayad na buwanang mga tip na madaling i-unsubscribe. Sundan kami sa social channels para sa araw-araw na inspirasyon at kwento mula sa komunidad.",
      tipsTitle: "Praktikal na mga Tip sa Pagharap",
      tipsImmediate: "Mga Agarang Teknik",
      tipsDaily: "Araw-araw na Mga Gawi na Nakakatulong",
      tip1:
        "5-4-3-2-1 Grounding<br>Pangalanan ang 5 bagay na nakikita mo, 4 na mahahawakan, 3 na naririnig, 2 na naaamoy, 1 na matitikman — dahan-dahan.",
      tip2: "Box Breathing<br>Hinga 4s → Hawak 4s → Huminga palabas 4s → Hawak 4s. Ulitin ng 4 na ikot.",
      tip3: "Slow Belly Breaths<br>Hinga nang 4, huminga palabas nang 6 — damhin ang pag-alsa at pagbaba ng tiyan.",
      tip4:
        "Consistent Sleep Routine<br>Parehong oras ng tulog at gising + ritwal bago matulog (limitahan ang screen 30–60 min bago matulog).",
      tip5:
        "Move Your Body<br>Maikling paglalakad, pag-unat, o banayad na yoga — 10–30 min karamihan ng mga araw ay nakakatulong.",
      tip6: "Eat & Hydrate Regularly<br>Maliit na balanseng pagkain + tubig para panatilihing steady ang enerhiya.",
      tipsCta: "Ibahagi ang Iyong Tip →",
      contactTitle: "Makipag-ugnayan & Feedback",
      contactSubtitle: "Gusto naming marinig mula sa iyo",
      contactName: "Pangalan",
      contactEmail: 'Email <span class="optional">(opsyonal)</span>',
      contactSubject: "Paksa",
      contactMessage: "Mensahe",
      contactConsent:
        "Sang-ayon ako sa paggamit ng aking email client at lokal na storage para sa demo purposes.",
      contactSubmit: "Ipadala ang Mensahe",
      contactBack: "← B balik sa Home",
      signupTitle: "Sumali sa Alon",
      signupText: "Kumuha ng updates, tip, at maagang access sa mga bagong mapagkukunan.",
      signupButton: "I-update Ako",
      signupPlaceholder: "Ilagay ang iyong email",
      privacyNote: "Iginagalang namin ang iyong privacy. Maaari mag-unsubscribe anumang oras.",
      placeholderName: "Ang iyong pangalan",
      placeholderEmail: "you@example.com",
      placeholderSubject: "Ano ang tungkol dito?",
      placeholderMessage: "Paano kami makakatulong? Nakikinig kami.",
      termsTitle: "Mga Karaniwang Termino sa Kalusugang Pangkaisipan",
      termsSubtitle: "Pindutin ang anumang termino para matuto nang higit pa sa isang kalmado at simpleng paraan",
      anxiety:
        "Ang pagkabalisa ay isang pakiramdam ng pag-aalala, nerbiyos, o hindi pag-kasiguro — madalas tungkol sa isang hindi tiyak na kinalabasan. Ito ay likas na tugon ng katawan sa stress.",
      depression:
        "Ang depresyon ay hindi lamang malungkot; ito ay isang mood disorder na maaaring makaapekto sa kung paano ka nakakaramdam, nag-iisip, at gumaganap sa araw-araw. Ok lang kung hindi ka ok.",
      stress:
        "Ang stress ay tugon ng katawan sa pressure. Ang panandaliang stress ay maaaring makatulong sa pagganap, ngunit ang pangmatagalang stress ay makakasama sa isip at katawan.",
      burnout:
        "Ang burnout ay isang kalagayan ng emosyonal, pisikal, at mental na pagkaubos na dulot ng matagal na stress. Nangyayari ito kapag nakakaramdam kang overwhelmed at hindi na makakasabay sa mga hinihingi.",
      panic:
        "Ang panic attack ay biglaang episode ng matinding takot na nagdudulot ng malakas na pisikal na reaksyon kahit walang totoong panganib. Ligtas ka — lilipas din ito.",
      mindfulness:
        "Ang mindfulness ay ang pagbibigay ng buong pansin sa kasalukuyang sandali nang walang paghuhusga. Nakakatulong ito na bawasan ang pagkabalisa at magdala ng kapanatagan.",
      selfcare:
        "Ang self-care ay anumang ginagawa mo upang alagaan ang iyong mental, emosyonal, at pisikal na kalusugan. Hindi ito makasarili — kailangan ito.",
      resilience:
        "Ang resilience ay ang kakayahan mong makabangon mula sa mahihirap na karanasan. Ito ay parang kalamnan — lumalakas sa pag-practice.",
      boundaries:
        "Ang boundaries ay mga limitasyong itinakda mo upang protektahan ang iyong kapakanan. Ang pagsabi ng 'hindi' ay isang buong pangungusap at isang anyo ng paggalang sa sarili.",
      therapy:
        "Ang therapy ay isang ligtas na espasyo upang makipag-usap sa isang sinanay na propesyonal tungkol sa iyong mga iniisip at nararamdaman. Ang paghingi ng tulong ay tanda ng lakas.",
      trigger:
        "Ang trigger ay anumang nagpapasiklab ng alaala o emosyonal na tugon — tulad ng flashback o matinding damdamin. Pinahihintulutan kang lumayo kung kinakailangan.",
      grounding:
        "Ang grounding techniques ay tumutulong ibalik ka sa kasalukuyan kapag nakakaramdam ng pagka-overwhelm. Subukan ang 5-4-3-2-1 method.",
      support:
        "Kasama sa iyong support system ang mga taong nagmamalasakit sa iyo at nais kang umunlad. Hindi mo kailangang harapin ito nang mag-isa.",
      termAnxiety: "Pagkabalisa",
      termDepression: "Depresyon",
      termStress: "Stress",
      termBurnout: "Pagkapagod",
      termPanic: "Panic Attack",
      termMindfulness: "Mindfulness",
      termSelfcare: "Pangangalaga sa Sarili",
      termResilience: "Resilience",
      termBoundaries: "Mga Hangganan",
      termTherapy: "Therapy",
      termTrigger: "Trigger",
      termGrounding: "Grounding",
      termSupport: "Support System",
      typing1: "Hindi ka nag-iisa.",
      typing2: "Nagsisimula ang paggaling sa isang hinga.",
      typing3: "Mahalaga ang iyong alon.",
      footerExplore: "Galugarin",
      footerGetHelp: "Kumuha ng Tulong Ngayon",
      footerStayConnected: "Manatiling Konektado",
      footerDesc:
        "Isang kalmadong espasyo para sa kamalayan sa kalusugang pangkaisipan, edukasyon, at banayad na suporta.",
      intlHelplines: "Mga Internasyonal na Helpline",
      chat988: "Makipag-chat sa 988",
      crisisTextLine: "Crisis Text Line (US) → I-text ang HOME sa 741741",
      welcomeWave: "Maligayang pagdating sa Alon",
      emailDisplay: "hello@wellnesswave.org",
      privacyPolicy: "Patakaran sa Privacy",
      termsOfUse: "Mga Tuntunin ng Paggamit",
    },
    ar: {
      navAbout: "حول",
      navResources: "الموارد",
      navTerms: "مصطلحات",
      navTips: "نصائح",
      navContact: "تواصل",
      navSignUp: "اشترك",
      heroTitle: 'اركب الموجة<br><span class="highlight">نحو العافية</span>',
      heroTagline: "ندعم سلامتك النفسية، نفسًا تلو الآخر وموجة تلو الأخرى.",
      heroSubtitle:
        "في Wellness Wave، نقدم مساحة هادئة ومرحبة للتأمل والشفاء والنمو. لن تواجه الرحلة وحدك أبدًا.",
      faqTitle: "الأسئلة الشائعة",
      faq1q: "ما هو Wellness Wave؟",
      faq2q: "هل هذه خدمة أزمات؟",
      faq3q: "كيف أبقى على اطلاع؟",
      faq1a:
        "ويلنس ويف هي منصة توعية وموارد للصحة النفسية مكرسة لجعل العافية النفسية في متناول الجميع ومفهومة. نقدم معلومات قائمة على الأدلة، أدوات عملية، استراتيجيات العناية الذاتية، وإرشادات حول متى وكيف يجب طلب المساعدة المهنية. مهمتنا هي مقابلة الناس أينما كانوا في رحلة صحتهم النفسية.",
      faq2a:
        "لا، ويلنس ويف ليست خدمة أزمات أو طوارئ. نحن لا نقدم استشارات فورية أو علاجًا نفسيًا أو تدخلًا في الأزمات. إذا كنت أنت أو أحد تعرفه في خطر فوري أو يمر بأزمة صحية نفسية، يرجى التواصل فورًا مع خدمة أزمات مهنية — على سبيل المثال، اتصل برقم <strong>988</strong> في الولايات المتحدة.",
      faq3a:
        "اضغط <strong>“اشترك”</strong> أعلاه. نرسل نصائح لطيفة شهرية مع إمكانية إلغاء الاشتراك بسهولة. تابعينا على قنوات التواصل الاجتماعي للحصول على رؤى يومية وتذكيرات وقصص المجتمع.",
      tipsTitle: "نصائح عملية للتعامل",
      tipsImmediate: "تقنيات فورية",
      tipsDaily: "عادات يومية مفيدة",
      tip1: "تقنية 5-4-3-2-1<br>سمِّ 5 أشياء تراها، 4 تلمسها… ببطء وهدوء.",
      tip2: "تنفس الصندوق<br>شهيق 4 ث → حبس 4 ث → زفير 4 ث → حبس 4 ث.",
      tip3: "تنفس البطن البطيء<br>شهيق 4، زفير 6 — ركز على البطن.",
      tip4: "روتين نوم منتظم<br>أوقات ثابتة + طقوس استرخاء.",
      tip5: "حرك جسمك بانتظام<br>مشي قصير أو يوغا خفيفة 10-30 دقيقة.",
      tip6: "تناول الطعام والترطيب بانتظام<br>وجبات صغيرة متوازنة.",
      tipsCta: "شارك نصيحتك الخاصة →",
      termsTitle: "مصطلحات الصحة النفسية الشائعة",
      termsSubtitle: "اضغط على أي مصطلح لتتعلم المزيد بطريقة هادئة وبسيطة",
      contactTitle: "تواصل وملاحظات",
      contactSubtitle: "نود سماع رأيك",
      contactName: "الاسم",
      contactEmail: 'البريد الإلكتروني <span class="optional">(اختياري)</span>',
      contactSubject: "الموضوع",
      contactMessage: "الرسالة",
      contactConsent:
        "أوافق على استخدام عميل البريد والتخزين المحلي (لأغراض العرض)",
      contactSubmit: "إرسال الرسالة",
      contactBack: "← العودة للرئيسية",
      signupTitle: "انضم إلى الموجة",
      signupText: "احصل على التحديثات والنصائح والوصول المبكر إلى الموارد الجديدة.",
      signupButton: "أبقني محدثًا",
      signupPlaceholder: "أدخل بريدك الإلكتروني",
      privacyNote: "نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.",
      placeholderName: "اسمك",
      placeholderEmail: "you@example.com",
      placeholderSubject: "ما هو موضوع هذا؟",
      placeholderMessage: "كيف يمكننا المساعدة؟ نحن نستمع.",
        anxiety:
          "القلق هو شعور بالقلق أو التوتر أو الاضطراب — غالبًا بسبب شيء نتيجته غير مؤكدة. إنه استجابة الجسم الطبيعية للتوتر.",
        depression:
          "الاكتئاب أكثر من مجرد شعور بالحزن. إنه اضطراب مزاجي يمكن أن يؤثر على مشاعرك وأفكارك وقدرتك على أداء الأنشطة اليومية. لا بأس إن لم تكن بخير.",
        stress:
          "التوتر هو استجابة الجسم للضغط. فترات التوتر القصيرة قد تساعد في الأداء، لكن التوتر المطوّل قد يضر العقل والجسم.",
        burnout:
          "الاحتراق الوظيفي حالة من الإرهاق العاطفي والجسدي والعقلي ناتجة عن التوتر المطوّل. يحدث عندما تشعر بالإرهاق وعدم القدرة على تلبية المطالب المستمرة.",
        panic:
          "نوبة هلع هي حلقة مفاجئة من الخوف الشديد تثير ردود فعل جسدية قوية دون وجود خطر حقيقي. أنت بأمان — ستمرّ.",
        mindfulness:
          "اليقظة الذهنية هي الانتباه الكامل للحظة الحاضرة دون حكم. تساعد على تقليل القلق وجلب الهدوء.",
        selfcare:
          "العناية الذاتية هي أي شيء تفعله لرعاية صحتك النفسية والعاطفية والجسدية. ليست أنانية — إنها ضرورية.",
        resilience:
          "المرونة هي قدرتك على التعافي من التجارب الصعبة. إنها مثل العضلة — تصبح أقوى بالممارسة.",
        boundaries:
          "الحدود هي القيود التي تضعها لحماية رفاهيتك. قول «لا» جملة كاملة وشكل من أشكال احترام الذات.",
        therapy:
          "العلاج هو مساحة آمنة للتحدث مع محترف مدرّب عن أفكارك ومشاعرك. طلب المساعدة علامة قوة.",
        trigger:
          "المُثير هو أي شيء يُشعل ذكرى أو استجابة عاطفية — مثل استرجاع مفاجئ أو شعور شديد. لك الحق في الابتعاد.",
        grounding:
          "تقنيات التأريض تساعدك على العودة إلى الحاضر عندما تشعر بالإرهاق. جرّب طريقة 5-4-3-2-1.",
        support:
          "شبكة الدعم الخاصة بك تشمل الأشخاص الذين يهتمون لأمرك ويريدون ازدهارك. لست مضطرًا لمواجهة الأمور وحدك.",
          termAnxiety: "القلق",
          termDepression: "الاكتئاب",
          termStress: "التوتر",
          termBurnout: "الاحتراق النفسي",
          termPanic: "نوبة هلع",
          termMindfulness: "اليقظة الذهنية",
          termSelfcare: "الرعاية الذاتية",
          termResilience: "المرونة",
          termBoundaries: "الحدود",
          termTherapy: "العلاج",
          termTrigger: "المُثير",
          termGrounding: "التأريض",
          termSupport: "شبكة الدعم",
        typing1: "لست وحدك.",
        typing2: "الشفاء يبدأ بتنفس واحد.",
        typing3: "موجتك مهمة.",
        footerExplore: "استكشف",
        footerGetHelp: "اطلب المساعدة الآن",
        footerStayConnected: "ابقَ على تواصل",
        footerDesc:
          "مساحة هادئة للتوعية بالصحة النفسية والتعليم والدعم اللطيف.",
        intlHelplines: "خطوط المساعدة الدولية",
        chat988: "الدردشة مع 988",
        crisisTextLine: "خط النص للطوارئ (الولايات المتحدة) → أرسل HOME إلى 741741",
        welcomeWave: "مرحبًا بك في الموجة",
        emailDisplay: "hello@wellnesswave.org",
        privacyPolicy: "سياسة الخصوصية",
        termsOfUse: "شروط الاستخدام",
    },
  };

  // LANGUAGE SWITCHER
  /*
    Language selector handling:
    - Renders a compact `<select>` into the nav when a specific
      nav placeholder exists (element with `data-lang`).
    - Loads saved preference from localStorage and applies it.
    - Persists changes back into localStorage so the preference
      survives reloads.
    - Uses `applyTranslations(lang)` to perform the DOM replacements.
  */
  const langLink = document.querySelector(".nav-link[data-lang]");
  if (langLink) {
    const languages = [
      { code: "en", label: "English" },
      { code: "zh", label: "中文" },
      { code: "hi", label: "हिंदी" },
      { code: "es", label: "Español" },
      { code: "fr", label: "Français" },
      { code: "ar", label: "العربية" },
      { code: "tl", label: "Tagalog" },
    ];

    // Sort alphabetically by the visible label (using English locale for consistent ordering)
    languages.sort((a, b) => a.label.localeCompare(b.label, "en", { sensitivity: "base" }));

    langLink.innerHTML = `<select id="langSelect" aria-label="Select language" style="background:transparent;border:none;color:#323962;font:inherit;font-size:1.2rem;font-weight:500;cursor:pointer;"></select>`;

    const select = document.getElementById("langSelect");
    languages.forEach((l) => {
      const opt = document.createElement("option");
      opt.value = l.code;
      opt.textContent = l.label;
      select.appendChild(opt);
    });

    const saved = localStorage.getItem("wellnessLang") || "en";
    select.value = saved;
    document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = saved;

    select.addEventListener("change", () => {
      const lang = select.value;
      localStorage.setItem("wellnessLang", lang);
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
      applyTranslations(lang);
    });

    applyTranslations(saved);
  }

  // FULL applyTranslations
  /*
    applyTranslations(lang)
    - Single place responsible for mapping translation keys to DOM nodes.
    - Uses safe element checks (if (el) ...) so it can run on any page
      in the site without failing when a target node doesn't exist.
    - Sets textContent for plain text and innerHTML for controlled
      HTML fragments (e.g., strings containing <strong> tags).
    - Handles RTL direction switching for `ar` and preserves logical
      fallbacks when keys are missing (falls back to English).
    Notes:
    - Keep transformations idempotent: calling applyTranslations twice
      with the same language should be a no-op.
    - Avoid inserting user-provided content directly via innerHTML.
  */
  function applyTranslations(lang) {
    const t = translations[lang] || translations.en;

    // Hero
    const heroH1 = document.querySelector(".hero h1");
    if (heroH1) heroH1.innerHTML = t.heroTitle;
    const tagline = document.querySelector(".tagline");
    if (tagline) tagline.textContent = t.heroTagline;
    const subtitle = document.querySelector(".subtitle");
    if (subtitle) subtitle.textContent = t.heroSubtitle;

    // Typing tagline (footer)
    const typing = document.querySelectorAll(".typing");
    if (typing[0]) typing[0].textContent = t.typing1 || "";
    if (typing[1]) typing[1].textContent = t.typing2 || "";
    if (typing[2]) typing[2].textContent = t.typing3 || "";

    // Nav links
    const navLinks = document.querySelectorAll(".nav-link");
    if (navLinks[1]) navLinks[1].textContent = t.navAbout;
    if (navLinks[2]) navLinks[2].textContent = t.navResources;
    if (navLinks[3]) navLinks[3].textContent = t.navTerms;
    if (navLinks[4]) navLinks[4].textContent = t.navTips;
    if (navLinks[5]) navLinks[5].textContent = t.navContact;

    // Signup button label (localized) — updated by updateSignupButtons()
    const signupBtnLabel = document.querySelector(".signup-btn");
    if (signupBtnLabel) {
      /* placeholder; updateSignupButtons() will set the correct text */
    }

    // FAQ
    const faqTitle = document.querySelector(".faq-title");
    if (faqTitle) faqTitle.textContent = t.faqTitle;

    document.querySelectorAll(".faq-question > span").forEach((span, i) => {
      const key = `faq${i + 1}q`;
      if (t[key]) span.textContent = t[key];
    });
    const answers = document.querySelectorAll(".faq-answer p");
    if (answers[0]) answers[0].innerHTML = t.faq1a;
    if (answers[1]) answers[1].innerHTML = t.faq2a;
    if (answers[2]) answers[2].innerHTML = t.faq3a;

    // Tips section
    const tipsTitle = document.querySelector(".tips-section .section-title");
    if (tipsTitle) tipsTitle.textContent = t.tipsTitle;

    const tipHeaders = document.querySelectorAll(".tip-card h3");
    if (tipHeaders[0]) tipHeaders[0].textContent = t.tipsImmediate;
    if (tipHeaders[1]) tipHeaders[1].textContent = t.tipsDaily;

    const tipItems = document.querySelectorAll(".tip-list li");
    if (tipItems[0]) tipItems[0].innerHTML = t.tip1;
    if (tipItems[1]) tipItems[1].innerHTML = t.tip2;
    if (tipItems[2]) tipItems[2].innerHTML = t.tip3;
    if (tipItems[3]) tipItems[3].innerHTML = t.tip4;
    if (tipItems[4]) tipItems[4].innerHTML = t.tip5;
    if (tipItems[5]) tipItems[5].innerHTML = t.tip6;

    const tipCta = document.querySelector(".tip-cta a");
    if (tipCta) tipCta.textContent = t.tipsCta;

    // Terms section title
    const termsTitle = document.querySelector(".terms-section .section-title");
    if (termsTitle) termsTitle.textContent = t.termsTitle;
    const termsSubtitle = document.querySelector(
      ".terms-section .section-subtitle"
    );
    if (termsSubtitle) termsSubtitle.textContent = t.termsSubtitle;

    // Term button labels (bubbles)
    document.querySelectorAll(".term-btn").forEach((btn) => {
      const term = btn.dataset.term;
      if (!term) return;
      const key = `term${term.charAt(0).toUpperCase() + term.slice(1)}`;
      if (t[key]) btn.textContent = t[key];
    });

    // Footer headings, links, and description
    const footerH4s = document.querySelectorAll(".site-footer .footer-col h4");
    if (footerH4s[0]) footerH4s[0].textContent = t.footerExplore || "Explore";
    if (footerH4s[1]) footerH4s[1].textContent = t.footerGetHelp || "Get Help Now";
    if (footerH4s[2]) footerH4s[2].textContent = t.footerStayConnected || "Stay Connected";

    const footerCols = document.querySelectorAll(".site-footer .footer-col");
    if (footerCols[0]) {
      const links = footerCols[0].querySelectorAll("a");
      if (links[0]) links[0].textContent = t.navAbout;
      if (links[1]) links[1].textContent = t.navResources;
      if (links[2]) links[2].textContent = t.termsTitle || "Common Terms";
      if (links[3]) links[3].textContent = t.tipsTitle || "Coping Tips";
      if (links[4]) links[4].textContent = t.navContact;
    }
    if (footerCols[1]) {
      const links = footerCols[1].querySelectorAll("a");
      if (links[0]) links[0].textContent = t.intlHelplines || "International Helplines";
      if (links[1]) links[1].textContent = t.chat988 || "Chat with 988";
      if (links[2]) links[2].textContent = t.crisisTextLine || "Crisis Text Line (US) → Text HOME to 741741";
    }
    if (footerCols[2]) {
      const links = footerCols[2].querySelectorAll("a");
      if (links[0]) links[0].textContent = t.welcomeWave || "Welcome to the Wave";
      if (links[1]) links[1].textContent = t.emailDisplay || "hello@wellnesswave.org";
      if (links[2]) links[2].textContent = t.privacyPolicy || "Privacy Policy";
      if (links[3]) links[3].textContent = t.termsOfUse || "Terms of Use";
    }

    const footerDescEl = document.querySelector(".footer-desc");
    if (footerDescEl) footerDescEl.textContent = t.footerDesc || "";

    // Contact page
    if (document.querySelector("main h1")) {
      document.querySelector("main h1").textContent = t.contactTitle;
      const sub = document.querySelector("main > div > p");
      if (sub) sub.textContent = t.contactSubtitle;
      const nameLabel = document.querySelector('label[for="name"]');
      if (nameLabel) nameLabel.textContent = t.contactName;
      const emailLabel = document.querySelector('label[for="email"]');
      if (emailLabel) emailLabel.innerHTML = t.contactEmail;
      const subjectLabel = document.querySelector('label[for="subject"]');
      if (subjectLabel) subjectLabel.textContent = t.contactSubject;
      const messageLabel = document.querySelector('label[for="message"]');
      if (messageLabel) messageLabel.textContent = t.contactMessage;

      // placeholders
      const nameInput = document.getElementById("name");
      if (nameInput) nameInput.placeholder = t.placeholderName || "";
      const emailInput = document.getElementById("email");
      if (emailInput) emailInput.placeholder = t.placeholderEmail || "";
      const subjectInput = document.getElementById("subject");
      if (subjectInput) subjectInput.placeholder = t.placeholderSubject || "";
      const messageInput = document.getElementById("message");
      if (messageInput) messageInput.placeholder = t.placeholderMessage || "";

      // consent label: preserve checkmark span
      const consentInput = document.getElementById("consent");
      const consentLabel = consentInput ? consentInput.closest("label") : null;
      if (consentLabel)
        consentLabel.innerHTML = '<span class="checkmark" aria-hidden="true"></span>' + (t.contactConsent || "");

      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.textContent = t.contactSubmit;
      const backLink = document.querySelector('p a[href="index.html"]');
      if (backLink) backLink.textContent = t.contactBack;
    }
    // Signup modal localization
    const signupTitleEl = document.getElementById("signupTitle");
    if (signupTitleEl) signupTitleEl.textContent = t.signupTitle || "";
    const signupPara = document.querySelector("#signupModal .modal p:not(.privacy-note)");
    if (signupPara) signupPara.textContent = t.signupText || "";
    const signupEmailInput = document.getElementById("signupEmail");
    if (signupEmailInput) signupEmailInput.placeholder = t.signupPlaceholder || t.placeholderEmail || "";
    const signupSubmitBtn = document.querySelector("#signupModal form button[type='submit']");
    if (signupSubmitBtn) signupSubmitBtn.textContent = t.signupButton || "";
    const privacyNoteEl = document.querySelector("#signupModal .privacy-note");
    if (privacyNoteEl) privacyNoteEl.textContent = t.privacyNote || "";

    if (typeof updateSignupButtons === "function") updateSignupButtons();
  }

  // TERM MODAL: definitions viewer
  /*
    The term modal displays short definitions when term buttons are
    clicked. Definitions are provided by translations (same keys as
    the term buttons) so they are localized alongside the rest of the UI.
    openTermModal(title, text) focuses the modal and prevents body scroll.
  */
  const termModal = document.getElementById("termModal");
  const termTitle = document.getElementById("termTitle");
  const termDefinition = document.getElementById("termDefinition");

  // Open term modal
  function openTermModal(title, text) {
    termTitle.textContent = title;
    termDefinition.innerHTML = text.replace(/\n/g, "<br>");
    termModal.removeAttribute("hidden");
    termModal.classList.add("show");
    termModal.querySelector(".modal").focus();
    document.body.style.overflow = "hidden";
  }

  // Close term modal
  function closeTermModal() {
    termModal.classList.remove("show");
    setTimeout(() => termModal.setAttribute("hidden", ""), 400);
    document.body.style.overflow = "";
  }

  // Event listeners for term modal
  termModal?.addEventListener("click", (e) => {
    if (e.target === termModal) closeTermModal();
  });
  termModal
    ?.querySelector(".modal-close")
    ?.addEventListener("click", closeTermModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && termModal?.classList.contains("show")) {
      closeTermModal();
    }
  });

  // Update term buttons - Urgent Nick
  document.querySelectorAll(".term-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const term = btn.dataset.term;
      const title = btn.textContent.trim();
      const lang = document.getElementById("langSelect")?.value || "en";
      const text =
        translations[lang][term] ||
        translations.en[term] ||
        "Definition whenever.";

      openTermModal(title, text);
    });
  });

  // Reset modal back to signup when closed
  /*
    After the user closes any modal content that may have replaced the
    signup form (for example, a post-signup message), this restores the
    modal back to its original signup state. We use a short timeout to
    let CSS hide animations finish before we mutate inner text and show
    the form again.
  */
  const originalCloseModal = closeModal;
  closeModal = function () {
    originalCloseModal();
    setTimeout(() => {
      const lang = document.getElementById("langSelect")?.value || localStorage.getItem("wellnessLang") || document.documentElement.lang || "en";
      const t = translations[lang] || translations.en;
      document.querySelector(".modal h3").textContent = t.signupTitle || "Join the Wave";
      document.querySelector(".modal p:not(.privacy-note)").textContent =
        t.signupText || "Get updates, tips, and early access to new resources.";
      document.querySelector(".modal form").style.display = "block";
      document.querySelector(".privacy-note").style.display = "block";
    }, 400);
  };

  // Update signup button(s) based on local state and selected language
  /*
    updateSignupButtons()
    - Reads `wellnessSignedUp` from localStorage and shows either the
      localized 'Sign Up' label or a localized welcome label.
    - This keeps the UI feeling persistent without a backend.
    - Also updates the footer trigger label when the user is signed.
  */
  function updateSignupButtons() {
    const lang = document.getElementById("langSelect")?.value || localStorage.getItem("wellnessLang") || document.documentElement.lang || "en";
    const t = translations[lang] || translations.en;
    const signed = localStorage.getItem("wellnessSignedUp") === "true";
    document.querySelectorAll(".signup-btn").forEach((btn) => {
      if (signed) {
        btn.textContent = t.welcomeWave || "Welcome to the Wave";
        btn.style.display = "";
      } else {
        btn.textContent = t.navSignUp || "Sign Up";
        btn.style.display = "";
      }
    });

    const footerTrigger = document.getElementById("footer-signup-trigger");
    if (footerTrigger) {
      // keep footer trigger visible; update label when signed
      if (signed) {
        footerTrigger.textContent = t.welcomeWave || "Welcome to the Wave";
      } else {
        // original label kept in HTML; leave unchanged when not signed
      }
      footerTrigger.style.display = "";
    }
  }

  // Ensure any signup buttons (nav, footer link) open the signup modal
  /*
    attachSignupOpeners()
    - Adds a single click listener to all signup opener elements.
    - Guards with a `data-signup-attached` marker to avoid duplicate
      handlers if the DOM nodes are replaced by translations.
  */
  function attachSignupOpeners() {
    document.querySelectorAll(".signup-btn").forEach((btn) => {
      // avoid adding duplicate listeners
      if (!btn.dataset.signupAttached) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          openModal();
        });
        btn.dataset.signupAttached = "true";
      }
    });

    const footerTrigger = document.getElementById("footer-signup-trigger");
    if (footerTrigger && !footerTrigger.dataset.signupAttached) {
      footerTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
      footerTrigger.dataset.signupAttached = "true";
    }
  }

  // Attach now and after translations in case DOM text replacements recreate nodes
  attachSignupOpeners();
  updateSignupButtons();

  // Contact form mailto (Contact.html only)
  /*
    Simple contact form behavior:
    - Validates presence of fields and shows inline error messages.
    - On success, composes a mailto: link (client-only demo behavior)
      and opens the user's email client to send the message.
    - The form does not transmit data to a server in this demo.
  */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        subject:
          document.getElementById("subject").value.trim() || "Website Message",
        message: document.getElementById("message").value.trim(),
      };
      const body = `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
      location.href = `mailto:youremail@example.com?subject=${encodeURIComponent(
        data.subject
      )}&body=${encodeURIComponent(body)}`;
      setTimeout(() => {
        alert("Opening your email client…");
        contactForm.reset();
      }, 500);
    });
  }

  // Show scrollbar while the user is actively scrolling, hide after inactivity
  (function () {
    let _sbTimeout = null;
    function showScrollbar() {
      document.documentElement.classList.add("show-scrollbar");
      if (_sbTimeout) clearTimeout(_sbTimeout);
      _sbTimeout = setTimeout(() => {
        document.documentElement.classList.remove("show-scrollbar");
        _sbTimeout = null;
      }, 1400);
    }

    // Trigger on scroll/touch; also show when mouse moves near the right edge
    window.addEventListener("scroll", showScrollbar, { passive: true });
    window.addEventListener("touchstart", showScrollbar, { passive: true });
    document.addEventListener("mousemove", function (e) {
      if (e.clientX > window.innerWidth - 60) showScrollbar();
    });
  })();
});