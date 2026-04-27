import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { removeItem as removeLocalItem, updateQuantity as updateLocalQuantity } from '../features/cart/cartSlice';
import { useGetCartQuery, useUpdateQuantityMutation, useRemoveItemMutation } from '../features/cart/cartApi';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items: localItems, totalAmount: localTotal } = useSelector((state: RootState) => state.cart);

  // API Hooks
  const { data: serverCart, isLoading: isCartLoading } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateQuantityApi] = useUpdateQuantityMutation();
  const [removeItemApi] = useRemoveItemMutation();

  // Unified data
  const items = isAuthenticated ? serverCart?.data.cartItems || [] : localItems;
  const totalAmount = isAuthenticated ? serverCart?.data.totalCartPrice || 0 : localTotal;

  const handleUpdateQuantity = async (id: string, quantity: number, isAppliedToServer: boolean) => {
    if (isAuthenticated && isAppliedToServer) {
      try {
        await updateQuantityApi({ itemId: id, quantity }).unwrap();
      } catch (err) {
        toast.error('فشل في تحديث الكمية');
      }
    } else {
      dispatch(updateLocalQuantity({ id, quantity }));
    }
  };

  const handleRemove = async (id: string, isAppliedToServer: boolean) => {
    if (isAuthenticated && isAppliedToServer) {
      try {
        await removeItemApi(id).unwrap();
        toast.success('تم حذف المنتج');
      } catch (err) {
        toast.error('فشل في حذف المنتج');
      }
    } else {
      dispatch(removeLocalItem(id));
    }
  };

  if (isCartLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center text-on-surface/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold text-on-surface">سلة التسوق فارغة</h1>
          <p className="text-on-surface/60">يبدو أنك لم تضف أي منتجات إلى سلتك بعد.</p>
        </div>
        <Link to="/products">
          <Button size="lg" className="rounded-full">ابدأ التسوق</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold text-on-surface mb-8">سلة التسوق</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: any) => {
            const id = isAuthenticated ? item._id : item.id;
            const title = isAuthenticated ? item.product?.title : item.title;
            const image = isAuthenticated ? item.product?.imageCover : item.image;
            const price = isAuthenticated ? item.price : item.price;
            const quantity = item.quantity;
            const category = isAuthenticated ? item.product?.category?.name || 'منتج' : item.category;

            return (
              <div 
                key={id} 
                className="bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/10 flex items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <div className="w-24 h-24 bg-surface-container rounded-xl shrink-0 overflow-hidden">
                  <img src={image} alt={title} className="w-full h-full object-contain p-2" />
                </div>
                
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="font-headline font-semibold text-on-surface truncate text-lg">{title}</h3>
                  <p className="text-sm text-on-surface/40">{category}</p>
                  <p className="text-primary font-bold mt-2 text-lg">{price?.toLocaleString()} ج.م</p>
                </div>

                <div className="flex flex-col items-end gap-6">
                  <button 
                    onClick={() => handleRemove(id, true)}
                    className="text-on-surface/20 hover:text-error transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                  
                  <div className="flex items-center bg-surface-container-low rounded-xl p-1 border border-outline-variant/10">
                    <button 
                      onClick={() => handleUpdateQuantity(id, Math.max(1, quantity - 1), true)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                    </button>
                    <span className="w-10 text-center font-bold text-on-surface">{quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(id, quantity + 1, true)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-lg border border-outline-variant/10 space-y-6 sticky top-24">
            <h2 className="text-xl font-headline font-bold text-on-surface">ملخص الطلب</h2>
            
            <div className="space-y-3 border-b border-outline-variant/10 pb-6">
              <div className="flex justify-between text-on-surface/60">
                <span>المجموع الفرعي</span>
                <span>{totalAmount.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between text-on-surface/60">
                <span>الشحن</span>
                <span className="text-green-600 font-medium">مجاني</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-lg font-bold">الإجمالي</span>
              <span className="text-2xl font-bold text-primary">{totalAmount.toLocaleString()} ج.م</span>
            </div>

            <Link to="/checkout" className="block w-full">
              <Button className="w-full h-14 rounded-full text-lg shadow-xl shadow-primary/20">
                إتمام الشراء
              </Button>
            </Link>
            
            <Link to="/products" className="block text-center text-sm text-on-surface/60 hover:text-primary transition-colors">
              متابعة التسوق
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
