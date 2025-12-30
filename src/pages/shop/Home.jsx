import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Award, Scissors, Truck, ShoppingBag, Shield, Play } from 'lucide-react'

// Helper Component for Animated Stats
const CountUpStat = ({ end, suffix = '', label, decimals = 0 }) => {
    const [count, setCount] = useState(0)
    const countRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.5 }
        )

        if (countRef.current) {
            observer.observe(countRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let startTime
        const duration = 2000 // 2 seconds animation

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime

            if (progress < duration) {
                const percentage = progress / duration
                // Ease out quart
                const easeOut = 1 - Math.pow(1 - percentage, 4)

                setCount(end * easeOut)
                requestAnimationFrame(animate)
            } else {
                setCount(end)
            }
        }

        requestAnimationFrame(animate)
    }, [isVisible, end])

    return (
        <div ref={countRef} className="text-center">
            <div className="text-3xl md:text-5xl font-black text-white mb-2">
                {count.toFixed(decimals)}{suffix}
            </div>
            <div className="text-xs font-bold tracking-widest uppercase text-ash-grey">
                {label}
            </div>
        </div>
    )
}
import TrustBadges from '../../components/common/TrustBadges'

export default function Home() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    // Featured products - will use actual product data later
    const featuredProducts = [
        {
            id: 1,
            name: 'Classic Navy Tee',
            price: 599,
            image: '/images/product-navy.png',
            color: 'Navy Blue',
            rating: 4.8
        },
        {
            id: 2,
            name: 'Vibrant Red Tee',
            price: 599,
            image: '/images/product-red.png',
            color: 'Red',
            rating: 4.9
        },
        {
            id: 3,
            name: 'Essential Black Tee',
            price: 549,
            image: 'https://placehold.co/400x400/000000/FFFFFF/png?text=Black+Tee',
            color: 'Black',
            rating: 5.0
        },
        {
            id: 4,
            name: 'Pure White Tee',
            price: 549,
            image: 'https://placehold.co/400x400/FFFFFF/000000/png?text=White+Tee',
            color: 'White',
            rating: 4.7
        },
    ]

    return (
        <div className="min-h-screen bg-luxury-light">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-luxury-dark pt-48 md:pt-60">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero-new.png"
                        alt="Premium T-Shirt Collection"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/60" />
                </div>

                {/* Hero Content */}
                <div className={`relative z - 10 max - w - 7xl mx - auto px - 6 sm: px - 6 lg: px - 8 text - center transition - all duration - 1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} `}>


                    <h1 className="flex flex-col items-center justify-center mb-10 selection:bg-gold selection:text-black">
                        <span className="text-2xl md:text-4xl lg:text-5xl font-light text-white uppercase tracking-[0.3em] mb-2 md:mb-4 animate-slide-in-right">
                            Style Meets
                        </span>
                        <span className="text-6xl md:text-9xl lg:text-[10rem] font-black text-gold uppercase tracking-tighter italic leading-[0.8] animate-scale-in">
                            Comfort
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-ash-grey mb-12 max-w-2xl mx-auto font-medium tracking-wide px-4 uppercase">
                        Premium collection. Finest fabrics. Ultimate comfort.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 w-full">
                        <Link
                            to="/products"
                            className="btn-gold px-8 sm:px-12 py-3 sm:py-4 w-full sm:w-auto justify-center rounded-full sm:rounded-none text-sm sm:text-base shadow-lg sm:shadow-none"
                        >
                            Shop Collection
                        </Link>
                        <Link
                            to="/products"
                            className="btn-outline text-white border-white hover:bg-white hover:text-black hover:border-white px-8 sm:px-12 py-3 sm:py-4 w-full sm:w-auto justify-center rounded-full sm:rounded-none text-sm sm:text-base backdrop-blur-sm sm:backdrop-blur-none"
                        >
                            New Arrivals
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto px-4 border-t border-white/10 pt-8">
                        <CountUpStat end={500} suffix="+" label="Products" />
                        <CountUpStat end={10} suffix="K+" label="Customers" />
                        <CountUpStat end={600} suffix="+" label="Sold Over" />
                    </div>
                </div>
            </section>

            {/* Featured Collection Categories */}
            < section className="py-20 px-6 sm:px-8 max-w-7xl mx-auto" >
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-luxury mb-4 inline-block relative border-b-4 border-gold pb-2 uppercase tracking-tight">
                        Featured Categories
                    </h2>
                    <p className="text-ash-grey text-lg max-w-2xl mx-auto mt-4 px-4 uppercase tracking-wide">
                        Handpicked designs that define modern luxury.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Men's Category */}
                    <Link to="/products?category=Men" className="group relative h-[500px] overflow-hidden cursor-pointer">
                        <div className="absolute inset-0 bg-gray-200">
                            <img
                                src="/images/product-navy.png"
                                alt="Men's Collection"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                            />
                        </div>
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                            <h3 className="text-4xl font-black text-white uppercase tracking-tight mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                Men
                            </h3>
                            <span className="btn-gold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                Shop Now
                            </span>
                        </div>
                    </Link>

                    {/* Women's Category */}
                    <Link to="/products?category=Women" className="group relative h-[500px] overflow-hidden cursor-pointer">
                        <div className="absolute inset-0 bg-gray-200">
                            <img
                                src="/images/hero.png"
                                alt="Women's Collection"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                            />
                        </div>
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                            <h3 className="text-4xl font-black text-white uppercase tracking-tight mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                Women
                            </h3>
                            <span className="btn-gold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                Shop Now
                            </span>
                        </div>
                    </Link>

                    {/* Boys/Kids Category */}
                    <Link to="/products?category=Boys" className="group relative h-[500px] overflow-hidden cursor-pointer md:col-span-2 lg:col-span-1">
                        <div className="absolute inset-0 bg-gray-200">
                            <img
                                src="/images/product-red.png"
                                alt="Boys Collection"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                            />
                        </div>
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                            <h3 className="text-4xl font-black text-white uppercase tracking-tight mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                Boys
                            </h3>
                            <span className="btn-gold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                Shop Now
                            </span>
                        </div>
                    </Link>
                </div>
            </section >

            {/* Bestselling Collection Section */}
            < section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" >
                <div className="text-center mb-10 md:mb-16 animate-fade-in-up">
                    <h2 className="text-3xl md:text-5xl font-bold text-luxury mb-3 md:mb-4 uppercase tracking-tight">
                        Bestselling <span className="text-gold">Collection</span>
                    </h2>
                    <p className="text-lg md:text-xl text-ash-grey max-w-2xl mx-auto px-4 uppercase tracking-wide">
                        Most loved by our customers
                    </p>
                    <div className="mt-4 divider-gold max-w-24 mx-auto" />
                </div>

                {/* Horizontal Scroll Carousel */}
                <div className="flex overflow-x-auto gap-6 md:gap-8 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">
                    {featuredProducts.map((product, index) => (
                        <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-center">
                            <Link
                                to={`/products/${product.id}`}
                                className="block group luxury-card animate-fade-in-up h-full"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Quick View Button */}
                                    <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-center px-4">
                                        <span className="btn-primary text-xs py-2 px-4 w-full shadow-lg backdrop-blur-sm bg-black/90 uppercase tracking-wider">
                                            Quick View
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-gray-300'}`}
                                            />
                                        ))}
                                        <span className="text-xs text-ash-grey ml-2 font-medium">({product.rating})</span>
                                    </div>
                                    <h3 className="text-base font-bold text-jet-black mb-1 group-hover:text-gold transition-colors line-clamp-1 uppercase">
                                        {product.name}
                                    </h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-sm text-ash-grey uppercase tracking-wide">{product.color}</p>
                                        <p className="text-lg font-black text-gold">₹{product.price}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="text-center animate-fade-in">
                    <Link
                        to="/products"
                        className="link-luxury inline-flex items-center gap-2 text-base md:text-lg group font-medium"
                    >
                        View All Products
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section >

            {/* Trust Badges Section */}
            < section className="max-w-7xl mx-auto px-6 sm:px-8 py-12 bg-white" >
                <TrustBadges />
            </section >

            {/* Brand Values - Minimal Luxury */}
            < section className="py-16 md:py-24 border-t border-gray-100 bg-white" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 text-center">
                        <div className="flex flex-col items-center group p-6 rounded-2xl transition-colors hover:bg-gray-50/50">
                            <div className="mb-6 p-4 rounded-full bg-gray-50 group-hover:bg-luxury-dark transition-all duration-500 shadow-sm group-hover:shadow-gold">
                                <Award className="h-8 w-8 text-luxury group-hover:text-gold transition-colors duration-500" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold text-luxury mb-3 uppercase tracking-wider">Premium Cotton</h3>
                            <p className="text-ash-grey text-sm md:text-base leading-relaxed max-w-xs mx-auto">100% quality fabrics for lasting comfort and durability.</p>
                        </div>
                        <div className="flex flex-col items-center group p-6 rounded-2xl transition-colors hover:bg-gray-50/50">
                            <div className="mb-6 p-4 rounded-full bg-gray-50 group-hover:bg-luxury-dark transition-all duration-500 shadow-sm group-hover:shadow-gold">
                                <Scissors className="h-8 w-8 text-luxury group-hover:text-gold transition-colors duration-500" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold text-luxury mb-3 uppercase tracking-wider">Timeless Design</h3>
                            <p className="text-ash-grey text-sm md:text-base leading-relaxed max-w-xs mx-auto">Carefully crafted cuts for the perfect fit every time.</p>
                        </div>
                        <div className="flex flex-col items-center group p-6 rounded-2xl transition-colors hover:bg-gray-50/50">
                            <div className="mb-6 p-4 rounded-full bg-gray-50 group-hover:bg-luxury-dark transition-all duration-500 shadow-sm group-hover:shadow-gold">
                                <Truck className="h-8 w-8 text-luxury group-hover:text-gold transition-colors duration-500" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold text-luxury mb-3 uppercase tracking-wider">Express Delivery</h3>
                            <p className="text-ash-grey text-sm md:text-base leading-relaxed max-w-xs mx-auto">Fast shipping right to your doorstep via WhatsApp.</p>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    )
}
