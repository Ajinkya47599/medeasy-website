import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const addToCart = (medicine, qty) => {
        setCart((prevCart) => {
            const existItem = prevCart.find((x) => x.medicine === medicine._id);
            let newCart;
            if (existItem) {
                newCart = prevCart.map((x) =>
                    x.medicine === existItem.medicine ? { ...x, qty } : x
                );
            } else {
                newCart = [...prevCart, {
                    medicine: medicine._id,
                    name: medicine.name,
                    price: medicine.price,
                    image: medicine.image,
                    requiresPrescription: medicine.requiresPrescription,
                    qty
                }];
            }
            localStorage.setItem('cartItems', JSON.stringify(newCart));
            return newCart;
        });
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => {
            const newCart = prevCart.filter((x) => x.medicine !== id);
            localStorage.setItem('cartItems', JSON.stringify(newCart));
            return newCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
