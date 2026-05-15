"use client"

import { useRef } from "react"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"
import { BackgroundPaths } from "./ui/floating-paths"

export function AnimatedCTASection() {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <div className="h-full w-full bg-gradient-to-br from-red-800 via-red-900 to-red-800">
          <BackgroundPaths />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-red-900/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-transparent to-red-900/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/60 via-transparent to-red-900/60" />
      <div
        className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-red-900/40"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(153,0,0,0.4) 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto">
        <div
          className="rounded-2xl p-12 text-center animate-fade-in-up"
          ref={contentRef}
          style={{ animationDelay: "0.3s" }}
        >
          <h2
            className="text-4xl font-bold text-white mb-4 drop-shadow-lg animate-fade-in-up"
            style={{ fontFamily: "var(--font-playfair)", animationDelay: "0.5s" }}
          >
            Bereit, deutsches Recht zu meistern?
          </h2>
          <p
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md animate-fade-in-up"
            style={{ animationDelay: "0.7s" }}
          >
            Schließe dich Hunderten von Jurastudierenden an, die Euro Legal GPT für Verständnis, Wiederholung und Prüfungserfolg nutzen.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.9s" }}
          >
            <a href="mailto:contact@euro-Legal GPT.de?subject=Abonnement%20f%C3%BCr%20Euro%20Legal GPT&body=Hallo,%20ich%20m%C3%B6chte%20mich%20f%C3%BCr%20Euro%20Legal GPT%20anmelden.">
              <Button size="lg" className="bg-white text-red-900 hover:bg-white/90 group">
                Jetzt abonnieren
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>

            <a
              href="https://wa.me/491601234567?text=Hallo,%20ich%20m%C3%B6chte%20Kontakt%20aufnehmen"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                Kontakt
              </Button>
            </a>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(24px);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
