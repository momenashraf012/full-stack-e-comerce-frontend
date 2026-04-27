import { useGetProductsQuery, useGetCategoriesQuery, useGetBrandsQuery, useGetSubCategoriesQuery } from '../features/products/productApi';
import { useAddToCartMutation } from '../features/cart/cartApi';
import ProductCard from '../components/ui/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';
import { cn } from '../utils';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '../app/store';
import toast from 'react-hot-toast';

const Products: React.FC = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const selectedBrand = searchParams.get('brand');
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const setSelectedCategory = (id: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set('category', id);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const setSelectedBrand = (id: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set('brand', id);
    } else {
      params.delete('brand');
    }
    setSearchParams(params);
  };
  
  const { data: products, isLoading: productsLoading } = useGetProductsQuery({ 
    category: selectedCategory || undefined,
    brand: selectedBrand || undefined
  });
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: brands, isLoading: brandsLoading } = useGetBrandsQuery();
  const { data: subCategories } = useGetSubCategoriesQuery(selectedCategory || undefined);
  const [addToCart] = useAddToCartMutation();

  const handleAddToCart = async (product: any) => {
    if (isAuthenticated) {
      try {
        await addToCart({ productId: product.id }).unwrap();
        toast.success('تمت الإضافة للسلة بنجاح');
      } catch (err: any) {
        toast.error('فشل في إضافة المنتج للسلة');
      }
    } else {
      dispatch(addItem(product));
      toast.success('تمت الإضافة للسلة محلياً');
    }
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-headline font-bold text-on-surface">جميع المنتجات</h1>
        <p className="text-on-surface/60">تصفح مجموعتنا الواسعة من المنتجات المتميزة</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        {/* Sidebar Filters */}
        <aside className="space-y-10">
          {/* Categories */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-on-surface/40 uppercase tracking-widest">التصنيفات</h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm transition-all text-right",
                  !selectedCategory ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface-container text-on-surface/60 hover:bg-surface-container-high"
                )}
              >
                الكل
              </button>
              {categoriesLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-surface-container animate-pulse rounded-xl" />
                ))
              ) : (
                categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm transition-all text-right whitespace-nowrap",
                      selectedCategory === cat.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface-container text-on-surface/60 hover:bg-surface-container-high"
                    )}
                  >
                    {cat.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* SubCategories */}
          {selectedCategory && subCategories && subCategories.length > 0 && (
            <div className="space-y-5 pt-10 border-t border-outline-variant/10">
              <h3 className="text-xs font-bold text-on-surface/40 uppercase tracking-widest">التصنيفات الفرعية</h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {subCategories.map((sub) => (
                  <span
                    key={sub.id}
                    className="px-4 py-2 rounded-xl text-sm bg-surface-container text-on-surface/60"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Brands */}
          <div className="space-y-5 pt-10 border-t border-outline-variant/10">
            <h3 className="text-xs font-bold text-on-surface/40 uppercase tracking-widest">العلامات التجارية</h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <button
                onClick={() => setSelectedBrand(null)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm transition-all text-right",
                  !selectedBrand ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface-container text-on-surface/60 hover:bg-surface-container-high"
                )}
              >
                الكل
              </button>
              {brandsLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-surface-container animate-pulse rounded-xl" />
                ))
              ) : (
                brands?.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm transition-all text-right whitespace-nowrap",
                      selectedBrand === brand.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface-container text-on-surface/60 hover:bg-surface-container-high"
                    )}
                  >
                    {brand.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main>
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[3/4] bg-surface-container animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                 <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-6 bg-surface-container/30 rounded-3xl border border-dashed border-outline-variant/30">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center text-on-surface/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/><path d="M11 8v4"/><path d="M11 16h.01"/></svg>
              </div>
              <div>
                <p className="text-xl font-headline font-bold text-on-surface">لم يتم العثور على منتجات</p>
                <p className="text-on-surface/60">حاول اختيار تصنيف أو علامة تجارية أخرى</p>
              </div>
              <button 
                onClick={() => { setSelectedCategory(null); setSelectedBrand(null); }}
                className="text-primary font-bold hover:underline"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
