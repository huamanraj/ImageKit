import { useState, useEffect } from 'react';
import { FaCopy, FaCheck, FaTrash } from 'react-icons/fa';

const ImageList = ({ images }) => {
    const [copiedId, setCopiedId] = useState(null);
    const [localImages, setLocalImages] = useState([]);

    useEffect(() => {
        // Load images from local storage on mount
        const storedImages = JSON.parse(localStorage.getItem('imageList') || '[]');
        setLocalImages(storedImages);

        // Update local storage when new images are added
        if (images.length > 0) {
            const newImages = [...images, ...storedImages];
            const uniqueImages = Array.from(new Map(newImages.map(item => [item.id, item])).values());
            localStorage.setItem('imageList', JSON.stringify(uniqueImages));
            setLocalImages(uniqueImages);
        }
    }, [images]);

    const handleCopy = (id, url) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = (id) => {
        const updatedImages = localImages.filter(img => img.id !== id);
        localStorage.setItem('imageList', JSON.stringify(updatedImages));
        setLocalImages(updatedImages);
    };

    if (localImages.length === 0) {
        return (
            <div className="mt-6 text-center text-gray-500 p-4">
                <p>No images uploaded yet</p>
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-2 w-full sm:w-[70%] mx-auto">
            {localImages.map((img) => (
                <div 
                    key={img.id} 
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg gap-2  transition-colors"
                >
                    <p className="text-white truncate flex-1" title={img.name}>
                        {img.name}
                    </p>
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => handleCopy(img.id, img.url)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
                                copiedId === img.id 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            } text-white transition-colors`}
                        >
                            {copiedId === img.id ? (
                                <><FaCheck /> Copied</>
                            ) : (
                                <><FaCopy /> Copy Link</>
                            )}
                        </button>
                        <button
                            onClick={() => handleDelete(img.id)}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                            title="Delete"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImageList;
