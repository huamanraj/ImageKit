import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, Shield, Zap, Share2 } from 'lucide-react';
const Landing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    if (user) return null;

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="max-w-4xl text-center space-y-10 relative z-10">
                {/* Hero Section */}
                <div className="space-y-6">
                    <h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text leading-tight">
                        Share Your Vision<br />Securely & Seamlessly
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Experience the future of content sharing. Upload and share your images and text with
                        confidence, powered by state-of-the-art security.
                    </p>
                </div>

                {/* CTA Section */}
                <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                       rounded-full font-semibold text-lg transition-all transform hover:scale-105
                       shadow-[0_20px_50px_rgba(79,70,229,0.15)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.3)]
                       flex items-center gap-2"
                        >
                            Start Sharing Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-gray-500">No credit card required • Free plan available</p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all
                        border border-gray-100 transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Lightning Fast</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Upload and share your content instantly with our optimized platform
                        </p>
                    </div>

                    <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all
                        border border-gray-100 transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Bank-Level Security</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Enterprise-grade encryption keeps your content safe and private
                        </p>
                    </div>

                    <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all
                        border border-gray-100 transform hover:-translate-y-1">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                            <Share2 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Sharing</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Share with anyone using secure, customizable links
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing;
