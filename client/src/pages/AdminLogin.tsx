import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      navigate('/admin');
    },
    onError: (error) => {
      setError('بيانات الدخول غير صحيحة');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ username, password });
  };

  const styles = {
    headerBg: { background: 'linear-gradient(to right, #1e3a8a, #1e40af)' },
    containerBg: { backgroundColor: '#f8fafc' },
    cardBg: { backgroundColor: '#ffffff' },
    blueText: { color: '#2563eb' },
    darkBlueText: { color: '#1e3a8a' },
    orangeBtn: { backgroundColor: '#ff6600', color: 'white' },
    inputBorder: { borderBottom: '1px solid #cbd5e1', borderLeft: 'none', borderRight: 'none', borderTop: 'none' },
  };

  return (
    <div style={styles.containerBg} className="min-h-screen py-12">
      {/* Header */}
      <header className="sticky top-0 z-40 shadow-lg" style={styles.headerBg}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/manus-storage/evan-clinic-logo_3b9cca8a.webp" 
              alt="Evan Clinic" 
              className="h-14 w-auto"
            />
            <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={styles.orangeBtn}
          >
            العودة للرئيسية
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="rounded-2xl p-8 shadow-lg" style={styles.cardBg}>
          <h2 className="text-3xl font-bold mb-2 text-center" style={styles.blueText}>
            لوحة التحكم
          </h2>
          <p className="text-center mb-8" style={{ color: '#64748b' }}>
            تسجيل الدخول إلى لوحة التحكم الإدارية
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-3" style={styles.darkBlueText}>
                اسم المستخدم
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="w-full px-0 py-2 font-semibold outline-none focus:outline-none bg-transparent"
                style={styles.inputBorder}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3" style={styles.darkBlueText}>
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="w-full px-0 py-2 font-semibold outline-none focus:outline-none bg-transparent"
                style={styles.inputBorder}
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50 mt-8"
              style={styles.orangeBtn}
            >
              {loginMutation.isPending ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </button>
          </form>

          {/* Default Credentials */}
          <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: '#f0f9ff', borderLeft: '4px solid #2563eb' }}>
            <p className="text-xs font-semibold mb-2" style={styles.darkBlueText}>
              بيانات الاعتماد الافتراضية:
            </p>
            <p className="text-xs" style={{ color: '#64748b' }}>
              اسم: <span className="font-mono font-bold">admin</span>
            </p>
            <p className="text-xs" style={{ color: '#64748b' }}>
              كلمة المرور: <span className="font-mono font-bold">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
