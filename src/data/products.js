// src/data/products.js
export const products = [
  {
    id: 1,
    title: 'Afghan Hound',
    price: 2000.00,
    image: new URL('../assets/dog_pics/dog1.jpg', import.meta.url).href,
    description: 'Elegant and long-haired.'
  },
  { id: 2, title: 'Finnish Laphund', price: 1500.00, image: new URL('../assets/dog_pics/dog2.jpg', import.meta.url).href, description: 'Friendly family dog.' },
  
];