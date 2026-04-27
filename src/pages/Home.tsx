import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types';
import { useDispatch } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';

import { useGetProductsQuery, useGetCategoriesQuery } from '../features/products/productApi';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  
  const { data: products, isLoading: productsLoading } = useGetProductsQuery({ limit: 8 });
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();

  const handleAddToCart = (product: Product) => {
    dispatch(addItem(product));
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full bg-surface-container overflow-hidden rounded-3xl container mx-auto">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 space-y-6">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-on-surface leading-tight">
            اكتشف عالم الفخامة <br />
            <span className="text-primary italic">في كل تفصيلة</span>
          </h1>
          <p className="max-w-xl text-lg text-on-surface/70 leading-relaxed font-body">
            احصل على أفضل المنتجات الحصرية بأسعار تنافسية. جودة لا تضاهى وتجربة تسوق فريدة تنتظرك.
          </p>
          <div className="flex gap-4">
            <Link to="/products">
              <Button size="lg" className="rounded-full">تسوق الآن</Button>
            </Link>
            <Button variant="secondary" size="lg" className="rounded-full bg-white/50 backdrop-blur-sm border-none">
              اكتشف المزيد
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-headline font-bold text-on-surface">تسوق حسب الفئة</h2>
          <Link to="/products" className="text-primary font-medium hover:underline">عرض الكل</Link>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-48 bg-surface-container animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories?.map((cat, index) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className={`group relative overflow-hidden rounded-2xl ${
                  index === 0 ? 'sm:col-span-2 h-64' : 'h-48'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-headline font-bold text-xl">{cat.name}</h3>
                  <span className="text-white/70 text-sm group-hover:text-white transition-colors">
                    تسوق الآن &larr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-headline font-bold text-on-surface">الأكثر مبيعاً</h2>
          <Link to="/products" className="text-primary font-medium hover:underline">عرض الكل</Link>
        </div>
        
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-surface-container animate-pulse rounded-lg" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-on-surface/50">لا يوجد منتجات حالياً</div>
        )}
      </section>
      
      {/* Banner Section */}
      <section className="container mx-auto px-4">
        <div className="bg-tertiary/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-tertiary/5">
          <div className="space-y-4 text-center md:text-right">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">خصم 20%</span>
            <h3 className="text-3xl font-headline font-bold text-on-surface">مجموعة الصيف الجديدة</h3>
            <p className="text-on-surface/60 max-w-md">اكتشف أحدث صيحات الموضة لهذا الموسم. تشكيلة متنوعة من الملابس العصرية بخامات فاخرة وتصاميم مميزة.</p>
            <Link to="/products"><Button variant="primary" className="rounded-full">تسوق الآن</Button></Link>
          </div>
          <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden shadow-lg border border-white/20">
             <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
              alt="مجموعة الصيف"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
