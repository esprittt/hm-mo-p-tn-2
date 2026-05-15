import Image from "next/image"

export function LeLoLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Image
        src="/favicon.svg"
        alt="Euro Legal GPT logo"
        width={32}
        height={32}
        className="w-8 h-8"
      />
      <span className="text-xl font-bold text-foreground">Euro Legal GPT</span>
    </div>
  )
}
