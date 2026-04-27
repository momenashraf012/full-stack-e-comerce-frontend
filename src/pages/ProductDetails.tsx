import { useParams, Link } from 'react-router-dom';
import { useGetProductQuery, useGetReviewsQuery } from '../features/products/productApi';
import { useAddToCartMutation } from '../features/cart/cartApi';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';
import Button from '../components/ui/Button';
import { cn } from '../utils';
import { RootState } from '../app/store';
import toast from 'react-hot-toast';

const Stars: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(
            "w-4 h-4",
            star <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-on-surface/10 fill-on-surface/10"
          )}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: product, isLoading, error } = useGetProductQuery(id!);
  const { data: reviews, isLoading: reviewsLoading } = useGetReviewsQuery(id!);

  const handleAddToCart = async () => {
    if (!product) return;
    if (isAuthenticated) {
      try {
        await addToCart({ productId: product.id }).unwrap();
        toast.success('تمت الإضافة للسلة بنجاح!', {
          style: { borderRadius: '10px', background: '#333', color: '#fff' },
        });
      } catch (err: any) {
        toast.error('فشل في إضافة المنتج للسلة');
      }
    } else {
      dispatch(addItem(product));
      toast.success('تمت الإضافة للسلة محلياً');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-on-surface">المنتج غير موجود</h1>
        <Link to="/products">
          <Button variant="ghost">العودة للمنتجات</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Product Image */}
        <div className="bg-surface-container rounded-3xl overflow-hidden aspect-square border border-outline-variant/5 shadow-inner">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-500" 
          />
        </div>

        {/* Product Info */}
        <div className="space-y-8 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-tertiary/10 text-tertiary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                {typeof product.category === 'object' ? product.category.name : product.category}
              </span>
              <div className="flex items-center gap-2">
                <Stars rating={product.ratingsAverage || 0} />
                <span className="text-sm text-on-surface/40">({product.ratingsQuantity || 0})</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface leading-tight">
              {product.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-primary">
              {product.price.toLocaleString()} ج.م
            </span>
            {product.priceAfterDiscount && (
               <span className="text-on-surface/40 line-through text-xl">
                {product.priceAfterDiscount.toLocaleString()} ج.م
              </span>
            )}
          </div>

          <p className="text-on-surface/60 text-lg leading-relaxed border-t border-b border-outline-variant/10 py-8 whitespace-pre-wrap font-medium">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg" 
              className="flex-1 h-14 rounded-full text-lg shadow-xl shadow-primary/20"
              onClick={handleAddToCart}
              isLoading={isAddingToCart}
            >
              إضافة إلى السلة
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              className="h-14 w-14 rounded-full p-0 flex items-center justify-center shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-outline-variant/10">
            <div className="flex items-center gap-3 text-sm text-on-surface/60">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
              دفع آمن
            </div>
            <div className="flex items-center gap-3 text-sm text-on-surface/60">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.4-1.4 1"/><path d="m4 10 2 2 2-2"/><path d="M21 15V9"/><path d="M21 9c0-2-1.5-3-3.5-3S14 7.5 14 9.5s1.5 3 3.5 3 3.5 1 3.5 3-1.5 3-3.5 3-3.5-1.5-3.5-3.5"/><path d="M11 9c-.3-.6-.8-1-1.4-1h-3c-1.1 0-2 .9-2 2s.9 2 2 2h3c1.1 0 2 .9 2 2s-.9 2-2 2H7c-.6 0-1.1-.4-1.4-1"/></svg>
              </div>
              أفضل الأسعار
            </div>
            <div className="flex items-center gap-3 text-sm text-on-surface/60">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M15 18H9"/></svg>
              </div>
              شحن سريع
            </div>
            <div className="flex items-center gap-3 text-sm text-on-surface/60">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="m12 7v5l2 2"/></svg>
              </div>
              ضمان 12 شهر
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="space-y-10">
        <div className="flex items-center justify-between border-b border-outline-variant/10 pb-6">
          <h2 className="text-2xl font-headline font-bold text-on-surface">آراء العملاء</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-on-surface">{product.ratingsAverage || 0} من 5</div>
              <div className="text-sm text-on-surface/40">بناءً على {product.ratingsQuantity || 0} تقييم</div>
            </div>
            <Stars rating={product.ratingsAverage || 0} />
          </div>
        </div>

        {reviewsLoading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-surface-container animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-surface-container/30 p-6 rounded-3xl border border-outline-variant/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {review.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">{review.user?.name || 'مستخدم'}</div>
                      <div className="text-xs text-on-surface/40">{new Date(review.createdAt).toLocaleDateString('ar-EG')}</div>
                    </div>
                  </div>
                  <Stars rating={review.ratings} />
                </div>
                <p className="text-on-surface/70 leading-relaxed italic">
                  "{review.title || 'لا يوجد تعليق'}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-container/20 rounded-3xl border border-dashed border-outline-variant/30 flex flex-col items-center gap-4">
             <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-on-surface/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v5"/><path d="M12 16h.01"/></svg>
            </div>
            <p className="text-on-surface/40">لا توجد مراجعات لهذا المنتج بعد. كن أول من يضيف رأيه!</p>
            <Button variant="ghost" className="rounded-full">إضافة مراجعة</Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetails;
