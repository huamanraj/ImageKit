import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { listImages, deleteImage, getImageUrl } from '../appwrite';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingOverlay from '../components/LoadingOverlay';
import toast from 'react-hot-toast';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const { user } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCopying, setCopying] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const fetchImages = async (page = 0) => {
        try {
            setLoading(true);
            const imagesList = await listImages(user.$id, 9, page * 9); // Fetch 9 images per page

            const imagesWithUrls = imagesList.map((img) => ({
                $id: img.$id,
                name: img.name,
                url: `https://imagekitbackend.vercel.app/image/${img.$id}`,
            }));

            setImages((prevImages) => {
                const newImages = [...prevImages, ...imagesWithUrls];
                const uniqueImages = Array.from(new Map(newImages.map(item => [item.$id, item])).values());
                return uniqueImages;
            });
            setHasMore(imagesList.length === 9);
        } catch (error) {
            console.error("Gallery fetch error:", error);
            setImages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchImages();
        }
    }, [user]);

    const lastImageElementRef = useRef();
    useEffect(() => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchImages(images.length / 9);
            }
        });
        if (lastImageElementRef.current) observer.current.observe(lastImageElementRef.current);
    }, [loading, hasMore]);

    const handleCopyLink = async (fileId) => {
        setCopying(fileId);
        const url = `https://imagekitbackend.vercel.app/image/${fileId}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy link');
        }
        setTimeout(() => setCopying(null), 1000);
    };

    const handleDelete = async () => {
        if (deleteId) {
            setIsDeleting(true);
            const deletePromise = new Promise(async (resolve, reject) => {
                try {
                    const success = await deleteImage(deleteId);
                    if (success) {
                        await fetchImages();
                        resolve('Image and associated data deleted successfully');
                    } else {
                        reject('Failed to delete image and associated data');
                    }
                } catch (error) {
                    console.error("Delete error:", error);
                    reject(error.message || 'Failed to delete image and associated data');
                } finally {
                    setDeleteId(null);
                    setIsDeleting(false);
                }
            });

            toast.promise(deletePromise, {
                loading: 'Deleting image and associated data...',
                success: (msg) => msg,
                error: (err) => `Delete failed: ${err}`,
            });
        }
    };

    if (loading && images.length === 0) return <LoadingOverlay />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Gallery</h1>
                <p className="text-sm text-gray-500">{images.length} images</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {images.map((image, index) => (
                    <div 
                        key={image.$id} 
                        className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        tabIndex="0"
                        ref={images.length === index + 1 ? lastImageElementRef : null}
                    >
                        <img
                            src={image.url}
                            alt={image.name}
                            className="w-full aspect-[4/3] object-cover"
                            loading="lazy"
                        />

                        {/* Modified overlay for better mobile experience */}
                        <div className="absolute inset-0 bg-black/40 sm:opacity-0 sm:hover:opacity-100 sm:focus-within:opacity-100 transition-opacity duration-200">
                            <div className="absolute bottom-0 w-full p-3 sm:p-4 space-y-2">
                                <p className="text-white text-sm font-medium truncate">
                                    {image.name}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleCopyLink(image.$id)}
                                        disabled={isCopying === image.$id}
                                        className="flex-1 px-3 py-2 sm:py-1.5 text-sm bg-white/90 text-gray-900 rounded-md hover:bg-white transition-colors duration-200 disabled:bg-green-500 disabled:text-white touch-manipulation"
                                        aria-label={`Copy link for ${image.name}`}
                                    >
                                        {isCopying === image.$id ? 'Copied!' : 'Copy Link'}
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(image.$id)}
                                        className="px-4 py-2 sm:py-1.5 text-sm bg-red-500/90 text-white rounded-md hover:bg-red-500 transition-colors duration-200 touch-manipulation"
                                        aria-label={`Delete ${image.name}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {images.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No images yet. Upload some to get started.</p>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                message="Are you sure you want to delete this image?"
            />
            {isDeleting && <LoadingOverlay />}
        </div>
    );
};

export default Gallery;
