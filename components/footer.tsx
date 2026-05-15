import { LeLoLogo } from "./lelo-logo"

export function Footer() {
  return (
    <footer 
      className="bg-red-950 border-t border-white/10 py-12 px-4"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-2">
            <LeLoLogo className="mb-4" />
            <p className="text-white/70 mb-4 max-w-md">
              Die Plattform Euro Legal GPT hilft Jurastudierenden, auf über 5000 deutsche Rechtsdokumente zuzugreifen und sich auf Prüfungen vorzubereiten.
            </p>
            <p className="text-sm text-white/50 italic">
              "Beginne deine Reise zur Beherrschung des deutschen Rechts mit Euro Legal GPT"
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Plattform</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">Abo</a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">Funktionen</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="https://wa.me/491601234567?text=Hallo,%20ich%20m%C3%B6chte%20Kontakt%20aufnehmen" className="hover:text-white transition-colors">Kontakt</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Über uns</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="#" className="hover:text-white transition-colors">Über uns</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Karriere</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Kontakt</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50">
          <p>&copy; 2026 Euro Legal GPT. Alle Rechte vorbehalten.</p>
          <p>&copy; Powered by AIBC</p>
        </div>
      </div>
    </footer>
  )
}
