{/*
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { Check, ArrowRight, Loader2, X, Smartphone, CreditCard } from "lucide-react"

// --- Configuration Constants ---
// ⚠️ REPLACE THESE WITH YOUR ACTUAL VALUES FROM KONNECT DASHBOARD


const KONNECT_WALLET_ID = process.env.NEXT_PUBLIC_KONNECT_WALLET_ID;
const KONNECT_API_KEY = process.env.NEXT_PUBLIC_KONNECT_API_KEY;
const KONNECT_API_URL = process.env.NEXT_PUBLIC_KONNECT_API_URL || "https://api.konnect.network/api/v2/payments/init-payment";
//const KONNECT_WALLET_ID = "6894bd36ff402e408c17e6bc" // e.g., 5f7a209aeb3f... dev 69765892a83cf562f61fe138  prod 6894bd36ff402e408c17e6bc
//const KONNECT_API_KEY = "6894bd32ff402e408c17e671:cOaW8neUWvCXah9Pc" // dev 6976588fa83cf562f61fe121:FMJWYGLLPZs7gjhrv9   prod 6894bd32ff402e408c17e671:cOaW8neUWvCXah9Pc 
//const KONNECT_API_URL = "https://api.preprod.konnect.network/api/v2/payments/init-payment"
// In production, use "https://api.konnect.network/api/v2/payments/init-payment"
// In dev, use "https://api.preprod.konnect.network/api/v2/payments/init-payment"

const pricingPlans = [
  {
    name: "خطة الطلبة",
    price: "50 د.ت",
    priceValue: 50000, // Price in Millimes for Konnect
    period: "",
    description: "مناسبة لطلبة الحقوق في جميع المستويات",
    features: [
      "مدة الاشتراك: 7 أشهر + 5 أشهر مجانية",
      "500 رسالة مع الذكاء الاصطناعي",
      "الوصول إلى أكثر من 5000 وثيقة قانونية تونسية",
      "مناسبة للمراجعة والامتحانات",
    ],
    popular: false,
  },
  {
    name: "الخطة المتقدمة",
    price: "100 د.ت",
    priceValue: 100000, // Price in Millimes for Konnect
    period: "",
    description: "الأفضل للطلبة المتقدمين والتكوين المهني",
    features: [
      "مدة الاشتراك: 7 أشهر + 5 أشهر مجانية",
      "1000 رسالة مع الذكاء الاصطناعي",
      "الوصول الكامل إلى جميع مجلات القانون التونسي",
      "دعم أفضل خلال فترات المراجعة",
    ],
    popular: true,
  },
  {
    name: "خطة الشركات و المؤسسات",
    price: "حسب الطلب",
    priceValue: null, // Custom pricing
    period: "",
    description: "مخصصة للأسخدام على نطاق أوسع للطلاب أو المساعدين",
features: [
  "إدارة المستخدمين",
  "إضافة مستندات مخصصة",
  "دعوة المستخدمين",
  "إنشاء مساحات عمل مخصصة",
  "إدارة مزود الذكاء الاصطناعي",
],
    popular: false,
  },
]

export function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<typeof pricingPlans[0] | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  
  // Status state for alerts
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // 1. Check for Payment Return Status on Mount
  useEffect(() => {
    // Check URL parameters when page loads
    const params = new URLSearchParams(window.location.search)
    const paymentStatus = params.get("payment_status")

    if (paymentStatus === "success") {
      setStatusMsg({
        type: 'success',
        text: "✅ تم الدفع بنجاح! سيقوم فريقنا بإرسال بيانات الدخول إليك عبر رسالة نصية (SMS) قريباً."
      })
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (paymentStatus === "failed") {
      setStatusMsg({
        type: 'error',
        text: "❌ فشلت عملية الدفع. يرجى المحاولة مرة أخرى."
      })
    }
  }, [])

  // 2. Handle Subscribe Click
  const handleSubscribeClick = (plan: typeof pricingPlans[0]) => {
    if (plan.name === "خطة المحامين") {
      // Lawyer plan goes to email
      window.location.href = "mailto:contact@contact.contact?subject=استفسار%20خطة%20المحامين&body=مرحباً، أريد التواصل بخصوص خطة المحامين"
    } else {
      // Other plans open Phone Modal
      setSelectedPlan(plan)
      setShowModal(true)
      setStatusMsg(null)
    }
  }

  // 3. Konnect API Integration
  const initiateKonnectPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phoneNumber || phoneNumber.length < 8) {
      alert("يرجى إدخال رقم هاتف صحيح")
      return
    }

    if (!selectedPlan || !selectedPlan.priceValue) return

    setLoading(true)

    try {
      // NOTE: In a strictly secure production app, this call should be done via a Server Action
      // or Backend API to hide your x-api-key from the browser client.
      const response = await fetch(KONNECT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": KONNECT_API_KEY,
        },
        body: JSON.stringify({
          receiverWalletId: KONNECT_WALLET_ID,
          token: "TND",
          amount: selectedPlan.priceValue,
          type: "immediate",
          description: `Subscription: ${selectedPlan.name}`,
          acceptedPaymentMethods: ["wallet", "bank_card", "e-DINAR"],
          lifespan: 20, // Link valid for 20 mins
          checkoutForm: true,
          addPaymentFeesToAmount: true,
          phoneNumber: phoneNumber, // Sending phone number to Konnect
          // Redirect back to this page with status param
          webhook: "https://your-site.com/api/webhook-placeholder", // Optional if using manual check
          successUrl: `${window.location.origin}${window.location.pathname}?payment_status=success`,
          failUrl: `${window.location.origin}${window.location.pathname}?payment_status=failed`,
          theme: "dark"
        }),
      })

      const data = await response.json()

      if (data.payUrl) {
        // Redirect user to Konnect Payment Page
        window.location.href = data.payUrl
      } else {
        console.error("Konnect Error:", data)
        alert("حدث خطأ أثناء الاتصال ببوابة الدفع. يرجى المحاولة لاحقاً.")
      }
    } catch (error) {
      console.error("Payment Init Error:", error)
      alert("حدث خطأ غير متوقع.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="pricing" className="py-20 px-4 bg-red-950 relative">
    
      <AnimatePresence>
        {statusMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-xl text-white font-bold flex items-center gap-3 ${
              statusMsg.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {statusMsg.type === 'success' ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
            {statusMsg.text}
            <button onClick={() => setStatusMsg(null)} className="mr-4 hover:opacity-75"><X className="w-4 h-4"/></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            خطط الاشتراك
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            اختر الخطة المناسبة لك وابدأ رحلتك في إتقان القانون التونسي بسهولة
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative bg-card border rounded-lg p-8 ${
                plan.popular ? "border-white/30 bg-white/5" : "border-border/20 bg-background/50"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white text-red-900 px-4 py-1 rounded-full text-sm font-medium">
                    الأكثر اختيارًا
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

          <Button
            onClick={() => handleSubscribeClick(plan)}
            className={`hidden w-full ${
              plan.popular
                ? "bg-white text-red-900 hover:bg-white/90"
                : "bg-transparent border border-white/20 text-white hover:bg-white/10"
            } group`}
            size="lg"
          >
            {plan.name === "خطة المحامين" ? "تواصل معنا" : "اشترك الآن"}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>

            </motion.div>
          ))}
        </div>

        <motion.div
              className="mt-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div dir="rtl" className="space-y-6">

       
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

             
                  <div className="rounded-2xl border border-white/20 bg-white/5 px-6 py-6 text-center">
                    <p className="text-lg font-semibold text-white mb-2">
                      الدفع عبر D17
                    </p>
                    <p
                      dir="ltr"
                      className="text-3xl font-mono font-bold text-white tracking-wider"
                    >
                      28888612
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/20 bg-white/5 px-6 py-6 text-center">
                    <p className="text-lg font-semibold text-white mb-2">
                      التحويل البنكي (RIB)
                    </p>
                    <p
                      dir="ltr"
                      className="text-sm sm:text-base font-mono font-bold text-white break-all"
                    >
                      25 072 000 000 1310382 37
                    </p>
                  </div>
                </div>

              
                <div className="relative rounded-2xl border border-red-500/40 bg-red-500/10 px-6 py-6 text-center overflow-hidden">
                  
          
                  <div className="absolute inset-0 bg-red-500/20 blur-2xl opacity-40 pointer-events-none" />

                  <div className="relative space-y-3">
                    <p className="text-lg font-bold text-white">
                      تأكيد الدفع (Quitance de paiement)
                    </p>

                    <p className="text-sm text-gray-200 leading-relaxed">
                      بعد إتمام الدفع، الرجاء إرسال <span className="text-white font-semibold"> وصل / إثبات الدفع </span>
                      عبر واتساب أو البريد الإلكتروني.
                    </p>

                    <div className="space-y-1 text-sm">
                      <p dir="ltr" className="text-white font-medium">
                        📱 WhatsApp: +216 28 888 612
                      </p>
                      <p dir="ltr" className="text-white font-medium">
                        ✉️ Email: contact@aibc.tn
                      </p>
                    </div>

                    <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                      بعد التحقق من عملية الدفع، سيقوم فريق الإدارة بإرسال
                      <span className="text-white font-medium"> اسم المستخدم </span>
                      ورابط منصة
                      <span className="text-white font-medium"> مرشد قانون </span>
                      عبر رسالة SMS.
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>

      </div>


      <AnimatePresence>
        {showModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/10 p-6 rounded-xl w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 left-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">تأكيد الاشتراك</h3>
                <p className="text-gray-400 text-sm">
                  أنت على وشك الاشتراك في <span className="text-white font-semibold">{selectedPlan.name}</span> بسعر {selectedPlan.price}
                </p>
              </div>

              <form onSubmit={initiateKonnectPayment} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 block text-right">رقم الهاتف الجوال</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="أدخل رقم هاتفك (مثال: 22123456)"
                      className="w-full bg-black/40 border border-white/20 rounded-lg py-3 px-4 text-white text-right placeholder:text-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      required
                      minLength={8}
                    />
                    <Smartphone className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  </div>
                  <p className="text-xs text-yellow-500/80 text-right mt-1">
                    * سيتم إرسال بيانات الدخول إلى هذا الرقم بعد الدفع
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white mt-4 py-6 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      جاري التحويل...
                    </>
                  ) : (
                    <>
                      ادفع الآن عبر Konnect
                      <CreditCard className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                
                <p className="text-center text-xs text-gray-500 mt-4">
                  يتم تأمين الدفع بواسطة منصة Konnect التونسية
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
*/}

"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Check, ArrowRight } from "lucide-react"

const pricingPlans = [
  {
    name: "خطة الطلبة",
    price: "50 د.ت",
    period: "",
    description: "مناسبة لطلبة الحقوق في جميع المستويات",
    features: [
      "مدة الاشتراك: 7 أشهر + 5 أشهر مجانية",
      "500 رسالة مع الذكاء الاصطناعي",
      "الوصول إلى أكثر من 5000 وثيقة قانونية تونسية",
      "مناسبة للمراجعة والامتحانات",
    ],
    popular: false,
  },
  {
    name: "الخطة المتقدمة",
    price: "100 د.ت",
    period: "",
    description: "الأفضل للطلبة المتقدمين والتكوين المهني",
    features: [
      "مدة الاشتراك: 7 أشهر + 5 أشهر مجانية",
      "1000 رسالة مع الذكاء الاصطناعي",
      "الوصول الكامل إلى جميع مجلات القانون التونسي",
      "دعم أفضل خلال فترات المراجعة",
    ],
    popular: true,
  },
  {
    name: "خطة المحامين",
    price: "حسب الطلب",
    period: "",
    description: "مخصصة للمحامين والمهنيين",
    features: [
      "وصول موسّع للمكتبة القانونية",
      "استخدام مكثف للذكاء الاصطناعي",
      "مناسبة للبحث القانوني المهني",
      "دعم خاص",
    ],
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 bg-red-950">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            خطط الاشتراك
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            اختر الخطة المناسبة لك وابدأ رحلتك في إتقان القانون التونسي بسهولة
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative bg-card border rounded-lg p-8 ${
                plan.popular ? "border-white/30 bg-white/5" : "border-border/20 bg-background/50"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white text-red-900 px-4 py-1 rounded-full text-sm font-medium">
                    الأكثر اختيارًا
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

<a
  href={
    plan.name === "خطة المحامين"
      ? "mailto:contact@contact.contact?subject=استفسار%20خطة%20المحامين&body=مرحباً، أريد التواصل بخصوص خطة المحامين"
      : "mailto:contact@contact.contact?subject=اشتراك%20في%20منصة%20مرشد%20Loi&body=مرحباً، أريد الاشتراك الآن"
  }
>
  <Button
    className={`w-full ${
      plan.popular
        ? "bg-white text-red-900 hover:bg-white/90"
        : "bg-transparent border border-white/20 text-white hover:bg-white/10"
    } group`}
    size="lg"
  >
    {plan.name === "خطة المحامين" ? "تواصل معنا" : "اشترك الآن"}
    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
  </Button>
</a>

            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-4">
            الدفع عبر D17 أو تحويل بنكي • يتم إرسال بيانات الدخول بعد تأكيد الدفع
          </p>
        </motion.div>
      </div>
    </section>
  )
}
