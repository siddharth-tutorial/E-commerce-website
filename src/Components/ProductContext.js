import React, { createContext, useContext, useState } from 'react'

const ProductContext = createContext()

export const useCart = () => useContext(ProductContext);
export default function ProductProvider({children }) {
  const [cart,setCart] =useState([])

const addtoCart = (product) => {
  setCart((prevCart) => {
    const existingProduct = prevCart.find((item) => item.id === product.id);
    if (existingProduct) {
      return prevCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 } // ✅ Increment quantity
          : item
      );
    } else {
      return [...prevCart, { ...product, quantity: 1 }]; // First time add
    }
  });
};

  const removetoCart = (id) => {
    setCart((prevItems) => prevItems.filter(item => item.id !== id));
  };
  const increment = (id) => {
  setCart((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    )
  );
};

const decrement = (id) => {
  setCart((prev) =>
    prev.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
  );
};
 const clearCart = () => {
    setCart([]);
  };
  return (
    <ProductContext.Provider value={{cart,addtoCart,removetoCart,decrement,increment,clearCart}}>
        {children }    
    </ProductContext.Provider>
  )
}

