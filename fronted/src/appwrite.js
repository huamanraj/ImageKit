import { Client, Account, Storage, ID, Query, Databases } from "appwrite"; // Add Databases to imports

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);

export const uploadImage = async (file, userId) => {
    try {
        const uploadedFile = await storage.createFile(
            import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID,
            ID.unique(),
            file,
            ['read("any")']
        );

        // Save file metadata in the database
        await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_ID,
            ID.unique(),
            {
                fileId: uploadedFile.$id,
                userId: userId,
                name: file.name
            }
        );

        return uploadedFile;
    } catch (error) {
        console.error("Upload error:", error);
        return null;
    }
};

export const getImageUrl = (fileId) => {
    return `https://imagekitbackend.vercel.app/image/${fileId}`;
};

export const listImages = async (userId, limit = 9, offset = 0) => {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_ID,
            [
                Query.equal('userId', userId),
                Query.limit(limit),
                Query.offset(offset)
            ]
        );
        return response.documents.map(doc => ({
            $id: doc.fileId,
            name: doc.name
        }));
    } catch (error) {
        console.error("List images error:", error);
        return [];
    }
};

export const deleteImage = async (fileId) => {
    try {
        // Delete file from storage
        await storage.deleteFile(
            import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID,
            fileId
        );

        // Find and delete the corresponding document
        const documents = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_COLLECTION_ID,
            [Query.equal('fileId', fileId)]
        );

        if (documents.documents.length > 0) {
            await databases.deleteDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_COLLECTION_ID,
                documents.documents[0].$id
            );
        }

        return true;
    } catch (error) {
        console.error("Delete error:", error);
        throw new Error("Failed to delete image and its data");
    }
};
