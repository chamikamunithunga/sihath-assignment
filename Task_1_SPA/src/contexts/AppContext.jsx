import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('urban_harvest_cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('urban_harvest_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                // Import dynamically to avoid top-level await issues if any, or just import at top
                const { itemService } = await import('../services/api');
                const data = await itemService.getAllItems();
                setItems(data.all); // Flattened array for the 'items' state if that's what was expected
                // You might want to store them separately in context too if needed
                setLoading(false);
            } catch (err) {
                console.error("Failed to load items", err);
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const addToCart = (item) => {
        setCart(prev => [...prev, item]);
    };

    const removeFromCart = (itemId) => {
        setCart(prev => {
            const index = prev.findIndex(item => item.id === itemId);
            if (index > -1) {
                const newCart = [...prev];
                newCart.splice(index, 1);
                return newCart;
            }
            return prev;
        });
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => total + item.price, 0);

    return (
        <AppContext.Provider value={{ items, loading, cart, addToCart, removeFromCart, clearCart, cartTotal }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
