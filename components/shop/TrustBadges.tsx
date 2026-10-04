import { Truck, ShieldCheck, Headphones, RotateCcw } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Free Shipping",
    tone: "bg-leaf-50 text-leaf-600",
    subtitle: "On orders over $100",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    tone: "bg-brand-50 text-brand-600",
    subtitle: "100% secure",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    tone: "bg-sun-100 text-sun-700",
    subtitle: "We're here to help",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    tone: "bg-leaf-50 text-leaf-600",
    subtitle: "30-day policy",
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="flex items-center gap-3 py-2"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${badge.tone}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {badge.title}
                  </p>
                  <p className="text-gray-400 text-xs">{badge.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
