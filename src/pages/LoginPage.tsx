import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1b2b] to-[#1c2c4d] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-blue-900/30 backdrop-blur-2xl border border-blue-200/20 rounded-3xl shadow-2xl"
      >
        <div className="p-8">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-100 drop-shadow-md">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between mb-4">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-200 hover:underline hover:text-blue-100"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-red-400 text-sm font-semibold -mt-2">
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-blue-100 font-semibold rounded-lg shadow-lg hover:bg-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-900/50"
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
        </div>

        <div className="px-8 py-4 bg-blue-900/20 backdrop-blur-xl rounded-b-3xl text-center">
          <p className="text-sm text-blue-200">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-100 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;