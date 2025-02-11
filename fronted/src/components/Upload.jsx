import { useState, useRef } from "react";
import { uploadImage, getImageUrl } from "../appwrite";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';

const Upload = ({ onUpload }) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const validateFile = (file) => {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            setError("Please upload an image file");
            return false;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File size should be less than 5MB");
            return false;
        }

        return true;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        setError("");

        const droppedFile = e.dataTransfer.files[0];
        if (!droppedFile) {
            setError("Please drop a valid image file");
            return;
        }

        if (validateFile(droppedFile)) {
            let trimmedName = droppedFile.name.split('.')[0];
            if (trimmedName.length > 50) {
                trimmedName = trimmedName.substring(0, 50);
            }
            setFile(droppedFile);
            setName(trimmedName);
        }
    };

    const handleFileSelect = (e) => {
        setError("");
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (validateFile(selectedFile)) {
            let trimmedName = selectedFile.name.split('.')[0];
            if (trimmedName.length > 50) {
                trimmedName = trimmedName.substring(0, 50);
            }
            setFile(selectedFile);
            setName(trimmedName);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select an image file");
            return;
        }

        if (!name.trim()) {
            toast.error("Please enter a name for the image");
            return;
        }

        if (name.length > 50) {
            toast.error("Image name should be less than 50 characters");
            return;
        }

        setError("");
        setLoading(true);
        const uploadPromise = new Promise(async (resolve, reject) => {
            try {
                // Simulate progress updates
                const progressInterval = setInterval(() => {
                    setProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(progressInterval);
                            return 90;
                        }
                        return prev + 10;
                    });
                }, 500);

                const uploaded = await uploadImage(file, user.$id);
                clearInterval(progressInterval);
                setProgress(100);

                if (uploaded) {
                    onUpload({ id: uploaded.$id, name, url: getImageUrl(uploaded.$id) });
                    setFile(null);
                    setName("");
                    resolve("Image uploaded successfully!");
                }
            } catch (err) {
                console.error("Upload error:", err);
                reject(err.message || "Failed to upload image");
            } finally {
                setLoading(false);
                setTimeout(() => setProgress(0), 1000);
            }
        });

        toast.promise(uploadPromise, {
            loading: 'Uploading...',
            success: 'Image uploaded successfully!',
            error: (err) => `Upload failed: ${err}`,
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <div className="mb-4 bg-blue-50 p-4 rounded-lg">
                <h2 className="font-medium text-lg text-blue-800 mb-2">Instructions:</h2>
                <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                    <li>Drag and drop an image or click to select</li>
                    <li>All image formats are supported</li>
                    <li>Maximum file size: 5MB</li>
                    <li>Image name should be less than 50 characters</li>
                </ul>
            </div>

            <div
                className={`relative min-h-[300px] p-8 border-2 ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                } border-dashed rounded-lg transition-all duration-200 ease-in-out`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <FaCloudUploadAlt className={`text-6xl ${isDragging ? "text-blue-500" : "text-gray-400"}`} />
                    {file ? (
                        <div className="text-center">
                            <p className="text-lg font-medium text-gray-700">{file.name}</p>
                            <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-lg font-medium text-gray-700">
                                Drop your file here, or click to select
                            </p>
                            <p className="text-sm text-gray-500">
                                Maximum file size: 5MB
                            </p>
                        </div>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                />
            </div>

            <div className="mt-4 space-y-4">
                {file && (
                    <div className="space-y-2">
                        <label htmlFor="imageName" className="block text-sm font-medium text-gray-700">
                            Image Name
                        </label>
                        <input
                            id="imageName"
                            type="text"
                            placeholder="Enter image name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={name}
                            onChange={(e) => {
                                setError("");
                                setName(e.target.value);
                            }}
                        />
                        <p className="text-xs text-gray-500">
                            {name.length}/50 characters used
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}

                {progress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}

                {file && name.trim() && (
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 transition-colors"
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </span>
                        ) : (
                            "Upload Image"
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Upload;
