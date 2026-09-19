import React from "react";
import { RegisterUser } from "./pages/Register_page";
import { LoginUser } from "./pages/Login_page";
import { Routes, Route } from "react-router-dom";
import { Header } from "./pages/product Page/Header";
import { ProductCardSection } from "./pages/product Page/ProductCardSection";
import { ProductDetails } from "./pages/productDetails/productDetails";
import { Cart } from "./pages/cartDetails/CartDetails";
import { MyOrders } from "./pages/myorders/Orders";
import { Checkout } from "./pages/myorders/CheckOut";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RegisterUser />} />
      <Route path="/login" element={<LoginUser />} />
      <Route path="/product" element={<ProductCardSection />} />
      <Route path="/product/:product_id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<MyOrders />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
};

export default App;
