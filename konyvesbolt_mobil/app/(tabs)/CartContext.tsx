import React, { createContext, useContext, useState, ReactNode } from 'react';

// Típus definiálása a kosár tartalmához
export type CartItem = {
  ISBN: string;
  cim: string;
  ar: number;
  mennyiseg: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (ISBN: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.ISBN === product.ISBN);
      if (existingItem) {
        return prevCart.map((item) =>
          item.ISBN === product.ISBN ? { ...item, mennyiseg: item.mennyiseg + 1 } : item
        );
      }
      return [...prevCart, { ISBN: product.ISBN, cim: product.cim, ar: product.ar, mennyiseg: 1 }];
    });
  };

  const removeFromCart = (ISBN: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.ISBN !== ISBN));
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((sum, item) => sum + item.ar * item.mennyiseg, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);