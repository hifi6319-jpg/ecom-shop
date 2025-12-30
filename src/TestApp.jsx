import { Routes, Route } from 'react-router-dom'

function TestApp() {
    return (
        <div className="min-h-screen bg-white p-8">
            <h1 className="text-4xl font-bold text-black">App is Working!</h1>
            <p className="text-lg mt-4">If you see this, React is rendering correctly.</p>
            <div className="mt-8 p-4 bg-blue-100 border border-blue-300 rounded">
                <p>Testing basic functionality...</p>
                <ul className="list-disc ml-6 mt-2">
                    <li>✓ React is loaded</li>
                    <li>✓ Tailwind CSS is working</li>
                    <li>✓ Router is initialized</li>
                </ul>
            </div>
        </div>
    )
}

export default TestApp
