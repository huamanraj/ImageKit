import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const { user, login, register, loading, error } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    useEffect(() => {
        if (user) {
            navigate('/upload');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            await login(formData.email, formData.password);
        } else {
            await register(formData.email, formData.password, formData.name);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h2>
                    <p className="text-gray-600">
                        {isLogin ? 'Sign in to your account' : 'Register for a new account'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-400"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-400"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-semibold
                                ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}
                                transition-colors shadow-md`}
                    >
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
