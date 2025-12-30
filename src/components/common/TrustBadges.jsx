import { Shield, Truck, RefreshCw, CreditCard } from 'lucide-react'

export default function TrustBadges() {
    const badges = [
        {
            icon: Shield,
            title: "100% Secure",
            subtitle: "Payment"
        },
        {
            icon: Truck,
            title: "Free Shipping",
            subtitle: "On orders ₹999+"
        },
        {
            icon: RefreshCw,
            title: "30-Day Returns",
            subtitle: "No questions"
        },
        {
            icon: CreditCard,
            title: "COD Available",
            subtitle: "₹50 fee"
        }
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8">
            {badges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4 bg-white border border-gray-100 rounded hover:shadow-md transition-shadow">
                    <badge.icon className="h-8 w-8 text-gold mb-2" />
                    <h4 className="text-sm font-bold text-luxury uppercase tracking-wide">{badge.title}</h4>
                    <p className="text-xs text-ash-grey mt-1">{badge.subtitle}</p>
                </div>
            ))}
        </div>
    )
}
