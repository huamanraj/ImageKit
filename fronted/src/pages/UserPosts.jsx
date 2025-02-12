import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPosts, deletePost } from '../services/posts';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const PostCard = ({ post, onDelete }) => {
    const navigate = useNavigate();
    const truncatedContent = post.content.slice(0, 100) + (post.content.length > 100 ? '...' : '');
    const truncatedTitle = post.title.slice(0, 50) + (post.title.length > 50 ? '...' : '');

    const handleDelete = async (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(post.$id);
                onDelete(post.$id);
                toast.success('Post deleted successfully');
            } catch (error) {
                toast.error('Failed to delete post');
            }
        }
    };

    const handleEdit = (e) => {
        e.preventDefault();
        navigate(`/edit-post/${post.slug}`, { state: { post } });
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow h-[250px] w-full flex flex-col justify-between p-4">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-2">{truncatedTitle}</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleEdit}
                            className="text-gray-500 hover:text-blue-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{truncatedContent}</p>
            </div>
            <div className="flex justify-between items-center mt-auto">
                <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <Link
                    to={`/post/${post.slug}`}
                    className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                >
                    Read More 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

const UserPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const userPosts = await getPosts(user.$id);
                setPosts(userPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user.$id]);

    const handleDelete = (postId) => {
        setPosts(posts.filter(post => post.$id !== postId));
    };

    if (loading) {
        return <LoadingSpinner text="Loading your posts..." />;
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Posts</h1>

            {posts.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-600">You haven't created any posts yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => (
                        <PostCard key={post.$id} post={post} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserPosts;