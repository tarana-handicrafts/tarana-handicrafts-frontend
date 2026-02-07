// Product type definition
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  material: string;
  image: string;
  tag?: string;
}

// Cart item extends Product with cartId
export interface CartItem extends Product {
  cartId: number;
}

// Sample products data - replace with API call in production
export const productsData: Product[] = [
  {
    id: 1,
    name: "Royal Ambabari Elephant",
    price: 1250,
    category: "Sculpture",
    material: "Teak Wood",
    image: "https://media.istockphoto.com/id/484419274/photo/carved-thai-elephant.jpg",
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Majestic Peacock Panel",
    price: 850,
    category: "Wall Art",
    material: "Rosewood",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3",
    tag: "New",
  },
  {
    id: 4,
    name: "Vintage Carved Mirror",
    price: 2100,
    category: "Furniture",
    material: "Sheesham",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013",
    tag: "Premium",
  },
  {
    id: 5,
    name: "Hand-Carved Radha Krishna",
    price: 3200,
    category: "Sculpture",
    material: "White Kadam Wood",
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66",
    tag: "Rare",
  },
  {
    id: 12,
    name: "Dashavatara Wall Frieze",
    price: 4500,
    category: "Wall Art",
    material: "Antique Teak",
    image: "https://images.unsplash.com/photo-1561350111-7dad5f13d883",
    tag: "Heritage Elite",
  },
];
