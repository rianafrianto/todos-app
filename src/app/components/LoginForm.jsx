'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock } from 'react-icons/fi'; 
import api from '@/lib/api'; 
import Swal from 'sweetalert2'; 

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading menjadi true saat proses login dimulai
    setError(''); // Reset error message

    try {
      const response = await api.post('/login', { email, password }); 
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token); 
        localStorage.setItem('user', JSON.stringify(response.data.data.user)); 
        Swal.fire({
          title: 'Success!',
          text: 'Login berhasil!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          router.push('/'); // Redirect ke halaman utama setelah login berhasil
        });
      } else {
        setError(response.data.message); 
      }
    } catch (err) {
      setError(err.message); 
    } finally {
      setLoading(false); // Set loading menjadi false setelah proses selesai
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 ">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Login
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-400">
              <FiMail className="text-gray-400 ml-3" />
              <input
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border-none focus:outline-none rounded-r-lg"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-400">
              <FiLock className="text-gray-400 ml-3" />
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-none focus:outline-none rounded-r-lg"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading} // Disable button saat loading
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Belum punya akun?{' '}
          <a onClick={() => router.push('/register')} className="text-blue-500 hover:underline cursor-pointer">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
