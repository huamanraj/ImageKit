import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../services/posts';
import toast from 'react-hot-toast';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

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
            // Preserve the exact input including whitespace
            setContent(value);
        } else {
            toast.error('Content cannot exceed 20,000 characters');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        if (!content.trim()) {
            toast.error('Please enter content');
            return;
        }

        if (content.length > 20000) {
            toast.error('Content exceeds 20,000 characters limit');
            return;
        }

        setLoading(true);
        try {
            const post = await createPost(title, content, user.$id);
            toast.success('🎉 Post created successfully!');
            navigate(`/post/${post.slug}`);
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error(error.message || 'Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white rounded-lg p-6 ">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Post</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg 
                                     text-gray-800 focus:outline-none focus:border-blue-500 
                                     focus:ring-2 focus:ring-blue-200 transition duration-200
                                     shadow-sm"
                            placeholder="Enter your title here..."
                            required
                        />
                        <p className={`text-sm mt-1 ${
                            title.length > 200 ? 'text-orange-500' : 'text-gray-500'
                        }`}>
                            {title.length}/256 characters
                        </p>
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">Content</label>
                        <textarea
                            value={content}
                            onChange={handleContentChange}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg 
                                     text-gray-800 focus:outline-none focus:border-blue-500 
                                     focus:ring-2 focus:ring-blue-200 transition duration-200 
                                     min-h-[300px] shadow-sm font-mono whitespace-pre-wrap
                                     leading-relaxed tracking-wide"
                            style={{
                                resize: 'vertical',
                                tabSize: 4,
                                WebkitTabSize: 4,
                            }}
                            placeholder="Write your post content here..."
                            wrap="soft"
                            spellCheck="true"
                            required
                        />
                        <p className={`text-sm mt-1 ${
                            charCount > 18000 ? 'text-orange-500' : 'text-gray-500'
                        }`}>
                            {charCount}/20,000 characters
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg 
                                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition duration-200 font-medium shadow-sm"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Creating Post...
                            </span>
                        ) : (
                            'Create Post'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;