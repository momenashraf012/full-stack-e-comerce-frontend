import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { logout } from '../../features/auth/authSlice';
import { useGetCartQuery } from '../../features/cart/cartApi';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { items: localItems } = useSelector((state: RootState) => state.cart);

  const { data: serverCart } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const cartCount = isAuthenticated 
    ? serverCart?.numOfCartItems || 0 
    : localItems.length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-lowest/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-headline font-bold text-primary shrink-0">
          متجر متميز
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/products" className="text-sm font-medium text-on-surface/70 hover:text-primary transition-colors">
            المنتجات
          </Link>
          <Link to="/brands" className="text-sm font-medium text-on-surface/70 hover:text-primary transition-colors">
            العلامات التجارية
          </Link>
        </div>

        {/* Search - Desktop */}
        <div className="hidden md:flex flex-1 max-w-lg relative">
          <input
            type="text"
            placeholder="ابحث عن منتجات..."
            className="w-full bg-surface-container-low rounded-full px-10 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/50"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="hidden sm:block text-sm font-medium text-on-surface hover:text-primary">
                مرحباً، {user?.name.split(' ')[0]}
              </Link>
              <Link
                to="/orders"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-on-surface/70 hover:text-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                طلباتي
              </Link>
              <Button variant="ghost" size="sm" onClick={() => { dispatch(logout()); setTimeout(() => { location.replace("/"); }, 2000); }}>
                خروج
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">دخول</Button>
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-surface-container transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
