import { DAILY_SPEAKING_LIMIT, DAILY_WRITING_LIMIT, REFUND_DAYS, type Lang } from "@/i18n/dict";

export type LegalDoc = "terms" | "privacy" | "refund";
interface Section { readonly h: string; readonly p: readonly string[] }
interface Doc { readonly title: string; readonly sections: readonly Section[] }

/** Identificação do responsável e contato vêm da configuração; sem eles, o texto mostra a pendência (não inventamos dados). */
export function operator() {
  return {
    name: process.env.OPERATOR_NAME || "[operator legal name — pending]",
    contact: process.env.CONTACT_EMAIL || "[contact e-mail — pending]",
  };
}

export function legal(lang: Lang, doc: LegalDoc): Doc {
  const { name, contact } = operator();
  const en: Record<LegalDoc, Doc> = {
    terms: { title: "Terms of use", sections: [
      { h: "What this is", p: [`Rumo is an independent online study tool for the writing and speaking parts of the Celpe-Bras exam, operated by ${name}. It is not affiliated with, endorsed by or connected to Inep, the Brazilian Ministry of Education or the Celpe-Bras exam.`] },
      { h: "Scores are estimates", p: ["Scores and levels are estimates produced by artificial intelligence using Inep's public grading scale. They are not official results and do not predict or guarantee an exam result."] },
      { h: "Founder access", p: ["Founder access is a one-time payment that gives access to the student area for as long as the service operates, including practice tests added later. It is personal and may not be shared or resold."] },
      { h: "Fair-use limits", p: [`To keep the service sustainable, each student can request up to ${DAILY_WRITING_LIMIT} essay corrections and ${DAILY_SPEAKING_LIMIT} speaking corrections per day (reset at midnight, Brasília time). The free diagnostic is limited to one essay per e-mail.`] },
      { h: "Acceptable use", p: ["Do not submit content that is unlawful, or that is not yours to submit, and do not try to break, overload or reverse engineer the service. We may suspend accounts that do."] },
      { h: "Refunds", p: [`See the Refund guarantee: you can ask for a refund within ${REFUND_DAYS} days of purchase, by e-mail to ${contact}.`] },
      { h: "Contact", p: [contact] },
    ] },
    privacy: { title: "Privacy policy", sections: [
      { h: "Who is responsible", p: [`${name} is the controller of your personal data under Brazil's General Data Protection Law (LGPD, Law 13.709/2018). Contact: ${contact}.`] },
      { h: "What we collect", p: ["Your e-mail; the texts you write; recordings you make for speaking practice (deleted right after they are transcribed; we keep only the transcript); your exam date if you give it; and payment confirmation from Stripe. We never see or store your card details."] },
      { h: "Why", p: ["To correct your texts and speech, give you access to the student area, send your results, access links and study tips (you can unsubscribe at any time), prevent abuse and handle refunds. Legal bases: your consent (free diagnostic and tips) and the performance of the contract (paid access)."] },
      { h: "International transfer", p: ["Your texts and transcripts are sent for correction to DeepSeek, an AI provider whose servers are outside Brazil (China). Payments are processed by Stripe (United States). By using the diagnostic and the student area you consent to this transfer (LGPD art. 33, VIII). We do not send your name or e-mail to the AI provider."] },
      { h: "How long", p: ["We keep texts and corrections while your account is active and for up to 12 months after your last use. If you only took the free diagnostic, we keep your e-mail and that essay for up to 12 months and then delete them. Payment records are kept as long as tax law requires."] },
      { h: "Your rights", p: [`You can ask to access, correct, export or delete your data, or withdraw consent, by writing to ${contact}. We answer within 15 days.`] },
    ] },
    refund: { title: "Refund guarantee", sections: [
      { h: `${REFUND_DAYS}-day refund`, p: [`You can ask for a refund within ${REFUND_DAYS} days of your purchase. Write to ${contact} from the e-mail you used to buy (or tell us that e-mail). We refund 100% of the amount to the same card through Stripe and close your access.`, `After ${REFUND_DAYS} days from the purchase, the payment is not refundable.`] },
      { h: "What this is not", p: ["We do not offer refunds based on exam results, because no tool can guarantee a pass."] },
    ] },
  };
  const es: Record<LegalDoc, Doc> = {
    terms: { title: "Términos de uso", sections: [
      { h: "Qué es", p: [`Rumo es una herramienta de estudio en línea independiente para las partes escrita y oral del examen Celpe-Bras, operada por ${name}. No tiene afiliación, aval ni vínculo con el Inep, el Ministerio de Educación de Brasil ni el examen Celpe-Bras.`] },
      { h: "Las notas son estimaciones", p: ["Las notas y niveles son estimaciones hechas por inteligencia artificial con la escala pública de corrección del Inep. No son resultados oficiales y no predicen ni garantizan el resultado del examen."] },
      { h: "Acceso de fundador", p: ["El acceso de fundador es un pago único que da acceso al área del alumno mientras el servicio funcione, incluidos los simulados que se agreguen después. Es personal y no se puede compartir ni revender."] },
      { h: "Límites de uso justo", p: [`Para que el servicio sea sostenible, cada alumno puede pedir hasta ${DAILY_WRITING_LIMIT} correcciones escritas y ${DAILY_SPEAKING_LIMIT} orales por día (se renuevan a medianoche, hora de Brasilia). El diagnóstico gratis se limita a una redacción por e-mail.`] },
      { h: "Uso aceptable", p: ["No envíes contenido ilegal o que no tengas derecho a enviar, ni intentes dañar, sobrecargar o hacer ingeniería inversa del servicio. Podemos suspender cuentas que lo hagan."] },
      { h: "Reembolsos", p: [`Consulta la Garantía de reembolso: puedes pedir el reembolso dentro de los ${REFUND_DAYS} días de la compra, por e-mail a ${contact}.`] },
      { h: "Contacto", p: [contact] },
    ] },
    privacy: { title: "Política de privacidad", sections: [
      { h: "Responsable", p: [`${name} es el controlador de tus datos personales según la Ley General de Protección de Datos de Brasil (LGPD, Ley 13.709/2018). Contacto: ${contact}.`] },
      { h: "Qué recopilamos", p: ["Tu e-mail; los textos que escribes; las grabaciones de la práctica oral (se borran apenas se transcriben; guardamos solo la transcripción); la fecha de tu examen si la indicas; y la confirmación de pago de Stripe. Nunca vemos ni guardamos los datos de tu tarjeta."] },
      { h: "Para qué", p: ["Para corregir tus textos y tu habla, darte acceso al área del alumno, enviarte resultados, enlaces de acceso y consejos de estudio (puedes darte de baja cuando quieras), evitar abusos y gestionar reembolsos. Bases legales: tu consentimiento (diagnóstico gratis y consejos) y la ejecución del contrato (acceso pago)."] },
      { h: "Transferencia internacional", p: ["Tus textos y transcripciones se envían para corrección a DeepSeek, un proveedor de IA con servidores fuera de Brasil (China). Los pagos los procesa Stripe (Estados Unidos). Al usar el diagnóstico y el área del alumno consientes esta transferencia (LGPD art. 33, VIII). No enviamos tu nombre ni tu e-mail al proveedor de IA."] },
      { h: "Por cuánto tiempo", p: ["Guardamos textos y correcciones mientras tu cuenta esté activa y hasta 12 meses después de tu último uso. Si solo hiciste el diagnóstico gratis, guardamos tu e-mail y esa redacción hasta 12 meses y luego los borramos. Los registros de pago se guardan el tiempo que exija la ley tributaria."] },
      { h: "Tus derechos", p: [`Puedes pedir acceso, corrección, portabilidad o eliminación de tus datos, o retirar tu consentimiento, escribiendo a ${contact}. Respondemos en hasta 15 días.`] },
    ] },
    refund: { title: "Garantía de reembolso", sections: [
      { h: `Reembolso en ${REFUND_DAYS} días`, p: [`Puedes pedir el reembolso dentro de los ${REFUND_DAYS} días de tu compra. Escribe a ${contact} desde el e-mail con el que compraste (o indícanos ese e-mail). Te devolvemos el 100% a la misma tarjeta por Stripe y cerramos tu acceso.`, `Pasados ${REFUND_DAYS} días desde la compra, el pago no es reembolsable.`] },
      { h: "Lo que no cubre", p: ["No ofrecemos reembolsos según el resultado del examen, porque ninguna herramienta puede garantizar la aprobación."] },
    ] },
  };
  return (lang === "es" ? es : en)[doc];
}
