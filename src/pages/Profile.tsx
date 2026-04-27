import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useGetMeQuery, useUpdateMeMutation, useChangeMyPasswordMutation } from '../features/auth/authApi';
import { logout } from '../features/auth/authSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: profileData, isLoading } = useGetMeQuery();
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
  const [changeMyPassword, { isLoading: isChangingPassword }] = useChangeMyPasswordMutation();

  const user = profileData?.data;

  // Profile form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileImgFile, setProfileImgFile] = useState<File | null>(null);
  const [profileImgPreview, setProfileImgPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'orders'>('info');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImgFile(file);
      setProfileImgPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { name, email, phone };
      if (profileImgFile) payload.profileImg = profileImgFile;
      await updateMe(payload).unwrap();
      setProfileImgFile(null);
      toast.success('تم تحديث البيانات بنجاح');
    } catch (err: any) {
      toast.error(err.data?.message || 'فشل في تحديث البيانات');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    try {
      await changeMyPassword({ currentPassword, newPassword }).unwrap();
      toast.success('تم تغيير كلمة المرور بنجاح');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.data?.message || 'فشل في تغيير كلمة المرور');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('تم تسجيل الخروج');
    setTimeout(() => {
      location.replace("/");
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-6 mb-12">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative w-20 h-20 rounded-full shrink-0 group overflow-hidden"
        >
          {profileImgPreview || user?.profileImg ? (
            <img
              src={profileImgPreview || user?.profileImg}
              alt="profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-headline font-bold text-on-surface">{user?.name}</h1>
          <p className="text-on-surface/50">{user?.email}</p>
        </div>
        <Button variant="ghost" onClick={handleLogout} className="text-error hover:bg-error/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          تسجيل الخروج
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-outline-variant/10">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'info'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface/40 hover:text-on-surface/70'
          }`}
        >
          البيانات الشخصية
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'password'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface/40 hover:text-on-surface/70'
          }`}
        >
          تغيير كلمة المرور
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface/40 hover:text-on-surface/70'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          طلباتي
        </button>
      </div>

      {/* Info Tab */}
      {activeTab === 'info' && (
        <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-3xl shadow-lg border border-outline-variant/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="الاسم"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="رقم الهاتف"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={isUpdating} className="rounded-full px-10">
              حفظ التغييرات
            </Button>
          </div>
        </form>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-outline-variant/10 flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface mb-1">طلباتي</h2>
            <p className="text-on-surface/50 text-sm">تصفح وتابع جميع طلباتك السابقة</p>
          </div>
          <Link to="/orders">
            <Button className="rounded-full px-10">عرض الطلبات</Button>
          </Link>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <form onSubmit={handleChangePassword} className="bg-white p-8 rounded-3xl shadow-lg border border-outline-variant/10 space-y-6">
          <Input
            label="كلمة المرور الحالية"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="كلمة المرور الجديدة"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="تأكيد كلمة المرور الجديدة"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={isChangingPassword} className="rounded-full px-10">
              تغيير كلمة المرور
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
