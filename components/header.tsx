"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { LeLoLogo } from "./lelo-logo"
import { Button } from "./ui/button"
import Link from "next/link";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      setIsScrolled(currentScrollY > 50)

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header
className={`
  fixed top-4 left-1/2 transform -translate-x-1/2 z-50
  transition-all duration-300 ease-in-out
  bg-white/90
  backdrop-blur-xl
  shadow-xl shadow-black/5
  border border-white/40
  rounded-2xl
  ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
`}

    >
      <div
        className={`
          flex items-center justify-between gap-2 md:gap-6 px-3 md:px-6 py-2 md:py-3 rounded-2xl border transition-all duration-300
          ${
            isScrolled
              ? "bg-background/90 backdrop-blur-xl border-border/40 shadow-2xl"
              : "bg-background/95 backdrop-blur-lg border-border/30 shadow-lg"
          }
        `}
      >
        <div className="transform transition-transform duration-200 hover:scale-105 flex-shrink-0">
          <div className="md:hidden">
            <Image
              src="/favicon.svg"
              alt="Euro Legal GPT logo"
              width={28}
              height={28}
              className="w-7 h-7"
            />
          </div>
          <div className="hidden md:block">
            <LeLoLogo />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#features"
            className="relative text-foreground/80 hover:text-foreground transition-all duration-300 group px-3 py-1 rounded-lg hover:bg-foreground/5 transform hover:scale-110 hover:rotate-1 hover:skew-x-1"
          >
            Funktionen
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-4"></span>
          </a>
          <a
            href="#pricing"
            className="relative text-foreground/80 hover:text-foreground transition-all duration-300 group px-3 py-1 rounded-lg hover:bg-foreground/5 transform hover:scale-110 hover:-rotate-1 hover:-skew-x-1"
          >
            Abo
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-4"></span>
          </a>
          <a
            href="#faq"
            className="relative text-foreground/80 hover:text-foreground transition-all duration-300 group px-3 py-1 rounded-lg hover:bg-foreground/5 transform hover:scale-110 hover:rotate-1 hover:skew-x-1"
          >
            FAQ
          </a>
          <a
            href="https://wa.me/491601234567?text=Hallo,%20ich%20möchte%20Kontakt%20aufnehmen"
            className="relative text-foreground/80 hover:text-foreground transition-all duration-300 group px-3 py-1 rounded-lg hover:bg-foreground/5 transform hover:scale-110 hover:-rotate-1 hover:-skew-x-1"
          >
            Kontakt
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="#pricing">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground transform transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-xl"
            >
              Jetzt abonnieren
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
