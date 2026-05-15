"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Was ist die Plattform Euro Legal GPT?",
    answer:
      "Euro Legal GPT ist eine KI-gestützte Lernplattform für Jurastudierende mit über 5000 deutschen Rechtsdokumenten zur Unterstützung beim Verständnis, der Wiederholung und der Prüfungsvorbereitung.",
  },
  {
    question: "Für wen ist die Plattform?",
    answer:
      "Die Plattform richtet sich an Jurastudierende aller Studienstufen (Bachelor, Master), Berufsausbildungsstudierende sowie Anwälte und Fachleute im Rechtsbereich.",
  },
  {
    question: "Wie hilft mir die Plattform bei Wiederholung und Prüfungen?",
    answer:
      "Euro Legal GPT bietet verständliche Erklärungen zu Rechtsnormen, intelligente Antworten auf deine Fragen und eine klare Struktur der Rechtsjournale, sodass Lernen und Verstehen in der Prüfungsphase leichter wird.",
  },
  {
    question: "Was enthält das Abonnement?",
    answer:
      "Das Abonnement ermöglicht dir den Zugang zu einer Bibliothek mit über 5000 deutschen Rechtsdokumenten sowie einer festen Anzahl KI-Nachrichten je nach gewähltem Plan.",
  },
  {
    question: "Welche Abonnementpläne sind verfügbar?",
    answer:
      "Es gibt einen 20 €-Plan mit 500 Nachrichten und einen 40 €-Plan mit 1000 Nachrichten. Beide Pläne gelten 7 Monate plus 5 Monate gratis.",
  },
  {
    question: "Wie kann ich bezahlen?",
    answer:
      "Du kannst per PayPal oder Banküberweisung bezahlen. Nach der Zahlung sollte der Zahlungsbeleg per WhatsApp oder E-Mail zur Bestätigung gesendet werden.",
  },
  {
    question: "Wann erhalte ich Benutzername und Passwort?",
    answer:
      "Nach dem Versand und der Überprüfung des Zahlungsbelegs sendet das Admin-Team deinen Benutzernamen und dein Passwort so schnell wie möglich.",
  },
  {
    question: "Kann ich die Plattform auf dem Handy oder Computer nutzen?",
    answer:
      "Ja, die Plattform funktioniert auf allen Geräten (Smartphone, Computer, Tablet) und ist jederzeit und überall nutzbar.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section 
      id="faq" className="py-20 px-4 bg-background"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Häufig gestellte Fragen
          </motion.h2>
          <motion.p
            className="text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Alles, was du über Euro Legal GPT wissen musst.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="border border-border/20 rounded-lg bg-card/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors rounded-lg"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-white pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
