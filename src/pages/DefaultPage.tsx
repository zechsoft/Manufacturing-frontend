import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Handle loading state or missing user
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 flex justify-center items-center"
      >
        <p className="text-white">Loading user data...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className='max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
    >
      <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
        Dashboard
      </h2>
      <div className='text-white space-y-4'>
        <p>Welcome, {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
     
      </div>
      <button
        className='w-full mt-4 bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors'
        onClick={handleLogout}
      >
        Logout
      </button>
    </motion.div>
  );
};

export default DashboardPage;