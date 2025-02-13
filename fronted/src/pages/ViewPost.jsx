import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../services/posts';
import LoadingSpinner from '../components/LoadingSpinner';
import { CiLink } from "react-icons/ci";
import toast from 'react-hot-toast';

const ViewPost = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            const postData = await getPostBySlug(slug);
            setPost(postData);
            setLoading(false);
        };
        fetchPost();
    }, [slug]);

    const handleShare = (e) => {
        e.preventDefault();
        const url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(() => {
                toast.success('Link copied to clipboard!');
            })
            .catch(() => {
                toast.error('Failed to copy link');
            });
    };

    if (loading) {
        return <LoadingSpinner text="Loading post..." />;
    }

    if (!post) {
        return (
            <div className="max-w-2xl mx-auto p-4 text-center text-gray-600">
                Post not found or has been removed.
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <article className="bg-white rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {post.title}
                    </h1>
                    <button 
                        onClick={handleShare}
                        className="text-blue-500 p-1 hover:bg-gray-300 rounded-full cursor-pointer hover:text-green-900 transition-colors"
                        title="Share"
                    >
                        <CiLink size={35} />
                    </button>
                </div>
                <div className="mb-6 text-sm text-gray-500">
                    Posted on {new Date(post.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
                <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed tracking-wide break-words bg-transparent border-none p-0">
                        {post.content}
                    </pre>
                </div>
            </article>
        </div>
    );
};

export default ViewPost;