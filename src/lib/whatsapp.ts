export function waitlistWhatsAppLink(phone: string, name: string) {
  const text = `مرحباً ${name} 👋 معك افيكتو، دورك بالطابور قرّب. يرجى الحضور خلال ١٠ دقائق وإرسال "تم" لتأكيد قدومك 🙏`;
  return `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(text)}`;
}

export function reservationWhatsAppLink(phone: string, name: string, dailyNumber: number, time: string) {
  const text = `مرحباً ${name} 👋 معك افيكتو، نذكّرك بحجزك رقم ${dailyNumber} الساعة ${time} اليوم. يرجى إرسال "تم" لتأكيد الحضور 🙏`;
  return `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(text)}`;
}

export function recallWhatsAppLink(phone: string, name: string) {
  const text = `مرحباً ${name} 👋 اشتقنا لك في افيكتو! تعال زورنا قريباً وجرّب أطباقنا الجديدة 🍝🍷`;
  return `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(text)}`;
}
