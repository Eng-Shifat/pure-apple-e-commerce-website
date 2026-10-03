import { Truck, ShieldCheck, Headphones, RotateCcw } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders over $100",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    subtitle: "100% secure",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "We're here to help",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
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
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Icon size={18} className="text-blue-600" />
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
