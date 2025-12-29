import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:static">
                        <div className="sm:max-w-lg">
                            <h1 className="text-4xl font font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                                Premium T-Shirts for Everyone
                            </h1>
                            <p className="mt-4 text-xl text-gray-500">
                                Discover our latest collection of high-quality, comfortable, and stylish t-shirts.
                            </p>
                            <div className="mt-10">
                                <Link to="/products" className="inline-block bg-indigo-600 border border-transparent py-3 px-8 rounded-md font-medium text-white hover:bg-indigo-700">
                                    Shop Collection
                                </Link>
                            </div>
                        </div>
                        {/* Visual element placeholder (can use one of the images in m:/tshirt later) */}
                        <div className="hidden sm:block absolute top-0 -right-20 lg:right-0 w-1/2 h-full bg-gray-100">
                            {/* Image would go here */}
                            <div className="flex items-center justify-center h-full text-gray-400">Featured Image</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Section Placeholder */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Products</h2>
                    <Link to="/products" className="text-indigo-600 hover:text-indigo-500">View all</Link>
                </div>
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {/* Placeholders */}
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="group relative">
                            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                                <div className="w-full h-full flex items-center justify-center text-gray-400">Product {i}</div>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">
                                        <Link to="#">
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            Basic Tee
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">Black</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">$35</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
