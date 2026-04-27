import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-lowest border-t border-outline-variant/10 pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-xl text-primary">متجر متميز</h3>
          <p className="text-on-surface/60 text-sm leading-relaxed">
            نسعى لتقديم أفضل تجربة تسوق إلكتروني في الشرق الأوسط، مع منتجات عالية الجودة وخدمة عملاء استثنائية.
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-headline font-semibold text-on-surface">روابط سريعة</h4>
          <ul className="space-y-2 text-sm text-on-surface/60">
            <li><Link to="/products" className="hover:text-primary transition-colors">جميع المنتجات</Link></li>
            <li><Link to="/categories" className="hover:text-primary transition-colors">التصنيفات</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">من نحن</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-headline font-semibold text-on-surface">الدعم</h4>
          <ul className="space-y-2 text-sm text-on-surface/60">
            <li><Link to="/contact" className="hover:text-primary transition-colors">اتصل بنا</Link></li>
            <li><Link to="/shipping" className="hover:text-primary transition-colors">سياسة الشحن</Link></li>
            <li><Link to="/returns" className="hover:text-primary transition-colors">الاستبدال والاسترجاع</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-headline font-semibold text-on-surface">اشترك في نشرتنا</h4>
          <p className="text-sm text-on-surface/60">احصل على آخر التحديثات والعروض الحصرية.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 bg-surface-container-low rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
              اشترك
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-outline-variant/5 text-center text-xs text-on-surface/40">
        © 2024 متجر متميز. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
};

export default Footer;
