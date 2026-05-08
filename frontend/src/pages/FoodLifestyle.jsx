import { Leaf, Moon, Sun, Apple } from "lucide-react";

const DIET = [
  { emoji: "🫐", title: "Blueberries", tip: "Rich in antioxidants that help reduce cortisol levels. A handful a day goes a long way." },
  { emoji: "🐟", title: "Fatty Fish", tip: "Salmon, sardines, and mackerel are high in omega-3, which lowers inflammation linked to stress." },
  { emoji: "🥑", title: "Avocado", tip: "Full of B vitamins and healthy fats that support nerve function and hormone balance." },
  { emoji: "🌰", title: "Nuts & Seeds", tip: "Magnesium-rich foods like almonds and pumpkin seeds help relax muscles and calm the nervous system." },
  { emoji: "🍫", title: "Dark Chocolate", tip: "70%+ cocoa triggers endorphins and reduces stress hormones — just 30g a day." },
  { emoji: "🥗", title: "Leafy Greens", tip: "Spinach and kale are packed with folate which helps your brain produce mood-regulating neurotransmitters." },
];

const SLEEP_HYGIENE = [
  { icon: "🕙", tip: "Go to bed and wake up at the same time every day, even on weekends." },
  { icon: "📵", tip: "Avoid screens (phone, TV, laptop) at least 1 hour before bed. Use blue-light filters if needed." },
  { icon: "🌡️", tip: "Keep your bedroom cool — ideally 16–19°C. Your body temperature needs to drop to initiate sleep." },
  { icon: "☕", tip: "Avoid caffeine after 2 PM. It has a half-life of ~5 hours and can disrupt sleep architecture." },
  { icon: "🛏️", tip: "Use your bed only for sleep. Don't work or scroll in bed — keep the association strong." },
  { icon: "📖", tip: "Wind down with light reading, journalling, or gentle stretching for 20–30 min before sleep." },
];

const ROUTINE = [
  { time: "07:00", icon: "🌅", label: "Wake up", detail: "Wake at a fixed time. Expose yourself to natural light within 30 minutes." },
  { time: "07:30", icon: "🚶", label: "Morning walk", detail: "Even 10 minutes of outdoor walking lowers cortisol and boosts serotonin." },
  { time: "08:00", icon: "🥣", label: "Breakfast", detail: "Eat a protein-rich breakfast. Avoid sugary cereals that spike and crash blood sugar." },
  { time: "12:00", icon: "🍱", label: "Lunch", detail: "Take a full break. Step away from screens. Mindful eating reduces stress." },
  { time: "15:00", icon: "💧", label: "Hydrate", detail: "Drink a glass of water. Even mild dehydration increases cortisol." },
  { time: "18:00", icon: "🏋️", label: "Exercise", detail: "30 mins of moderate activity. Any movement reduces the stress hormone adrenaline." },
  { time: "21:00", icon: "📵", label: "Screen off", detail: "Begin your wind-down. Dim lights, put devices away, and journal if helpful." },
  { time: "22:30", icon: "😴", label: "Sleep", detail: "Target 7–9 hours. Your body repairs and consolidates memories during deep sleep." },
];

export default function FoodLifestyle() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10 fade-up">
      <div className="mb-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--rose)]/20 flex items-center justify-center">
          <Leaf size={20} style={{ color: "var(--rose)" }} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Food & Lifestyle</h1>
          <p className="text-sm text-[var(--muted)]">Evidence-based tips to lower stress and improve sleep</p>
        </div>
      </div>

      {/* Diet */}
      <section className="mb-10">
        <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2">
          <Apple size={18} style={{ color: "var(--teal)" }} /> Stress-Busting Foods
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {DIET.map(({ emoji, title, tip }) => (
            <div key={title} className="glass p-5 hover:-translate-y-1 transition-transform duration-200">
              <div className="text-3xl mb-3">{emoji}</div>
              <h3 className="font-display font-semibold mb-1">{title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sleep hygiene */}
      <section className="mb-10">
        <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2">
          <Moon size={18} style={{ color: "var(--violet)" }} /> Sleep Hygiene Tips
        </h2>
        <div className="glass p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SLEEP_HYGIENE.map(({ icon, tip }) => (
            <div key={tip} className="flex items-start gap-3">
              <span className="text-xl mt-0.5">{icon}</span>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Daily routine */}
      <section>
        <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2">
          <Sun size={18} style={{ color: "var(--amber)" }} /> Optimal Daily Routine
        </h2>
        <div className="glass p-6 flex flex-col gap-4">
          {ROUTINE.map(({ time, icon, label, detail }) => (
            <div key={time} className="flex items-start gap-4">
              <span className="text-[var(--muted)] text-xs font-display font-semibold w-12 flex-shrink-0 pt-0.5">{time}</span>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}