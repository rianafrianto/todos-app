'use client';
import Link from 'next/link';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

const Navbar = (props) => {
  const { token, setToken, setUser, user } = props;

  const handleLogout = () => {
    localStorage.removeItem('token'); // Menghapus token dari localStorage
    setToken(null); // Reset state token di komponen parent
    setUser(null); // Reset state token di komponen parent
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-extrabold text-blue-500">Todo List App</h1>
      <div className="flex items-center space-x-4">
        {token ? (
          <div className="flex items-center space-x-2">
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-gray-700 font-medium">Welcome, <b>{user?.name}</b></span>
              </div>
              <span className="text-gray-600 text-sm">Role: <b>{user?.role}</b></span> {/* Menambahkan role di sini */}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-400 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link href="/login" passHref>
              <div className="flex items-center space-x-1 bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition cursor-pointer">
                <FiLogIn />
                <span>Login</span>
              </div>
            </Link>
            <Link href="/register" passHref>
              <div className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-400 transition cursor-pointer">
                <FiUserPlus />
                <span>Register</span>
              </div>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
