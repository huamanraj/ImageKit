import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Landing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/gallery');
        }
    }, [user, navigate]);

    if (user) return null;

    return (
        <div className="min-h-[89vh] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
            <div className="max-w-3xl text-center space-y-8">
                <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text">
                    Simple & Secure Image Upload
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Upload, store, and share your images with ease. Our platform provides a seamless
                    experience with secure storage and instant access to your media.
                </p>
                <div className="space-y-4">
                    <p className="text-gray-700">Please login to start uploading your images</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full
                                 font-semibold text-lg transition-all transform cursor-pointer 
                                 shadow-lg hover:shadow-xl"
                    >
                        Login to Get Started
                    </button>
                </div>
                {/* Removed SVG animation */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white rounded-xl shadow-md transform hover:scale-105 transition-transform">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Upload</h3>
                        <p className="text-gray-600">Quick and efficient image uploading process</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-md transform hover:scale-105 transition-transform">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Storage</h3>
                        <p className="text-gray-600">Your images are safely stored and encrypted</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-md transform hover:scale-105 transition-transform">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Sharing</h3>
                        <p className="text-gray-600">Share your images with anyone, anywhere</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
