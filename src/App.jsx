import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductsPage from './components/ProductsPage';
import TopSeller from './components/TopSeller';
import Footer from './components/Footer';
import VideoSection from './components/VideoSection';
import Testimonials from './components/Testimonials';
import ProfessionalQA from './components/ProfessionalQA';

// 1. Move your products array HERE (or import it)
const productsData = [
  { id: 1, name: "Royal Ambabari Elephant", price: 1250, category: "Sculpture", material: "Teak Wood", image: "https://media.istockphoto.com/id/484419274/photo/carved-thai-elephant.jpg", tag: "Best Seller" },
  { id: 2, name: "Majestic Peacock Panel", price: 850, category: "Wall Art", material: "Rosewood", image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3", tag: "New" },
  { id: 3, name: "Jaipur Floral Coasters", price: 45, category: "Decor", material: "Sandalwood", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa", tag: "Limited" },
  { id: 4, name: "Vintage Carved Mirror", price: 2100, category: "Furniture", material: "Sheesham", image: "https://images.unsplash.com/photo-1618220179428-22790b461013", tag: "Premium" },
  { id: 5, name: "Hand-Carved Radha Krishna", price: 3200, category: "Sculpture", material: "White Kadam Wood", image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66", tag: "Rare" },
  { id: 6, name: "Gilded Floral Trunk", price: 1800, category: "Furniture", material: "Mango Wood", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88", tag: "Hand-Painted" },
  { id: 7, name: "Ornate Lattice Screen", price: 2750, category: "Furniture", material: "Rosewood", image: "https://images.unsplash.com/photo-1505693314120-0d443867891c", tag: "Masterpiece" },
  { id: 8, name: "Miniature Jharokha Window", price: 320, category: "Wall Art", material: "Teak Wood", image: "https://images.unsplash.com/photo-1561839561-b13bcfe95249", tag: "Trending" },
  { id: 9, name: "Sacred Nandi Figurine", price: 550, category: "Sculpture", material: "Black Ebony", image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81", tag: "Spiritual" },
  { id: 10, name: "Lotus Petal Serving Bowl", price: 120, category: "Decor", material: "Walnut Wood", image: "https://images.unsplash.com/photo-1594913785162-e6785b423bd2", tag: "Eco-Friendly" },
  { id: 11, name: "Grandmaster Chess Suite", price: 1450, category: "Decor", material: "Ebony & Boxwood", image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461", tag: "Collector's Item" },
  { id: 12, name: "Dashavatara Wall Frieze", price: 4500, category: "Wall Art", material: "Antique Teak", image: "https://images.unsplash.com/photo-1561350111-7dad5f13d883", tag: "Heritage Elite" }
];

const App = () => {
  const [activePage, setPage] = useState('home');
  const [cart, setCart] = useState([]);

  // Helper to add items to cart
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  return (
    <div className="bg-[#F9F8F6] min-h-screen">
      <Navbar 
        setPage={setPage} 
        activePage={activePage} 
        cartCount={cart.length} 
      />

      <main>
        {activePage === 'home' ? (
          <>
            <Hero setPage={setPage} />
            <TopSeller products={productsData} setPage={setPage} />
            <VideoSection/>
            <Testimonials/>
            <ProfessionalQA/>
          </>
        ) : activePage === 'products' ? (
          /* CRITICAL: Pass the products and addToCart props here */
          <ProductsPage 
            products={productsData} 
            addToCart={addToCart} 
          />
        ) : (
          <div className="pt-40 min-h-screen px-6 text-center">
            <h1 className="text-6xl font-serif italic mb-8 capitalize">{activePage}</h1>
            <p className="text-stone-400">Coming Soon...</p>
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
};

export default App;