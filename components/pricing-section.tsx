"use client"
 
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { Check } from "lucide-react"
import { Phone } from "lucide-react"

const pricingPlans = [
  {
    name: "Studententarif",
    price: "20 €",
    description: "Die ideale Wahl für Studierende, die Geschwindigkeit, Genauigkeit und Zeitersparnis suchen.",
    features: [
      "Abonnementdauer: 7 Monate + 5 Monate gratis",
      "500 Nachrichten mit KI",
      "Mehr als 5000 Rechtsdokumente",
    ],
  },
  {
    name: "Fortgeschrittener Tarif",
    price: "40 €",
    description: "Für fortgeschrittene Studierende und Profis: höhere Genauigkeit – mehr Inhalt – schnellerer Support.",
    features: [
      "Abonnementdauer: 7 Monate + 5 Monate gratis",
      "1000 Nachrichten mit KI",
      "Voller Zugriff auf alle Rechtsjournale",
    ],
    popular: true,
  },
  {
    name: "Firmentarif – private Lösung für Institutionen",
    price: "Individuelle Lösung",
    description: "Eine umfassende Lösung, die Ihrer Institution eine 100% private Instanz bietet.",
    features: [
      "Vollständige Private Instance",
      "Bereitstellung als Docker-Image",
      "Eigene DNS",
      "Vollständiges White Label",
      "Benutzer- und Rechtemanagement",
      "API-Integration",
      "Chatbot-Integration",
      "Volle Kontrolle über den KI-Anbieter",
      "Komplette Sicherheit auf Ihren Servern",
    ],
    enterprise: true,
  },
]
 
export function PricingSection() {
  const [showPaymentInfo, setShowPaymentInfo] = useState(true)
  const [glow, setGlow] = useState(false)
 
  const paymentSectionRef = useRef<HTMLDivElement | null>(null)
 
  const handleSubscribeClick = (plan: typeof pricingPlans[number]) => {
    if (plan.enterprise) {
      window.location.href = "tel:+491601234567"
      return
    }
 
    setShowPaymentInfo(true)
 
    setTimeout(() => {
      paymentSectionRef.current?.scrollIntoView({ behavior: "smooth" })
 
      setGlow(true)
      setTimeout(() => setGlow(false), 1800)
    }, 200)
  }
 
  return (
    <section
      id="pricing"
      className="py-16 px-4 bg-gradient-to-b from-red-700 to-red-900 min-h-screen text-white relative"
    >
      <a
        href="tel:+491601234567"
        className="fixed bottom-6 right-6 bg-white hover:bg-red-100 text-red-600 rounded-full shadow-xl p-4 z-50 flex items-center justify-center transition transform hover:scale-110"
      >
        <Phone className="w-7 h-7" />
      </a>
 
      <div className="text-center text-2xl md:text-3xl font-extrabold mb-12 leading-relaxed">
        Die Kraft des Rechts… mit einer KI, die dich versteht, unterstützt und dir stundenlange Arbeit erspart.
        <br /> Weil deine Zukunft die besten Werkzeuge und schnellsten Lösungen verdient.
        <br /> Darum haben wir Euro Legal GPT für dich entwickelt.
      </div>
 
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              className={`
                relative flex h-full flex-col rounded-2xl p-8 shadow-xl border border-white/20
                backdrop-blur-xl bg-white/10 hover:bg-white/20 transition
                ${plan.popular ? "shadow-red-300/40 border-white" : ""}
                ${plan.enterprise ? "shadow-yellow-300/40 border-yellow-400" : ""}
              `}
              whileHover={{ scale: 1.04 }}
            >
              {plan.popular && (
                <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                  Am beliebtesten
                </div>
              )}
 
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-3">{plan.name}</h3>
                <div className="text-4xl font-extrabold mb-4">{plan.price}</div>
 
                <p className="opacity-80 mb-6 leading-relaxed">{plan.description}</p>
 
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 opacity-90">
                      <Check className="w-5 h-5 text-white" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
 
              <Button
                className="mt-auto w-full bg-white text-red-700 font-extrabold py-3 rounded-xl hover:bg-red-100"
                onClick={() => handleSubscribeClick(plan)}
              >
                {plan.enterprise ? "Jetzt anrufen" : "Jetzt abonnieren"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
 
      <AnimatePresence>
        {showPaymentInfo && (
          <motion.div
            ref={paymentSectionRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              mt-16 max-w-3xl mx-auto transition 
              ${glow ? "ring-4 ring-red-400 ring-opacity-60" : ""}
            `}
          >
            <div className="space-y-6">

 
              <div className="relative rounded-2xl border border-red-500/40 bg-red-500/10 px-6 py-6 text-center overflow-hidden">
                <div className="absolute inset-0 bg-red-500/20 blur-2xl opacity-40 pointer-events-none" />
                <div className="relative space-y-3">
                                    <p className="text-lg font-semibold text-white mb-2">
                    Banküberweisung (RIB)
                  </p>
                  <p className="text-sm sm:text-base font-mono font-bold text-white break-all">
                    25 072 000 000 1310382 37
                  </p>
                  <p className="text-lg font-bold text-white">
                    Zahlungsbestätigung
                  </p>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    Nach der Zahlung sende bitte den Zahlungsbeleg per WhatsApp oder E-Mail zur Bestätigung.
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-white font-medium">
                      📱 WhatsApp: +49 160 1234567
                    </p>
                    <p className="text-white font-medium">
                      ✉️ Email: contact@euro-Legal GPT.de
                    </p>
                  </div>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                    Nach der Überprüfung sendet das Admin-Team deinen Benutzernamen und den Link zur Euro Legal GPT Plattform per SMS.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
