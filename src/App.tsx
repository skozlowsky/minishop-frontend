import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { ProductList } from './components/product-list';
import { Cart } from './components/cart';
import { UserSettings } from './components/user-settings';
import {useCart} from "./hooks/useCart.ts";

import './App.css'

function App() {
    const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
    const [userEmail, setUserEmail] = useState(() =>
        localStorage.getItem('userEmail') || 'default@example.com'
    );

    const { items: cartItems } = useCart();

    useEffect(() => {
        if (!localStorage.getItem('userEmail')) {
            setIsUserSettingsOpen(true);
        }
    }, []);

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link to="/" className="text-xl font-bold text-gray-800">
                                    MyShop
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setIsUserSettingsOpen(true)}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                    title={userEmail}
                                >
                                    <User className="h-6 w-6" />
                                </button>
                                <Link
                                    to="/cart"
                                    className="p-2 rounded-full hover:bg-gray-100 relative"
                                >
                                    <ShoppingCart className="h-6 w-6" />
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        <Route path="/" element={<ProductList />} />
                        <Route path="/cart" element={<Cart />} />
                    </Routes>
                </main>

                <UserSettings
                    isOpen={isUserSettingsOpen}
                    onClose={() => setIsUserSettingsOpen(false)}
                    userEmail={userEmail}
                    onUpdateEmail={setUserEmail}
                />
            </div>
        </BrowserRouter>
    );
}

export default App
