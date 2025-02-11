import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listImages, deleteImage, getImageUrl } from '../appwrite';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingOverlay from '../components/LoadingOverlay';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { user } = useAuth();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopying, setCopying] = useState(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const imagesList = await listImages(user.$id); // Fetch file IDs

      // Directly use the image URL
      const imagesWithUrls = imagesList.map((img) => ({
        $id: img.$id,
        name: img.name,
        url: `http://localhost:5000/image/${img.$id}`, // Direct image URL
      }));

      console.log("Fetched images with URLs:", imagesWithUrls);
      setImages(imagesWithUrls);
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

  const handleCopyLink = async (fileId) => {
    setCopying(fileId);
    const url = `http://localhost:5000/image/${fileId}`;
    await navigator.clipboard.writeText(url);
    setTimeout(() => setCopying(null), 1000);
  };

  const handleDelete = async () => {
    if (deleteId) {
      setIsDeleting(true);
      const success = await deleteImage(deleteId);
      if (success) {
        await fetchImages();
      }
      setDeleteId(null);
      setIsDeleting(false);
    }
  };

  if (loading) return <LoadingOverlay />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Gallery</h1>
        <p className="text-sm text-gray-500">{images.length} images</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {images.map((image) => (
          <div 
            key={image.$id} 
            className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <img
              src={image.url}
              alt={image.name}
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200">
              <div className="absolute bottom-0 w-full p-4 space-y-2">
                <p className="text-white text-sm font-medium truncate">
                  {image.name}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyLink(image.$id)}
                    disabled={isCopying === image.$id}
                    className="flex-1 px-3 py-1.5 text-sm bg-white/90 text-gray-900 rounded-md hover:bg-white transition-colors duration-200 disabled:bg-green-500 disabled:text-white"
                  >
                    {isCopying === image.$id ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button
                    onClick={() => setDeleteId(image.$id)}
                    className="px-3 py-1.5 text-sm bg-red-500/90 text-white rounded-md hover:bg-red-500 transition-colors duration-200"
                    aria-label="Delete image"
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
