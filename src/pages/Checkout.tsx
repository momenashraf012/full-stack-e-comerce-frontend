import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useCreateCashOrderMutation, useCreateVodafoneCashOrderMutation } from '../features/orders/orderApi';
import { useGetCartQuery, useClearCartApiMutation } from '../features/cart/cartApi';
import { clearCart } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  details: yup.string().required('تفاصيل العنوان مطلوبة'),
  phone: yup.string().required('رقم الهاتف مطلوب'),
  city: yup.string().required('المدينة مطلوبة'),
  vodafoneNumber: yup.string().when('paymentMethod', {
    is: 'vodafoneCash',
    then: (schema: yup.StringSchema) => schema.required('رقم فودافون كاش مطلوب'),
  } as any),
});

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: cart } = useGetCartQuery();
  const [clearCartApi] = useClearCartApiMutation();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'vodafoneCash'>('cash');
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const [createCashOrder, { isLoading: isCashLoading }] = useCreateCashOrderMutation();
  const [createVodafoneOrder, { isLoading: isVodafoneLoading }] = useCreateVodafoneCashOrderMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (paymentMethod === 'cash') {
        const payload = {
          shippingAddress: {
            details: data.details,
            phone: data.phone,
            city: data.city,
          },
        };
        await createCashOrder(payload).unwrap();
        toast.success('تم إنشاء الطلب بنجاح!');
      } else {
        if (!screenshot) {
          toast.error('يرجى إرفاق صورة التحويل');
          return;
        }
        if (!data.vodafoneNumber) {
          toast.error('رقم فودافون كاش مطلوب');
          return;
        }
        const formData = new FormData();
        formData.append('shippingAddress[details]', data.details);
        formData.append('shippingAddress[phone]', data.phone);
        formData.append('shippingAddress[city]', data.city);
        formData.append('vodafoneCashNumber', data.vodafoneNumber);
        formData.append('paymentScreenshot', screenshot);

        await createVodafoneOrder(formData).unwrap();
        toast.success('تم إرسال الطلب، بانتظار تأكيد الدفع');
      }

      // Clear cart after successful order
      dispatch(clearCart());
      try { await clearCartApi().unwrap(); } catch {}
      navigate('/orders');
    } catch (err: any) {
      toast.error(err.data?.message || 'فشل في إتمام الطلب');
    }
  };

  if (!cart || cart.data.cartItems.length === 0) {
    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold">سلتك فارغة</h1>
            <Button onClick={() => navigate('/products')} variant="ghost" className="mt-4">العودة للتسوق</Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-headline font-bold text-on-surface mb-12">إتمام الطلب</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Shipping & Payment */}
        <div className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-xl font-bold border-b border-outline-variant/10 pb-4">عنوان الشحن</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="المدينة" {...register('city')} error={errors.city?.message} />
              <Input label="رقم الهاتف" {...register('phone')} error={errors.phone?.message} />
              <div className="md:col-span-2">
                <Input label="تفاصيل العنوان (الشارع، المبنى، الشقة)" {...register('details')} error={errors.details?.message} />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold border-b border-outline-variant/10 pb-4">طريقة الدفع</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => setPaymentMethod('cash')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-outline-variant/10'}`}
              >
                <div className="font-bold text-lg mb-1">الدفع عند الاستلام</div>
                <div className="text-sm text-on-surface/60">ادفع نقداً عند استلام طلبك</div>
              </div>

              <div 
                onClick={() => setPaymentMethod('vodafoneCash')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'vodafoneCash' ? 'border-primary bg-primary/5' : 'border-outline-variant/10'}`}
              >
                <div className="font-bold text-lg mb-1">فودافون كاش</div>
                <div className="text-sm text-on-surface/60">تحويل مباشر وسريع</div>
              </div>
            </div>

            {paymentMethod === 'vodafoneCash' && (
              <div className="bg-surface-container/30 p-8 rounded-3xl border border-primary/20 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="space-y-3">
                    <p className="font-bold text-primary">حول المبلغ إلى الرقم التالي:</p>
                    <div className="text-3xl font-mono font-bold tracking-tighter text-on-surface">01012345678</div>
                    <p className="text-sm text-on-surface/60 italic">الرجاء إرفاق لقطة شاشة للتحويل لتأكيد الطلب</p>
                </div>

                <Input label="رقم فودافون كاش (الذي حولت منه)" {...register('vodafoneNumber')} error={errors.vodafoneNumber?.message} />
                
                <div className="space-y-2">
                    <label className="block text-sm font-bold mb-2">لقطة شاشة التحويل</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={onFileChange}
                      className="block w-full text-sm text-on-surface/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-primary-dark"
                    />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-xl border border-outline-variant/10 space-y-8 sticky top-24">
            <h2 className="text-2xl font-headline font-bold text-on-surface">ملخص الطلب</h2>
            
            <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {cart.data.cartItems.map((item) => (
                <div key={item._id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-surface-container rounded-lg shrink-0 overflow-hidden">
                    <img src={item.product?.imageCover} alt={item.product?.title} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate text-sm">{item.product?.title}</h4>
                    <p className="text-xs text-on-surface/40">{item.quantity} × {item.price.toLocaleString()} ج.م</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-outline-variant/10 pt-6">
              <div className="flex justify-between text-on-surface/60">
                <span>المجموع الفرعي</span>
                <span>{cart.data.totalCartPrice.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between text-on-surface/60">
                <span>الشحن</span>
                <span className="text-success font-bold">مجاني</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-dashed border-outline-variant/20">
                <span>الإجمالي</span>
                <span className="text-primary">{cart.data.totalCartPrice.toLocaleString()} ج.م</span>
              </div>
            </div>

            <Button 
                type="submit" 
                className="w-full h-16 text-lg rounded-2xl shadow-xl shadow-primary/20" 
                isLoading={isCashLoading || isVodafoneLoading}
            >
              تأكيد الطلب
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
