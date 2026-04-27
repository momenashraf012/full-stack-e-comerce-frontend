import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSignupMutation } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  name: yup.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').required('الاسم مطلوب'),
  email: yup.string().email('بريد إلكتروني غير صالح').required('البريد الإلكتروني مطلوب'),
  password: yup.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').required('كلمة المرور مطلوبة'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup, { isLoading }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const result = await signup(data).unwrap();
      dispatch(setCredentials(result));
      toast.success('تم إنشاء الحساب بنجاح!', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      navigate('/');
    } catch (err: any) {
      console.error('Failed to register:', err);
      toast.error(err.data?.message || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.', {
        style: {
          borderRadius: '10px',
          background: '#ff4b4b',
          color: '#fff',
        },
      });
    }
  };

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh] py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-outline-variant/10">
        <h1 className="text-3xl font-headline font-bold text-on-surface mb-2 text-center">إنشاء حساب جديد</h1>
        <p className="text-on-surface/60 text-center mb-8">انضم إلى متجر الرقي الآن</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="الاسم بالكامل"
            type="text"
            placeholder="أحمد محمد"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@mail.com"
            error={errors.email?.message}
            {...register('email')}
          />
          
          <Input
            label="كلمة المرور"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="تأكيد كلمة المرور"
            type="password"
            placeholder="••••••••"
            error={errors.passwordConfirm?.message}
            {...register('passwordConfirm')}
          />

          <div className="flex items-start gap-2 text-sm py-2">
            <input type="checkbox" className="mt-1 rounded text-primary" required />
            <span className="text-on-surface/60">
              أوافق على <a href="#" className="text-primary hover:underline">الشروط والأحكام</a> و <a href="#" className="text-primary hover:underline">سياسة الخصوصية</a>
            </span>
          </div>

          <Button type="submit" className="w-full h-12 mt-4" isLoading={isLoading}>
            إنشاء الحساب
          </Button>

          <p className="text-center text-sm text-on-surface/60 pt-4">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-primary hover:underline font-medium font-headline">تسجيل الدخول</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
