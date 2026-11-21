import './App.css'
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import Cart from "./components/Cart";

import type { Product, CartItem } from "./types/Product";

function App() {

    const [cart, setCart] = useState<CartItem[]>([]);

    function addToCart(product: Product) {

      const existingItem = cart.find(
          (item) => item.id === product.id
      );

      if (existingItem) {

          setCart(
              cart.map((item) =>
                  item.id === product.id
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
              )
          );

      } else {

          setCart([
              ...cart,
              { ...product, quantity: 1 }
          ]);

      }
    }

    function increaseQuantity(productId: number) {
        setCart(
            cart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    }

    function decreaseQuantity(productId: number) {
        setCart(
            cart
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function removeFromCart(productId: number) {
        setCart(
            cart.filter((item) => item.id !== productId)
        );
    }

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <div>

            <Navbar cartCount={cartCount} />

            <Routes>

                <Route
                    path="/"
                    element={
                        <>
                            <Hero />
                            <Categories />
                            <FeaturedProducts addToCart={addToCart} />
                        </>
                    }
                />

                <Route
                    path="/cart"
                    element={
                        <Cart
                            cart={cart}
                            increaseQuantity={increaseQuantity}
                            decreaseQuantity={decreaseQuantity}
                            removeFromCart={removeFromCart}
                        />
                    }
                />

            </Routes>

        </div>
    );
}

export default App;