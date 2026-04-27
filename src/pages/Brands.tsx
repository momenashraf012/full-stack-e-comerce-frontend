import React from 'react';
import { Link } from 'react-router-dom';
import { useGetBrandsQuery } from '../features/products/productApi';

const Brands: React.FC = () => {
  const { data: brands, isLoading } = useGetBrandsQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-headline font-bold text-on-surface">العلامات التجارية</h1>
        <p className="text-on-surface/60">تصفح منتجاتنا حسب العلامة التجارية المفضلة لديك</p>
      </div>

      {/* Brands Grid */}
      {brands && brands.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/products?brand=${brand.id}`}
              className="group flex flex-col items-center gap-4"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-outline-variant/20 group-hover:border-primary group-hover:shadow-xl transition-all">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-base font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-6 bg-surface-container/30 rounded-3xl border border-dashed border-outline-variant/30">
          <p className="text-xl font-headline font-bold text-on-surface">لا توجد علامات تجارية حالياً</p>
        </div>
      )}
    </div>
  );
};

export default Brands;
