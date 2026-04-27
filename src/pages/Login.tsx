import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

import toast from 'react-hot-toast';

const schema = yup.object().shape({
  email: yup.string().email('بريد إلكتروني غير صالح').required('البريد الإلكتروني مطلوب'),
  password: yup.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').required('كلمة المرور مطلوبة'),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      toast.success('تم تسجيل الدخول بنجاح!', {
        icon: '👋',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
       setTimeout(() => {
        location.replace("/");
      }, 2000);
    } catch (err: any) {
      console.error('Failed to login:', err);
      toast.error(err.data?.message || 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.', {
        style: {
          borderRadius: '10px',
          background: '#ff4b4b',
          color: '#fff',
        },
      });
    }
  };

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-outline-variant/10">
        <h1 className="text-3xl font-headline font-bold text-on-surface mb-2 text-center">تسجيل الدخول</h1>
        <p className="text-on-surface/60 text-center mb-8">مرحباً بك مجدداً في متجرنا</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-primary" />
              <span className="text-on-surface/60">تذكرني</span>
            </label>
            <a href="#" className="text-primary hover:underline font-medium">نسيت كلمة المرور؟</a>
          </div>

          <Button type="submit" className="w-full h-12" isLoading={isLoading}>
            تسجيل الدخول
          </Button>

          <p className="text-center text-sm text-on-surface/60">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="text-primary hover:underline font-medium font-headline">أنشئ حساباً جديداً</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
