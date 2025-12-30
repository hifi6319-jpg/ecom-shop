import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ShoppingCart, User, LogOut, Menu, X, Search, Heart, Package, FileText, RefreshCw, Briefcase, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import CountdownTimer from '../common/CountdownTimer'

export default function Navbar() {
    const { user, isAdmin, signOut } = useAuth()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Sale end time (24 hours from now for demo)
    const saleEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
            setSearchQuery('')
            setSearchOpen(false)
        }
    }

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-100 text-luxury shadow-sm"
            >
                {/* Promotional Banner with Countdown */}
                <div className="text-center py-2.5 px-4 text-xs sm:text-sm font-medium bg-luxury-dark text-white border-b border-white/10 block">
                    <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className="hidden sm:inline">FLASH SALE ENDS IN:</span>
                            <span className="sm:hidden">ENDS:</span>
                        </span>
                        <CountdownTimer endTime={saleEndTime} />
                        <span className="hidden sm:inline">|</span>
                        <span>30% OFF - Code: <strong className="text-gold">SAVE30</strong></span>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 sm:h-20 items-center">
                        {/* Logo - Adjusted size and fit as requested */}
                        <Link to="/" className="group flex-shrink-0 flex items-center gap-2">
                            <span className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter transition-colors duration-300 ${isScrolled ? 'text-jet-black' : 'text-jet-black'}`}>
                                BANDLINGO
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            <Link
                                to="/products?category=Men"
                                className="text-sm font-bold text-luxury hover:text-gold transition-colors tracking-widest uppercase"
                            >
                                Men
                            </Link>
                            <Link
                                to="/products?category=Women"
                                className="text-sm font-bold text-luxury hover:text-gold transition-colors tracking-widest uppercase"
                            >
                                Women
                            </Link>
                            <Link
                                to="/products?category=Boys"
                                className="link-underline text-gray-700 hover:text-gray-900 font-medium transition-colors"
                            >
                                Boys
                            </Link>
                            <Link
                                to="/products"
                                className="link-underline text-gray-700 hover:text-gray-900 font-medium transition-colors"
                            >
                                Fresh Picks
                            </Link>
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="link-underline text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                >
                                    Admin
                                </Link>
                            )}
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center space-x-3">
                            {/* Search */}
                            <div className="relative">
                                {searchOpen ? (
                                    <form onSubmit={handleSearch} className="flex items-center animate-scale-in">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search products..."
                                            className="input-premium w-48 py-2 text-sm"
                                            autoFocus
                                            onBlur={() => {
                                                setTimeout(() => setSearchOpen(false), 200)
                                            }}
                                        />
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setSearchOpen(true)}
                                        className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                                        title="Search"
                                    >
                                        <Search className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            {/* Wishlist */}
                            <Link
                                to="/wishlist"
                                className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                                title="Wishlist"
                            >
                                <Heart className="h-5 w-5" />
                            </Link>

                            {/* Cart */}
                            <Link
                                to="/cart"
                                className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                                title="Cart"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 bg-gradient-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
                                    0
                                </span>
                            </Link>

                            {/* User Menu */}
                            {user ? (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to="/profile"
                                        className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                                        title="Profile"
                                    >
                                        <User className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                        title="Sign Out"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="btn-primary text-sm py-2 px-6"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden animate-slide-in-right shadow-2xl overflow-y-auto">
                        <div className="flex flex-col h-full p-6 space-y-6">
                            {/* Menu Header with Close Button */}
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold gradient-text">Menu</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Search Mobile */}
                            <form onSubmit={handleSearch} className="w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="input-premium w-full"
                                />
                            </form>

                            {/* Shop Categories */}
                            <nav className="space-y-1">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Shop Categories</h3>
                                <Link
                                    to="/products?category=Men"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-900 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    Men
                                </Link>
                                <Link
                                    to="/products?category=Women"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-900 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    Women
                                </Link>
                                <Link
                                    to="/products?category=Boys"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-900 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    Boys
                                </Link>
                                <Link
                                    to="/products"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-900 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    Fresh Picks
                                </Link>
                            </nav>

                            {/* Quick Links */}
                            <nav className="space-y-1 pt-4 border-t border-gray-200">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Links</h3>
                                <Link
                                    to="/orders"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    <Package className="h-5 w-5" />
                                    My Orders
                                </Link>
                                <Link
                                    to="/wishlist"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    <Heart className="h-5 w-5" />
                                    Wishlist
                                </Link>
                                <Link
                                    to="/blogs"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    <FileText className="h-5 w-5" />
                                    Blogs
                                </Link>
                                <Link
                                    to="/returns"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    <RefreshCw className="h-5 w-5" />
                                    Returns & Exchanges
                                </Link>
                                <Link
                                    to="/b2b"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    <Briefcase className="h-5 w-5" />
                                    B2B Enquiry
                                </Link>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-base font-medium text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                            </nav>

                            {/* User Actions */}
                            <div className="mt-auto space-y-3 pt-6 border-t border-gray-200">
                                {user ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className="block text-center btn-primary w-full"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleSignOut()
                                                setIsOpen(false)
                                            }}
                                            className="block w-full text-center px-6 py-3 font-semibold text-red-600 rounded-xl border-2 border-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block text-center btn-primary w-full"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}


