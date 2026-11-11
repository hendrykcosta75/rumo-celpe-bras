export const LANGS = ["en", "es"] as const;
export type Lang = (typeof LANGS)[number];
export const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v);

export const FOUNDER_PRICE_USD = 29;
export const FULL_PRICE_USD = 79;
export const FOUNDER_SEATS = 200;
export const DAILY_WRITING_LIMIT = 10;
export const DAILY_SPEAKING_LIMIT = 5;
export const REFUND_DAYS = 7;

const en = {
  meta: {
    title: "Celpe-Bras practice tests with AI feedback in minutes",
    description: "Original Celpe-Bras writing practice tests in the real format, scored on Inep's public 0–5 scale with feedback in English in about a minute. Free diagnostic essay.",
  },
  nav: { diagnostic: "Free diagnostic", pricing: "Pricing", faq: "FAQ", login: "Student login", lang: "Español" },
  sample: { words: "187 words", label: "Sample correction", task: "Task 3 · e-mail to private companies", score: "Estimated score", axes: ["Context and purpose", "Genre", "Language"], note1: "clear request to the reader", note2: "formal register, keep it", note3: "agreement: “as empresas apoiam”" },
  hero: {
    eyebrow: "Celpe-Bras writing and speaking practice",
    title: "Stop guessing your Celpe-Bras writing level.",
    lead: "Write an answer in the real exam format and get an estimated 0–5 score on Inep's public grading scale, with clear notes on context, genre and language. In about a minute, not weeks.",
    ctaBuy: "Get founder access — US$ 29",
    ctaFree: "Try a free diagnostic essay",
    priceNote: "One payment, lifetime access",
    guarantee: `${REFUND_DAYS}-day refund guarantee`,
  },
  seats: { left: (n: number) => `${n} of ${FOUNDER_SEATS} founder seats left`, soldOut: "Founder seats are sold out" },
  problem: {
    title: "Most candidates fail the writing part for the same reason",
    body: "The Celpe-Bras doesn't grade grammar alone. It grades whether you write the right text, for the right reader, with the right purpose: a reader's letter, an e-mail to a company, a flyer. Without someone checking that, you can study for months and still miss it.",
  },
  how: {
    title: "How it works",
    steps: [
      { t: "Watch, listen or read", d: "Each practice test has the 4 integrated writing tasks: a video, an audio and two texts, all original and in Brazilian Portuguese." },
      { t: "Write your answer", d: "In the genre the task asks for. A word counter keeps you in the exam's range." },
      { t: "Get scored", d: "An estimated 0–5 score per task on Inep's public scale, why you got it, and 2–4 concrete fixes. Your level estimate comes from the average of the 4 tasks." },
    ],
  },
  includes: {
    title: "What founder access includes",
    items: [
      "4 complete original writing practice tests (16 tasks: video, audio and reading)",
      `Up to ${DAILY_WRITING_LIMIT} essay corrections per day, feedback in English or Spanish`,
      `Speaking practice: record an answer, get a transcript and comments (up to ${DAILY_SPEAKING_LIMIT} per day)`,
      "A weekly study plan counted down to your exam date",
      "Every new practice test we add, at no extra cost",
    ],
  },
  pricing: {
    title: "Founder offer",
    sub: `For the first ${FOUNDER_SEATS} students only. After that, the price goes to US$ ${FULL_PRICE_USD}.`,
    price: `US$ ${FOUNDER_PRICE_USD}`,
    was: `US$ ${FULL_PRICE_USD}`,
    period: "once · lifetime access",
    cta: "Get founder access",
    secure: "Secure card payment by Stripe",
    soldOut: "Sold out",
  },
  proof: {
    title: "Checked against real graded answers",
    body: "We tested the scoring on real Celpe-Bras answers that Inep published with their official scores. Most AI scores landed within one point of the official one, the same tolerance the exam allows between two human graders. It is an estimate, not an official result.",
  },
  faq: {
    title: "Questions",
    items: [
      { q: "Will this guarantee I pass?", a: "No. Nobody can promise that. What you get is a lot of realistic practice and fast, specific feedback, so you know what to fix before exam day." },
      { q: "Is this the official Celpe-Bras?", a: "No. We are an independent study tool, not affiliated with Inep, the Brazilian Ministry of Education or the Celpe-Bras exam. All practice tests are original." },
      { q: "How accurate is the AI score?", a: "It uses Inep's public grading scale. In our test with officially graded answers, most scores were within one point. Treat it as a strong estimate." },
      { q: "Does it cover the speaking part?", a: "The oral exam is face to face. Here you practise speaking about a topic, get a transcript and comments on how you spoke. It is training, not a simulation of the official interview." },
      { q: "Can I get a refund?", a: `Yes. Ask by e-mail to our support within ${REFUND_DAYS} days of purchase and we refund 100% to the same card. Details on the Refund guarantee page.` },
      { q: "What do I need?", a: "A browser and a microphone for speaking practice. No app to install." },
    ],
  },
  finalCta: { title: "Know where you stand before exam day", body: "Start with one free essay. Upgrade when you're ready." },
  footer: {
    disclaimer: "Independent study tool. Not affiliated with, endorsed by or connected to Inep, the Brazilian Ministry of Education or the Celpe-Bras exam. Scores are estimates.",
    terms: "Terms of use", privacy: "Privacy", refund: "Refund guarantee", contact: "Contact",
  },
  diag: {
    title: "Free diagnostic essay",
    lead: "Read the text, write your answer in Portuguese and get an estimated score with comments. One free essay per e-mail.",
    source: "Read",
    task: "Your task",
    answer: "Your answer (in Portuguese)",
    words: (n: number) => `${n} words · aim for 150–300`,
    email: "E-mail (we send your result and study tips)",
    consent: "I agree to the Privacy Policy, including sending my text to an AI provider outside Brazil for correction.",
    native: "Your first language (optional)",
    nativeOther: "Other",
    nativeOtherLabel: "Which language?",
    submit: "Get my score",
    grading: "Grading… this usually takes under a minute.",
    errors: {
      email: "Enter a valid e-mail address.",
      tooShort: "Write at least 150 words.",
      tooLong: "Keep it under 300 words for the diagnostic.",
      empty: "Write your answer first.",
      consent: "Please accept the Privacy Policy.",
      used: "This e-mail already used its free diagnostic. Get founder access for unlimited practice.",
      limit: "Too many free diagnostics from this connection today. Try again tomorrow.",
      ai: "We couldn't grade it right now. Please try again in a minute.",
    },
    resultTitle: "Your estimated score",
    outOf: "out of 5 · estimate on Inep's public scale",
    single: "This is one task. In the exam, your level comes from the average of 4 tasks.",
    nextTitle: "Want the full picture?",
    nextBody: "Founder access gives you 4 complete practice tests and daily corrections.",
  },
  feedback: { why: "Why this score", context: "Context and purpose", genre: "Genre", language: "Language", improve: "To improve" },
  levels: { none: "Below Intermediate", intermediate: "Intermediate", upperIntermediate: "Upper Intermediate", advanced: "Advanced", upperAdvanced: "Upper Advanced" } as Record<string, string>,
  checkout: { success: "Payment received. Check your e-mail for your access link.", cancel: "Payment cancelled. You were not charged.", soldOut: "Sorry, founder seats are sold out.", busy: "You already opened several payment pages. Finish the one that is open, or try again in 30 minutes." },
  login: { title: "Student login", lead: "Enter the e-mail you used to buy. We'll send a sign-in link.", email: "E-mail", submit: "Send me a link", sent: "If that e-mail has access, a sign-in link is on its way. It expires in 30 minutes.", invalid: "This link is invalid or expired. Ask for a new one." },
  app: {
    title: "Your practice", logout: "Sign out", exams: "Practice tests", speaking: "Speaking practice", plan: "Study plan",
    usage: (w: number, s: number) => `Today: ${w}/${DAILY_WRITING_LIMIT} essay corrections · ${s}/${DAILY_SPEAKING_LIMIT} speaking`,
    task: "Task", start: "Open", done: "Scored", avg: "Average of your best scores", level: "Estimated level",
    video: "Watch the video", audio: "Listen to the audio", reading: "Read the text",
    transcript: "Show transcript", submit: "Submit for correction", back: "Back to practice tests",
    limit: `You reached today's limit of ${DAILY_WRITING_LIMIT} corrections. It resets at midnight (Brasília time).`,
    speakBusy: "We are still transcribing your previous recording. Try again in a minute.",
    speakLimit: `You reached today's limit of ${DAILY_SPEAKING_LIMIT} speaking corrections. It resets at midnight (Brasília time).`,
    record: "Record", stop: "Stop", send: "Send recording", recording: "Recording…", max: "Up to 3 minutes.",
    yourSpeech: "What we heard", speakFeedback: "Comments",
    examDate: "Exam date", savePlan: "Build my plan", weeks: (n: number) => `${n} weeks to go`,
    noDate: "Tell us your exam date and we'll build a week-by-week plan.",
  },
};

type Dict = typeof en;

const es: Dict = {
  meta: {
    title: "Simulados del Celpe-Bras con corrección por IA en minutos",
    description: "Simulados originales de la parte escrita del Celpe-Bras en el formato real, con nota estimada en la escala pública 0–5 del Inep y comentarios en español en cerca de un minuto. Diagnóstico gratis.",
  },
  nav: { diagnostic: "Diagnóstico gratis", pricing: "Precio", faq: "Preguntas", login: "Acceso alumnos", lang: "English" },
  sample: { words: "187 palabras", label: "Ejemplo de corrección", task: "Tarea 3 · e-mail a empresas privadas", score: "Nota estimada", axes: ["Contexto y propósito", "Género", "Lengua"], note1: "pedido claro al lector", note2: "registro formal, mantenlo", note3: "concordancia: “as empresas apoiam”" },
  hero: {
    eyebrow: "Práctica de escritura y habla para el Celpe-Bras",
    title: "Deja de adivinar tu nivel de escritura en el Celpe-Bras.",
    lead: "Escribe una respuesta en el formato real del examen y recibe una nota estimada de 0 a 5 en la escala pública del Inep, con comentarios claros sobre contexto, género y lengua. En cerca de un minuto, no en semanas.",
    ctaBuy: "Acceso de fundador — US$ 29",
    ctaFree: "Prueba un diagnóstico gratis",
    priceNote: "Un solo pago, acceso de por vida",
    guarantee: `Garantía de reembolso de ${REFUND_DAYS} días`,
  },
  seats: { left: (n: number) => `Quedan ${n} de ${FOUNDER_SEATS} plazas de fundador`, soldOut: "Las plazas de fundador se agotaron" },
  problem: {
    title: "La mayoría reprueba la escritura por el mismo motivo",
    body: "El Celpe-Bras no corrige solo gramática. Evalúa si escribes el texto correcto, para el lector correcto y con el propósito correcto: una carta de lector, un e-mail a una empresa, un folleto. Sin alguien que lo revise, puedes estudiar meses y seguir fallando ahí.",
  },
  how: {
    title: "Cómo funciona",
    steps: [
      { t: "Mira, escucha o lee", d: "Cada simulado tiene las 4 tareas integradas de escritura: un video, un audio y dos textos, todos originales y en portugués de Brasil." },
      { t: "Escribe tu respuesta", d: "En el género que pide la tarea. Un contador de palabras te mantiene en el rango del examen." },
      { t: "Recibe tu nota", d: "Una nota estimada de 0 a 5 por tarea en la escala pública del Inep, el porqué y de 2 a 4 correcciones concretas. Tu nivel estimado sale del promedio de las 4 tareas." },
    ],
  },
  includes: {
    title: "Qué incluye el acceso de fundador",
    items: [
      "4 simulados escritos completos y originales (16 tareas: video, audio y lectura)",
      `Hasta ${DAILY_WRITING_LIMIT} correcciones por día, con comentarios en español o inglés`,
      `Práctica oral: graba una respuesta y recibe la transcripción y comentarios (hasta ${DAILY_SPEAKING_LIMIT} por día)`,
      "Un plan de estudio semanal hasta la fecha de tu examen",
      "Todos los simulados nuevos que agreguemos, sin costo extra",
    ],
  },
  pricing: {
    title: "Oferta de fundador",
    sub: `Solo para los primeros ${FOUNDER_SEATS} alumnos. Después, el precio sube a US$ ${FULL_PRICE_USD}.`,
    price: `US$ ${FOUNDER_PRICE_USD}`,
    was: `US$ ${FULL_PRICE_USD}`,
    period: "pago único · acceso de por vida",
    cta: "Quiero el acceso de fundador",
    secure: "Pago seguro con tarjeta por Stripe",
    soldOut: "Agotado",
  },
  proof: {
    title: "Probado con respuestas reales ya corregidas",
    body: "Probamos la corrección con respuestas reales del Celpe-Bras que el Inep publicó con su nota oficial. La mayoría de las notas de la IA quedó a un punto o menos de la oficial, la misma tolerancia que el examen acepta entre dos correctores. Es una estimación, no un resultado oficial.",
  },
  faq: {
    title: "Preguntas",
    items: [
      { q: "¿Esto garantiza que voy a aprobar?", a: "No. Nadie puede prometer eso. Lo que recibes es mucha práctica realista y comentarios rápidos y específicos, para saber qué corregir antes del examen." },
      { q: "¿Es el Celpe-Bras oficial?", a: "No. Somos una herramienta de estudio independiente, sin vínculo con el Inep, el Ministerio de Educación de Brasil ni el examen Celpe-Bras. Todos los simulados son originales." },
      { q: "¿Qué tan precisa es la nota de la IA?", a: "Usa la escala pública de corrección del Inep. En nuestra prueba con respuestas corregidas oficialmente, la mayoría quedó a un punto o menos. Tómala como una estimación sólida." },
      { q: "¿Incluye la parte oral?", a: "El examen oral es presencial. Aquí practicas hablar sobre un tema y recibes la transcripción y comentarios sobre cómo hablaste. Es entrenamiento, no una simulación de la entrevista oficial." },
      { q: "¿Puedo pedir reembolso?", a: `Sí. Pídelo por e-mail a nuestro soporte dentro de los ${REFUND_DAYS} días de la compra y te devolvemos el 100% a la misma tarjeta. Detalles en la página de Garantía de reembolso.` },
      { q: "¿Qué necesito?", a: "Un navegador y un micrófono para la práctica oral. No hay app para instalar." },
    ],
  },
  finalCta: { title: "Sabe dónde estás antes del examen", body: "Empieza con una redacción gratis. Pasa al acceso completo cuando quieras." },
  footer: {
    disclaimer: "Herramienta de estudio independiente. Sin afiliación, aval ni vínculo con el Inep, el Ministerio de Educación de Brasil o el examen Celpe-Bras. Las notas son estimaciones.",
    terms: "Términos de uso", privacy: "Privacidad", refund: "Garantía de reembolso", contact: "Contacto",
  },
  diag: {
    title: "Diagnóstico gratis",
    lead: "Lee el texto, escribe tu respuesta en portugués y recibe una nota estimada con comentarios. Una redacción gratis por e-mail.",
    source: "Lee",
    task: "Tu tarea",
    answer: "Tu respuesta (en portugués)",
    words: (n: number) => `${n} palabras · entre 150 y 300`,
    email: "E-mail (te enviamos el resultado y consejos de estudio)",
    consent: "Acepto la Política de Privacidad, incluido el envío de mi texto a un proveedor de IA fuera de Brasil para la corrección.",
    native: "Tu lengua materna (opcional)",
    nativeOther: "Otra",
    nativeOtherLabel: "¿Qué lengua?",
    submit: "Ver mi nota",
    grading: "Corrigiendo… suele tardar menos de un minuto.",
    errors: {
      email: "Escribe un e-mail válido.",
      tooShort: "Escribe al menos 150 palabras.",
      tooLong: "Para el diagnóstico, no pases de 300 palabras.",
      empty: "Primero escribe tu respuesta.",
      consent: "Acepta la Política de Privacidad.",
      used: "Este e-mail ya usó su diagnóstico gratis. Con el acceso de fundador practicas sin límite.",
      limit: "Demasiados diagnósticos gratis desde esta conexión hoy. Inténtalo mañana.",
      ai: "No pudimos corregir ahora. Inténtalo de nuevo en un minuto.",
    },
    resultTitle: "Tu nota estimada",
    outOf: "de 5 · estimación en la escala pública del Inep",
    single: "Es una sola tarea. En el examen, tu nivel sale del promedio de 4 tareas.",
    nextTitle: "¿Quieres el panorama completo?",
    nextBody: "El acceso de fundador te da 4 simulados completos y correcciones diarias.",
  },
  feedback: { why: "Por qué esta nota", context: "Contexto y propósito", genre: "Género", language: "Lengua", improve: "Para mejorar" },
  levels: { none: "Debajo de Intermedio", intermediate: "Intermedio", upperIntermediate: "Intermedio Superior", advanced: "Avanzado", upperAdvanced: "Avanzado Superior" },
  checkout: { success: "Pago recibido. Revisa tu e-mail para el enlace de acceso.", cancel: "Pago cancelado. No se te cobró.", soldOut: "Lo sentimos, las plazas de fundador se agotaron.", busy: "Ya abriste varias páginas de pago. Termina la que está abierta o inténtalo de nuevo en 30 minutos." },
  login: { title: "Acceso alumnos", lead: "Escribe el e-mail con el que compraste. Te enviamos un enlace de acceso.", email: "E-mail", submit: "Enviarme el enlace", sent: "Si ese e-mail tiene acceso, el enlace va en camino. Vence en 30 minutos.", invalid: "Este enlace no es válido o venció. Pide uno nuevo." },
  app: {
    title: "Tu práctica", logout: "Salir", exams: "Simulados", speaking: "Práctica oral", plan: "Plan de estudio",
    usage: (w: number, s: number) => `Hoy: ${w}/${DAILY_WRITING_LIMIT} correcciones escritas · ${s}/${DAILY_SPEAKING_LIMIT} orales`,
    task: "Tarea", start: "Abrir", done: "Corregida", avg: "Promedio de tus mejores notas", level: "Nivel estimado",
    video: "Mira el video", audio: "Escucha el audio", reading: "Lee el texto",
    transcript: "Ver transcripción", submit: "Enviar a corrección", back: "Volver a los simulados",
    limit: `Llegaste al límite de ${DAILY_WRITING_LIMIT} correcciones de hoy. Se renueva a medianoche (hora de Brasilia).`,
    speakBusy: "Todavía estamos transcribiendo tu grabación anterior. Inténtalo de nuevo en un minuto.",
    speakLimit: `Llegaste al límite de ${DAILY_SPEAKING_LIMIT} correcciones orales de hoy. Se renueva a medianoche (hora de Brasilia).`,
    record: "Grabar", stop: "Parar", send: "Enviar grabación", recording: "Grabando…", max: "Hasta 3 minutos.",
    yourSpeech: "Lo que escuchamos", speakFeedback: "Comentarios",
    examDate: "Fecha del examen", savePlan: "Armar mi plan", weeks: (n: number) => `Faltan ${n} semanas`,
    noDate: "Dinos la fecha de tu examen y armamos un plan semana a semana.",
  },
};

export const DICTS: Record<Lang, Dict> = { en, es };
/**
 * Dicionário do idioma; idioma desconhecido (/xx) cai no EN em vez de quebrar. O 404 vem do notFound()
 * do layout [lang] (layout e página rodam em paralelo, então a página não pode depender dele).
 */
export const t = (lang: Lang): Dict => DICTS[lang] ?? DICTS.en;
export type { Dict };
