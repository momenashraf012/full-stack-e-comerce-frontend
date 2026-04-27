import React from 'react';
import { useGetMyOrdersQuery } from '../features/orders/orderApi';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Orders: React.FC = () => {
    const { data: response, isLoading, error } = useGetMyOrdersQuery();
    const orders = response?.data || [];

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold text-error">فشل في تحميل الطلبات</h1>
                <p className="text-on-surface/60 mt-2">يرجى المحاولة مرة أخرى لاحقاً.</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-6">
                <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center text-on-surface/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-headline font-bold text-on-surface">ليس لديك طلبات بعد</h1>
                    <p className="text-on-surface/60">ابدأ بتسوق منتجاتنا الرائعة الآن!</p>
                </div>
                <Link to="/products">
                    <Button size="lg" className="rounded-full">تصفح المنتجات</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-headline font-bold text-on-surface mb-10">طلباتي</h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div 
                        key={order._id} 
                        className="bg-white rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="bg-surface-container/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/5">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-xs text-on-surface/40 uppercase tracking-wider font-bold">تاريخ الطلب</p>
                                    <p className="font-bold text-on-surface">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface/40 uppercase tracking-wider font-bold">إجمالي المبلغ</p>
                                    <p className="font-bold text-primary">{order.totalOrderPrice.toLocaleString()} ج.م</p>
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface/40 uppercase tracking-wider font-bold">رقم الطلب</p>
                                    <p className="text-sm font-mono text-on-surface/60">#{order._id.slice(-8).toUpperCase()}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                    order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {order.isPaid ? 'تم الدفع' : 'بانتظار الدفع'}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                    order.isDelivered ? 'bg-blue-100 text-blue-700' : 'bg-surface-container-high text-on-surface/60'
                                }`}>
                                    {order.isDelivered ? 'تم التوصيل' : 'قيد المعالجة'}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-4">
                                    {order.cartItems.map((item: any) => (
                                        <div key={item._id} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-surface-container rounded-xl shrink-0 overflow-hidden">
                                                <img 
                                                    src={item.product?.imageCover} 
                                                    alt={item.product?.title} 
                                                    className="w-full h-full object-contain p-1" 
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-on-surface truncate">{item.product?.title}</h4>
                                                <p className="text-sm text-on-surface/40">الكمية: {item.quantity} × {item.price.toLocaleString()} ج.م</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="md:w-64 space-y-4 border-t md:border-t-0 md:border-r border-outline-variant/10 pt-6 md:pt-0 md:pr-8">
                                    <h4 className="font-bold text-sm text-on-surface/40 uppercase tracking-widest">عنوان الشحن</h4>
                                    <div className="text-sm space-y-1">
                                        <p className="font-bold">{order.shippingAddress.city}</p>
                                        <p className="text-on-surface/60">{order.shippingAddress.details}</p>
                                        <p className="text-on-surface/60">{order.shippingAddress.phone}</p>
                                    </div>
                                    <div className="pt-4">
                                        <p className="text-xs text-on-surface/40 font-bold mb-1">طريقة الدفع</p>
                                        <p className="text-sm font-bold">
                                            {order.paymentMethodType === 'cash' ? 'نقداً عند الاستلام' : 'فودافون كاش'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
