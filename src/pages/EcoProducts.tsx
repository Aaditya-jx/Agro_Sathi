import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { EcoProduct } from '../types';
import { ShoppingBagIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export const EcoProducts: React.FC = () => {
  const [products, setProducts] = useState<EcoProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All Products', icon: '🌱' },
    { value: 'bio_fertilizer', label: 'Bio Fertilizers', icon: '🧪' },
    { value: 'drip_irrigation', label: 'Drip Irrigation', icon: '💧' },
    { value: 'organic_pesticide', label: 'Organic Pesticides', icon: '🐛' },
    { value: 'seeds', label: 'Organic Seeds', icon: '🌾' },
    { value: 'equipment', label: 'Farm Equipment', icon: '🚜' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'eco_products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EcoProduct));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">🌱 Eco-Friendly Products</h1>
            <p className="mt-1 text-sm text-gray-600">
              Sustainable farming products from verified suppliers
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{product.productName}</h3>
                  {product.price && (
                    <span className="text-lg font-bold text-primary-600">₹{product.price}</span>
                  )}
                </div>
                
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mb-3">
                  {product.category.replace('_', ' ')}
                </span>
                
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {product.location}
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {product.contact}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Supplier: {product.supplier}</p>
                  <button
                    onClick={() => window.open(`tel:${product.contact}`, '_self')}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                  >
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Contact Supplier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🌍 Why Choose Eco-Friendly Products?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="font-semibold text-gray-900 mb-2">Organic</h3>
              <p className="text-sm text-gray-600">Chemical-free and natural solutions</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💧</div>
              <h3 className="font-semibold text-gray-900 mb-2">Water Efficient</h3>
              <p className="text-sm text-gray-600">Reduce water consumption significantly</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌍</div>
              <h3 className="font-semibold text-gray-900 mb-2">Sustainable</h3>
              <p className="text-sm text-gray-600">Environmentally friendly practices</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-semibold text-gray-900 mb-2">Higher Yield</h3>
              <p className="text-sm text-gray-600">Better crop productivity naturally</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
