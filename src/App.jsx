import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductsPage from './components/ProductsPage';
import TopSeller from './components/TopSeller';
import Footer from './components/Footer';
import VideoSection from './components/VideoSection';
import Testimonials from './components/Testimonials';
import ProfessionalQA from './components/ProfessionalQA';
import CartSidebar from './components/CartSidebar';
import AboutUs from './components/useCase';
import UseCases from './components/useCase';

const productsData = [
  { id: 1, name: "Royal Ambabari Elephant", price: 1250, category: "Sculpture", material: "Teak Wood", image: "https://media.istockphoto.com/id/484419274/photo/carved-thai-elephant.jpg", tag: "Best Seller" },
  { id: 2, name: "Majestic Peacock Panel", price: 850, category: "Wall Art", material: "Rosewood", image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3", tag: "New" },
  { id: 4, name: "Vintage Carved Mirror", price: 2100, category: "Furniture", material: "Sheesham", image: "https://images.unsplash.com/photo-1618220179428-22790b461013", tag: "Premium" },
  { id: 5, name: "Hand-Carved Radha Krishna", price: 3200, category: "Sculpture", material: "White Kadam Wood", image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66", tag: "Rare" },
  { id: 12, name: "Dashavatara Wall Frieze", price: 4500, category: "Wall Art", material: "Antique Teak", image: "https://images.unsplash.com/photo-1561350111-7dad5f13d883", tag: "Heritage Elite" }
];

const App = () => {
  const [activePage, setPage] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('jaipur_art_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('jaipur_art_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const cartItem = { ...product, cartId: Date.now() + Math.random() };
    setCart((prev) => [...prev, cartItem]);
    setIsCartOpen(true); 
  };

  const removeFromCart = (cartIdToRemove) => {
    setCart((prev) => prev.filter(item => item.cartId !== cartIdToRemove));
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <>
            <Hero setPage={setPage} />
            <TopSeller products={productsData} setPage={setPage} addToCart={addToCart} cart={cart} />
            <VideoSection />
            <Testimonials />
            <ProfessionalQA />
          </>
        );
      case 'products':
        return <ProductsPage products={productsData} addToCart={addToCart} cart={cart} />;
      case 'use-cases':
        return <UseCases />;
      default:
        return <Hero setPage={setPage} />;
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-stone-900 selection:bg-[#C5A059] selection:text-white">
      <Navbar 
        setPage={setPage} 
        activePage={activePage} 
        cartCount={cart.length} 
        openCart={() => setIsCartOpen(true)} 
      />
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        removeFromCart={removeFromCart} 
      />
      <main className="pt-0">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;