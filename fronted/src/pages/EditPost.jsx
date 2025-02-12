import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { updatePost, getPostBySlug } from '../services/posts';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const EditPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const navigate = useNavigate();
    const { slug } = useParams();

    useEffect(() => {
        const loadPost = async () => {
            try {
                const post = await getPostBySlug(slug);
                if (!post) {
                    toast.error('Post not found');
                    navigate('/my-posts');
                    return;
                }
                setTitle(post.title);
                setContent(post.content);
                setCharCount(post.content.length);
            } catch (error) {
                toast.error('Error loading post');
            } finally {
                setInitialLoading(false);
            }
        };
        loadPost();
    }, [slug, navigate]);

    const handleTitleChange = useCallback((e) => {
        const value = e.target.value;
        if (value.length <= 256) {
            setTitle(value);
        } else {
            toast.error('Title cannot exceed 256 characters');
        }
    }, []);

    const handleContentChange = useCallback((e) => {
        const value = e.target.value;
        const chars = value.length;
        setCharCount(chars);
        if (chars <= 20000) {
            setContent(value);
        } else {
            toast.error('Content cannot exceed 20,000 characters');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const post = await getPostBySlug(slug);
            await updatePost(post.$id, { title, content });
            toast.success('Post updated successfully!');
            navigate(`/post/${slug}`);
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error('Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <LoadingSpinner text="Loading post data..." />;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Post</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                            required
                        />
                        <p className={`text-sm mt-1 ${title.length > 200 ? 'text-orange-500' : 'text-gray-500'}`}>
                            {title.length}/256 characters
                        </p>
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">Content</label>
                        <textarea
                            value={content}
                            onChange={handleContentChange}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 min-h-[300px]"
                            required
                        />
                        <p className={`text-sm mt-1 ${charCount > 18000 ? 'text-orange-500' : 'text-gray-500'}`}>
                            {charCount}/20,000 characters
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                        >
                            {loading ? 'Updating...' : 'Update Post'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/my-posts')}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPost;
