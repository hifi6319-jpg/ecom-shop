import { Routes, Route, Link, useLocation } from 'react-router-dom'
import DashboardOverview from './DashboardOverview'
import ProductManager from './ProductManager'
import CategoryManager from './CategoryManager'
import OrderManager from './OrderManager'

export default function AdminDashboard() {
    const location = useLocation()

    const tabs = [
        { name: 'Overview', path: '/admin' },
        { name: 'Products', path: '/admin/products' },
        { name: 'Categories', path: '/admin/categories' },
        { name: 'Orders', path: '/admin/orders' },
    ]

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.name}
                            to={tab.path}
                            className={`${(location.pathname === tab.path || (tab.path !== '/admin' && location.pathname.startsWith(tab.path)))
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/products" element={<ProductManager />} />
                <Route path="/categories" element={<CategoryManager />} />
                <Route path="/orders" element={<OrderManager />} />
            </Routes>
        </div>
    )
}
