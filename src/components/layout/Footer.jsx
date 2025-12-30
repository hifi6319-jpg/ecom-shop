import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-luxury-dark text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Info */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="mb-6 block">
                            <span className="text-2xl font-black uppercase tracking-tighter text-white">
                                BANDLINGO
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Redefining modern streetwear with premium quality and timeless design.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/products?category=Men" className="text-ash-grey hover:text-gold transition-colors text-sm">
                                    Men
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?category=Women" className="text-ash-grey hover:text-gold transition-colors text-sm">
                                    Women
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?category=Boys" className="text-ash-grey hover:text-gold transition-colors text-sm">
                                    Boys
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-ash-grey hover:text-gold transition-colors text-sm">
                                    Fresh Picks
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Customer Service</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/orders" className="text-ash-grey hover:text-gold transition-colors text-sm">
                                    My Orders
                                </Link>
                            </li>
                            <li>
                                <Link to="/wishlist" className="text-ash-grey hover:text-gold transition-colors text-sm">
                                    Wishlist
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="text-ash-grey hover:text-gold transition-colors text-sm">
                                    Returns & Exchanges
                                </Link>
                            </li>
                            <li>
                                <Link to="/b2b" className="text-ash-grey hover:text-gold transition-colors text-sm">
                                    B2B Enquiry
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-ash-grey text-sm">
                                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <a href="mailto:support@bandlingo.com" className="hover:text-gold transition-colors">
                                    support@bandlingo.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-ash-grey text-sm">
                                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <a href="tel:+911234567890" className="hover:text-gold transition-colors">
                                    +91 123 456 7890
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-ash-grey text-sm">
                                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <span>Mumbai, Maharashtra, India</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-ash-grey text-sm">
                            © {currentYear} Bandlingo. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link to="/privacy" className="text-ash-grey hover:text-gold transition-colors text-sm">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-ash-grey hover:text-gold transition-colors text-sm">
                                Terms of Service
                            </Link>
                            <Link to="/blogs" className="text-ash-grey hover:text-gold transition-colors text-sm">
                                Blog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
