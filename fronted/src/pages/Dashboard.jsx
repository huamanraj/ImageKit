import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserStats } from '../appwrite';
import {
    Upload,
    Image,
    FileText,
    Edit3,
    Plus,
    Library,
    Settings,
    Share2
} from 'lucide-react';

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUploads: 0,
        publishedPosts: 0,
        totalViews: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.$id) {
                const userStats = await getUserStats(user.$id);
                setStats(userStats);
            }
        };
        fetchStats();
    }, [user]);

    const statsArray = [
        { label: 'Total Image Uploads', value: stats.totalUploads.toString() },
        { label: 'Published Posts', value: stats.publishedPosts.toString() },
        { label: 'Total Views', value: `${stats.totalViews}` }
    ];

    const features = [
        {
            title: 'Upload Images',
            description: 'Share your photos securely with custom privacy settings',
            icon: <Upload className="w-6 h-6" />,
            path: '/upload',
            color: 'bg-indigo-100 text-indigo-600'
        },
        {
            title: 'Create Posts',
            description: 'Write and publish text posts with rich formatting',
            icon: <FileText className="w-6 h-6" />,
            path: '/create-post',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            title: 'View Gallery',
            description: 'Browse through your uploaded images in a beautiful gallery',
            icon: <Image className="w-6 h-6" />,
            path: '/gallery',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            title: 'My Posts',
            description: 'Manage and edit your published text posts',
            icon: <Edit3 className="w-6 h-6" />,
            path: '/my-posts',
            color: 'bg-rose-100 text-rose-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Welcome back, {user?.name || 'User'}!
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 mt-2">Here's what you can do with your account</p>
                        </div>
                        <button
                            onClick={() => navigate('/create-post')}
                            className="flex items-center justify-center md:justify-start gap-2 px-4 md:px-6 py-2.5 md:py-3 
                            bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold 
                            transition-all hover:shadow-lg hover:scale-105 text-sm md:text-base w-full md:w-auto"
                        >
                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                            New Post
                        </button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statsArray.map((stat, index) => (
                        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
                            <p className="text-gray-600">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(feature.path)}
                            className="bg-white/80 cursor-pointer backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100
                       transition-all hover:shadow-xl hover:-translate-y-1 text-left"
                        >
                            <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </button>
                    ))}
                </div>

                
            </div>
        </div>
    );
}

export default Dashboard;