import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const PageNotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-background" dir="rtl">
      <div className="space-y-6">
        <h1 className="text-9xl font-headline font-bold text-primary opacity-20">404</h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold text-on-surface">الصفحة غير موجودة</h2>
          <p className="text-on-surface/60 max-w-md">عذراً، الصفحة التي تبحث عنها قد تم نقلها أو أنها غير موجودة حالياً.</p>
        </div>
        <Link to="/">
          <Button size="lg" className="rounded-full px-12">
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
