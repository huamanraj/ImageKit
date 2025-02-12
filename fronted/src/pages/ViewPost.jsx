import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../services/posts';
import LoadingSpinner from '../components/LoadingSpinner';

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
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    {post.title}
                </h1>
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