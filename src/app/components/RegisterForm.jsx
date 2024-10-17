'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiLock, FiAward } from 'react-icons/fi';
import api from '@/lib/api';
import Swal from 'sweetalert2';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Team', // Default role
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before making the API call
    try {
      const response = await api.post('/register', formData);
      if (response.data.success) {
        Swal.fire({
          title: 'Sukses!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'Tutup'
        });
        router.push('/login'); // Redirect ke halaman login setelah registrasi berhasil
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.data.message,
          icon: 'error',
          confirmButtonText: 'Tutup'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || err.message,
        icon: 'error',
        confirmButtonText: 'Tutup'
      });
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-400">
              <FiUser className="text-gray-400 ml-3" />
              <input
                type="text"
                id="name"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border-none focus:outline-none rounded-r-lg"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-400">
              <FiMail className="text-gray-400 ml-3" />
              <input
                type="email"
                id="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border-none focus:outline-none rounded-r-lg"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-400">
              <FiLock className="text-gray-400 ml-3" />
              <input
                type="password"
                id="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border-none focus:outline-none rounded-r-lg"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="role" className="block text-gray-700 mb-2">
              Role
            </label>
            <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-400">
              <FiAward className="text-gray-400 ml-3" />
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border-none focus:outline-none rounded-r-lg appearance-none"
              >
                <option value="Team">Team</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 ${loading || !formData.name || !formData.email || !formData.password ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading || !formData.name || !formData.email || !formData.password} // Disable if loading or any field is empty
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Sudah punya akun?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-blue-500 hover:underline"
          >
            Login di sini
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
