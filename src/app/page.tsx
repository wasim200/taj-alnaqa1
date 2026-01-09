"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { User, Phone, Crown, LogIn, Hand } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    if (val.length <= 10) {
      setCode(val);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 9) {
      setPhone(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (name.length < 3) {
      Swal.fire({ icon: "error", title: "تنبيه", text: "يرجى كتابة الاسم الثلاثي بشكل صحيح" });
      return;
    }

    if (!/^7\d{8}$/.test(phone)) {
      Swal.fire({ icon: "error", title: "رقم الهاتف غير صحيح", text: "يجب أن يتكون من 9 أرقام ويبدأ بـ 7" });
      return;
    }

    if (!code.startsWith("TAJ-") || code.length < 10) {
      Swal.fire({ icon: "error", title: "الكود غير صحيح", text: "تأكد من إدخال الكود الموجود خلف الكرت (TAJ-XXXXXX)" });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, code })
      });
      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "تم الاشتراك بنجاح!",
          text: "انتظر السحب قريباً. حظاً موفقاً! 🎉",
          confirmButtonColor: "#004D25"
        });

        // Reset form
        setName("");
        setPhone("");
        setCode("");
      } else {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: data.message || "حدث خطأ غير متوقع",
          confirmButtonColor: "#d33"
        });
      }

    } catch (error) {
      Swal.fire({ icon: "error", title: "خطأ", text: "حدث خطأ أثناء الاتصال بالخادم" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Container */}
      <div className="glass-card w-full max-w-md p-8 animate-fadeInUp">

        {/* Logo Area */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#004D25] flex items-center justify-center gap-3 mb-2">
            <Crown className="w-10 h-10 text-[#D4AF37]" />
            <span>تاج النقاء</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium">سجل كود الكرت وادخل السحب فورا!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name Input */}
          <div className="text-right">
            <label className="block text-[#004D25] font-bold mb-2">الاسم الكامل</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 pl-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition bg-white text-gray-800"
                placeholder="أدخل اسمك هنا"
                required
              />
              <User className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Phone Input */}
          <div className="text-right">
            <label className="block text-[#004D25] font-bold mb-2">رقم الهاتف</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full p-4 pl-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition bg-white text-gray-800 text-left font-mono tracking-widest"
                placeholder="771234567"
                dir="ltr"
                required
              />
              <Phone className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <p className="text-xs text-gray-400 mt-2 mr-1">
              • يجب أن يبدأ الرقم بـ 7 ويتكون من 9 أرقام
            </p>
          </div>

          {/* Scratch Code Input */}
          <div className="text-right">

            {/* Visual Helper */}
            <div className="scratch-guide mb-4 text-center bg-white/50 p-4 rounded-xl border border-dashed border-gray-300">
              <div className="scratch-card-visual">
                <div className="bg-[#004D25] text-white text-xs font-bold p-1">تاج النقاء</div>
                <div className="flex-1 bg-gray-400 relative flex items-center justify-center overflow-hidden">
                  <span className="font-mono font-bold text-gray-800 bg-white/90 px-2 py-1 rounded border border-dashed border-yellow-500 z-0">
                    TAJ-XXXXXX
                  </span>
                  <Hand className="scratch-hand-icon absolute text-red-600 w-8 h-8 z-10 drop-shadow-md" />
                </div>
              </div>
              <p className="text-[#004D25] text-xs font-bold">امسح المنطقة الرمادية خلف الكرت لكشف الكود</p>
            </div>

            <label className="block text-[#004D25] font-bold mb-2">كود الخدش</label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition bg-white text-gray-800 text-center font-bold tracking-[2px]"
                placeholder="TAJ-XXXXXX"
                dir="ltr"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-br from-[#004D25] to-[#003318] text-white font-bold text-xl py-4 rounded-xl shadow-lg shadow-[#004D25]/30 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 border-b-4 border-[#003318] active:translate-y-0 active:border-b-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>دخول السحب</span>
                <LogIn className="w-6 h-6" />
              </>
            )}
          </button>

        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} مؤسسة تاج النقاء. جميع الحقوق محفوظة.
          </p>
        </div>

      </div>
    </main>
  );
}
