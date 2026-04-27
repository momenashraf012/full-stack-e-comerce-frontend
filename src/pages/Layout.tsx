import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Navbar />
      <main className="flex-1 pt-16 mt-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
